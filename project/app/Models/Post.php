<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'tbl_posts';
    protected $fillable = [
        'title',
        'summary',
        'body',
        'thumbnail',
        'image',
        'service_id',
        'active',
        'view_count',
    ];

    protected static function booted()
    {
        static::deleting(function ($post) {
            if ($post->image) {
                @unlink(storage_path('app') . '/public/storage/posts/thumbnails/' . $post->thumbnail);
                @unlink(storage_path('app') . '/public/storage/posts/images/' . $post->image);
            }
        });
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
