<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class EmailVerificationCode extends Mailable
{
    public function __construct(
        public string $code
    ) {}

    public function build()
    {
        return $this
            ->subject('Verify your email')
            ->view( 'emails.verify-email');
    }
}