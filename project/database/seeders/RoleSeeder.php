<?php

namespace Database\Seeders;

use App\Constants\Role as RoleConstant;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Role::factory()->create(['name' => RoleConstant::ADMINISTRATOR_NAME]);
        Role::factory()->create(['name' => RoleConstant::MANAGER_NAME]);
    }
}
