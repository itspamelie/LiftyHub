<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NutritionistApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $userName;

    public function __construct(string $userName)
    {
        $this->userName = $userName;
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: '¡Tu solicitud fue aprobada! — LiftyHub Experts');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.nutritionist_approved', with: ['userName' => $this->userName]);
    }
}
