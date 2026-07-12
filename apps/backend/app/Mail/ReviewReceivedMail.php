<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class ReviewReceivedMail extends Mailable
{
    public function __construct(
        public string $businessName,
        public string $reviewerName,
        public int $rating,
        public string $comment
    ) {}

    public function build()
    {
        return $this->subject('New review received')->view('emails.review-received');
    }
}
