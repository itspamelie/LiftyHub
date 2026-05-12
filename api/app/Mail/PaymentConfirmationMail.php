<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $planName,
        public string $planPrice,
        public string $endDate,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Pago confirmado — Plan ' . $this->planName . ' activado ✅');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.payment_confirmation');
    }
}
