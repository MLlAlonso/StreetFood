<?php

namespace App\Modules\Auth\Services;

use Carbon\Carbon;
use App\Models\EmailVerification;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerificationCode;

class EmailVerificationService
{
    public function sendCode( string $email)
    {
        $code = str_pad(
            random_int(0, 999999),
            6, '0', STR_PAD_LEFT
        );

        EmailVerification::where( 'email', $email )->delete();

        EmailVerification::create([
            'email' => $email,
            'code' => $code,
            'expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($email) ->send(new EmailVerificationCode( $code ) );
    }

    public function verify( string $email, string $code ): bool {
        $verification =
            EmailVerification::where( 'email', $email)
            ->where( 'code', $code)
            ->first();

        if (
            !$verification
        ) {
            return false;
        }

        if (
            Carbon::parse( $verification->expires_at)->isPast()
        ) {
            return false;
        }

        $verification->delete();
        return true;
    }
}