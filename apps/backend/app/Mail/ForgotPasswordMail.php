<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class ForgotPasswordMail extends Mailable
{
    public function __construct(
        public string $code
    ) {}

    public function build()
    {
        return $this
            ->subject( 'Password recovery' )
            ->view( 'emails.forgot-password' )
            ->with([ 'code' =>  $this->code, ]);
    }
}