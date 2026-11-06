<?php

namespace Database\Factories;

use App\Models\Notice;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Notice>
 */
class NoticeFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'message' => [
                'bn' => 'সব অর্ডার ৫–১৫ মিনিটের মধ্যে ডেলিভারি হয়।',
                'en' => 'All orders are delivered within 5–15 minutes.',
            ],
            'is_active' => true,
        ];
    }
}
