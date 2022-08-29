<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->title(),
            'summary' => $this->faker->paragraph(1),
            'body' => $this->faker->paragraph(5),
            'service_id' => rand(1, 5),
            'active' => 1,
            'view_count' => 0,
        ];
    }
}
