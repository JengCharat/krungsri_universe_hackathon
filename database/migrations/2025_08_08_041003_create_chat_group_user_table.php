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
        Schema::create('chat_group_user', function (Blueprint $table) {
            $table->id();

            // Foreign Keys
            $table->foreignId('chat_group_id')->constrained('chat_groups')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Extra Fields
            $table->enum('role', ['owner', 'admin', 'member','guide'])->default('member');
            $table->timestamp('joined_at')->useCurrent();

            $table->timestamps();

            // Optional: unique constraint to prevent duplicate user in same group
            $table->unique(['chat_group_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_group_user');
    }
};
