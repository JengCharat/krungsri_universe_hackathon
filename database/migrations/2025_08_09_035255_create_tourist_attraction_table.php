<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tourist_attractions', function (Blueprint $table) {
            $table->id();
             $table->foreignId('posted_by')
              ->constrained('users') // อ้างอิงไปที่ users.id
              ->onDelete('cascade'); // ถ้าลบ user ให้ลบ attraction ด้วย
            $table->string('image')->nullable(); // เก็บ path หรือ URL ของรูป
            $table->decimal('latitude', 10, 7);  // ละติจูด
            $table->decimal('longitude', 10, 7); // ลองจิจูด
            $table->text('description')->nullable(); // คำอธิบายคร่าวๆ
            $table->time('open_time')->nullable();
            $table->time('close_time')->nullable();
            $table->decimal('entrance_fee', 8, 2)->default(0)->nullable();  // ค่าเข้า
                $table->enum('tag', [
                'beach',        // ชายทะเล
                'mountain',     // ภูเขา
                'temple',       // วัด/ศาสนสถาน
                'historical',   // แหล่งประวัติศาสตร์
                'cultural',     // วัฒนธรรม/ชุมชน
                'shopping',     // ช้อปปิ้ง/ตลาด
                'food',         // ร้านอาหาร/ของกิน
                'adventure',    // กีฬา/ผจญภัย
                'other'         // อื่นๆ
            ])->default('other');
            $table->string('contact_info')->nullable(); // เช่น เบอร์โทร, อีเมล, เว็บไซต์
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tourist_attractions');
    }
};
