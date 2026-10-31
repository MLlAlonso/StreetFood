<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('business_live_locations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id') ->unique() ->constrained('businesses') ->cascadeOnDelete();
            $table->boolean('active')->default(false);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->index(['active', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_live_locations');
    }
};