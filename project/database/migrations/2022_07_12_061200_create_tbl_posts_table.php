<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblPostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title', 100);
            $table->string('summary', 255);
            $table->text('body');
            $table->string('thumbnail')->nullable();
            $table->string('image')->nullable();
            $table->unsignedBigInteger('service_id');
            $table->unsignedTinyInteger('active');
            $table->unsignedBigInteger('view_count');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('service_id')->references('id')->on('tbl_services');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tbl_posts', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
}
