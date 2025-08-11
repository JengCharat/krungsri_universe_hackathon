<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // ตาราง trips (แก้ไข)
        Schema::create('trips', function (Blueprint $table) {

            $table->id();
            $table->string('name');

         $table->foreignId('created_by')->constrained('users')->onDelete('cascade'); // owner_id FK
            $table->date('start_date')->nullable();
            $table->text('conditions')->nullable(); // เงื่อนไขร่วมทริป
             $table->integer('max_people')->default(1);
            $table->unsignedInteger('current_people')->default(0); // ตอนนี้มีกี่คนแล้ว
            $table->timestamps();
        });

        // ตาราง trip_tourist_attraction
        Schema::create('trip_tourist_attraction', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained()->onDelete('cascade');
            $table->foreignId('tourist_attraction_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });


        // ตาราง trip_guides (ใหม่)
        Schema::create('trip_guides', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trip_id')->constrained()->onDelete('cascade');
            $table->foreignId('guide_id')->constrained('users')->onDelete('cascade'); // guide เก็บใน users table
            $table->decimal('price', 10, 2)->nullable(); // ราคาที่เสนอ
            $table->enum('status', ['pending', 'selected', 'rejected'])->default('pending'); // สถานะ guide ใน trip
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
