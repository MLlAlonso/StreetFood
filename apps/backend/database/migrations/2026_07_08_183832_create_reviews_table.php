<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            /* Usuario que escribió la reseña */
            $table->foreignId('user_id') ->constrained() ->cascadeOnDelete();
            /* Negocio reseñado */
            $table->foreignId('business_id') ->constrained() ->cascadeOnDelete();
            /* Rating */
            $table->unsignedTinyInteger('rating');
            /* Comentario */
            $table->text('comment');
            $table->timestamps();

            /* Un usuario solamente puede dejar una reseña por negocio. */
            $table->unique([ 'user_id', 'business_id', ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};