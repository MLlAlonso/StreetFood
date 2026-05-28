<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id') ->constrained() ->cascadeOnDelete();
            $table->foreignId('category_id') ->constrained() ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_category');
    }
};