<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'username' => '09123180050',
            'password' => '1234',
            'mobile' => '09123180050',
            'name' => 'محمود',
            'family' => 'حسینی',
            'remember_token' => Str::random(10),
        ];
    }
}
