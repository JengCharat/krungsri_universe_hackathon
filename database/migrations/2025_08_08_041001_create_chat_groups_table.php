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
        Schema::create('chat_groups', function (Blueprint $table) {
            $table->id();

            // Fields
            $table->string('name', 255); // ชื่อกลุ่ม
            $table->text('description')->nullable(); // คำอธิบาย (optional)
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade'); // user_id ของเจ้าของกลุ่ม
            $table->timestamps(); // created_at, updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_groups');
    }
};
