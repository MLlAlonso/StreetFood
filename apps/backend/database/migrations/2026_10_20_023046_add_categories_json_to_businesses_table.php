<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->json('categories')->nullable();
        });

        // Conserva las categorías existentes antes de cambiar la aplicación para utilizar el campo JSON.
        $businesses = DB::table('businesses')->select('id')->orderBy('id')->get();

        foreach ($businesses as $business) {
            $categories = DB::table('business_category')
                ->join('categories', 'business_category.category_id', '=', 'categories.id')
                ->where('business_category.business_id', $business->id)
                ->orderBy('categories.id')
                ->pluck('categories.name')
                ->values()
                ->all();

            DB::table('businesses')
                ->where('id', $business->id)
                ->update(['categories' => json_encode($categories, JSON_UNESCAPED_UNICODE),]);
        }
    }

    public function down(): void
    {
        Schema::table('businesses', function (Blueprint $table) {
            $table->dropColumn('categories');
        });
    }
};