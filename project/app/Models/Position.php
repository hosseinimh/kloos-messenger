<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Position extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_positions';
    protected $fillable = [
        'title',
        'image',
        'parent_id',
        'priority',
    ];

    protected static function booted()
    {
        static::deleting(function ($position) {
            foreach ($position->positions as $position) {
                $position->delete();
            }
        });
    }

    public function positions()
    {
        return $this->hasMany(Position::class, 'parent_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'tbl_position_users')->using(PositionUser::class);
    }
}
