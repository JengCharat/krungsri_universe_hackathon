<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // ตาราง trips
        Schema::create('trips', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->date('start_date')->nullable();
            $table->text('conditions')->nullable();
            $table->integer('max_people')->default(1);
            $table->unsignedInteger('current_people')->default(0);
            $table->string('status')->default('ongoing'); // ongoing, ended
            $table->boolean('needs_guide')->default(false);   // ต้องการไกด์
            $table->boolean('needs_driver')->default(false);  // ต้องการคนขับ
            $table->timestamps();
        });

        // ตาราง trip_tourist_attraction
        Schema::create('trip_tourist_attraction', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained()->onDelete('cascade');
            $table->foreignId('tourist_attraction_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });

        // ตาราง trip_user
        Schema::create('trip_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->boolean('confirmed_end')->default(false); // ยืนยันจบทริปหรือยัง
            $table->timestamps();
        });

        // ตาราง trip_guides
        Schema::create('trip_guides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained()->onDelete('cascade');
            $table->foreignId('guide_id')->constrained('users')->onDelete('cascade');
            $table->decimal('price', 10, 2)->nullable();
            $table->enum('status', ['pending', 'selected', 'rejected'])->default('pending');
            $table->boolean('confirmed_end')->default(false); // ยืนยันจบทริปหรือยัง
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('trip_guides');
        Schema::dropIfExists('trip_user');
        Schema::dropIfExists('trip_tourist_attraction');
        Schema::dropIfExists('trips');
    }
};
