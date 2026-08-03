<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_social_links', function (Blueprint $table) {
            $table->id();

            $table->foreignId('business_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['website', 'instagram', 'whatsapp', 'uber_eats', 'rappi', 'didi_food', 'facebook',]);
            $table->string('url');
            $table->timestamps();
            $table->unique(['business_id', 'type',]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_social_links');
    }
};