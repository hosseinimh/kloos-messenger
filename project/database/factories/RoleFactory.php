<?php

namespace Database\Factories;

use App\Constants\Role;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => Role::ADMINISTRATOR_NAME,
        ];
    }
}
