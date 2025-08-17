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
Schema::create('users', function (Blueprint $table) {
    $table->id();

    // ข้อมูลส่วนตัว
    $table->string('first_name')->nullable(); // ชื่อจริง
    $table->string('last_name')->nullable();  // นามสกุล
    $table->string('phone')->nullable();      // เบอร์โทร

    // ข้อมูลทั่วไป
    $table->string('name');                   // ชื่อผู้ใช้ / username
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->rememberToken();
    $table->foreignId('current_team_id')->nullable();

    // Profile
    $table->string('profile_photo_path', 2048)->nullable();
    $table->string('role')->default('user');

    // Social media & description
    $table->string('social_media')->nullable();   // ลิงก์ social media
    $table->text('description')->nullable();      // คำอธิบายผู้ใช้

    $table->timestamps();
});

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
