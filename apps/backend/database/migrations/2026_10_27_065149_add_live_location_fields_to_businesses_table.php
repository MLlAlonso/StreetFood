<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->boolean('live_location_enabled')->default(false);
            $table->decimal('live_latitude', 10, 7)->nullable();
            $table->decimal('live_longitude', 10, 7)->nullable();
            $table->timestamp('live_location_updated_at')->nullable();
            $table->index(
                ['live_location_enabled', 'live_location_updated_at'],
                'businesses_live_location_status_idx'
            );
        });
    }

    public function down(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->dropIndex('businesses_live_location_status_idx');

            $table->dropColumn([
                'live_location_enabled',
                'live_latitude',
                'live_longitude',
                'live_location_updated_at',
            ]);
        });
    }
};