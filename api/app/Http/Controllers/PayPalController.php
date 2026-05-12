<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use App\Models\Plan;
use App\Models\User;
use App\Models\Subscription;
use App\Mail\PaymentConfirmationMail;
use Carbon\Carbon;

class PayPalController extends Controller
{
    private function baseUrl(): string
    {
        return env('PAYPAL_MODE', 'sandbox') === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }

    private function getAccessToken(): string
    {
        $response = Http::withBasicAuth(
            env('PAYPAL_CLIENT_ID'),
            env('PAYPAL_CLIENT_SECRET')
        )->asForm()->post($this->baseUrl() . '/v1/oauth2/token', [
            'grant_type' => 'client_credentials',
        ]);

        return $response->json('access_token') ?? '';
    }

    public function createOrder(Request $request)
    {
        $validated = $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $plan  = Plan::findOrFail($validated['plan_id']);
        $token = $this->getAccessToken();

        $response = Http::withToken($token)
            ->post($this->baseUrl() . '/v2/checkout/orders', [
                'intent' => 'CAPTURE',
                'purchase_units' => [[
                    'amount' => [
                        'currency_code' => 'MXN',
                        'value'         => number_format((float) $plan->price, 2, '.', ''),
                    ],
                    'description' => 'Plan ' . $plan->name . ' - LiftyHub',
                ]],
                'application_context' => [
                    'return_url' => 'liftyhub://payment/success',
                    'cancel_url' => 'liftyhub://payment/cancel',
                    'brand_name' => 'LiftyHub',
                    'user_action' => 'PAY_NOW',
                ],
            ]);

        $order = $response->json();

        if (empty($order['id'])) {
            return response()->json(['status' => 'error', 'message' => 'No se pudo crear la orden'], 500);
        }

        $approvalUrl = collect($order['links'] ?? [])->firstWhere('rel', 'approve')['href'] ?? null;

        return response()->json([
            'status'       => 'ok',
            'order_id'     => $order['id'],
            'approval_url' => $approvalUrl,
        ]);
    }

    public function captureOrder(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|string',
            'plan_id'  => 'required|exists:plans,id',
            'user_id'  => 'required|exists:users,id',
        ]);

        \Log::info('PayPal capture request', ['order_id' => $validated['order_id']]);

        $token    = $this->getAccessToken();
        $response = Http::withToken($token)
            ->withBody('{}', 'application/json')
            ->post($this->baseUrl() . "/v2/checkout/orders/{$validated['order_id']}/capture");

        $result = $response->json();

        \Log::info('PayPal capture response', ['result' => $result]);

        if (($result['status'] ?? '') !== 'COMPLETED') {
            return response()->json(['status' => 'error', 'message' => 'El pago no fue completado', 'debug' => $result['status'] ?? 'no status'], 400);
        }

        $start        = Carbon::now();
        $end          = $start->copy()->addMonth();
        $subscription = Subscription::create([
            'user_id'    => $validated['user_id'],
            'plan_id'    => $validated['plan_id'],
            'start_date' => $start->toDateString(),
            'end_date'   => $end->toDateString(),
            'status'     => 'active',
        ]);

        $user = User::find($validated['user_id']);
        $plan = Plan::find($validated['plan_id']);

        if ($user && $plan) {
            try {
                Mail::to($user->email)->send(new PaymentConfirmationMail(
                    $user->name,
                    $plan->name,
                    '$' . number_format($plan->price, 0),
                    $end->format('d/m/Y'),
                ));
            } catch (\Exception $e) {
                \Log::error('Payment confirmation email failed: ' . $e->getMessage());
            }
        }

        return response()->json([
            'status'       => 'ok',
            'message'      => 'Pago completado',
            'subscription' => $subscription,
        ]);
    }
}
