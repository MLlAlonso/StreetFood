<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_hours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id') ->constrained() ->cascadeOnDelete();

            /*
            |--------------------------------------------------------------------------
            | 0 = Sunday
            | 1 = Monday
            | ...
            | 6 = Saturday
            |--------------------------------------------------------------------------
            */
            $table->tinyInteger('day_of_week');
            $table->boolean('enabled') ->default(false);
            $table->time('open_time') ->nullable();
            $table->time('close_time') ->nullable();
            $table->timestamps();

            $table->unique([
                'business_id',
                'day_of_week',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_hours');
    }
};