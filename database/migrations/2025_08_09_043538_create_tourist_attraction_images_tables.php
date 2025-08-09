<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tourist_attraction_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tourist_attraction_id')
                  ->constrained('tourist_attractions')
                  ->onDelete('cascade');
            $table->string('image_path'); // เก็บชื่อไฟล์หรือ path รูป
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tourist_attraction_images');
    }
};
