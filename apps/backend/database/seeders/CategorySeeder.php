<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Pizza',
            'Burgers',
            'Desserts',
            'Coffee',
            'Hot Dogs',
            'Boneless',
            'Sushi',
            'SeaFood',
            'Japanese',
            'Italian',
            'Mexican',
            'Chinese',
        ];

        foreach ($categories as $category) {
            Category::create([
                'name' => $category,
            ]);
        }
    }
}