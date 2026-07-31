<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->boolean('schedule_enabled')->default(false)->after('longitude');

            $table->enum(
                'manual_override',
                [
                    'none',
                    'open',
                    'closed',
                ]
            )
                ->default('none')
                ->after('schedule_enabled');
        });
    }

    public function down(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn([
                'schedule_enabled',
                'manual_override',
            ]);
        });
    }
};