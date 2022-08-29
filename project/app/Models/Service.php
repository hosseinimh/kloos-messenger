<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_services';
    protected $fillable = [
        'title',
        'image',
        'parent_id',
        'priority',
    ];

    protected static function booted()
    {
        static::deleting(function ($service) {
            if ($service->image) {
                @unlink(storage_path('app') . '/public/storage/services/images/' . $service->image);
            }

            foreach ($service->services as $srv) {
                $srv->delete();
            }

            foreach ($service->posts as $post) {
                $post->delete();
            }
        });
    }

    public function services()
    {
        return $this->hasMany(Service::class, 'parent_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'service_id');
    }
}
