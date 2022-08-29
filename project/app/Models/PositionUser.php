<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\Pivot;

class PositionUser extends Pivot
{
    use SoftDeletes;

    protected $table = 'tbl_position_users';
}
