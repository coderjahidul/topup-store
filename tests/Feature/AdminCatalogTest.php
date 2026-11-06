<?php

namespace Tests\Feature;

use App\Models\Game;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCatalogTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $this->seed(RolesAndPermissionsSeeder::class);
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        return $admin;
    }

    public function test_admin_can_create_game(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->post(route('admin.games.store'), [
                'name_bn' => 'ফ্রি ফায়ার',
                'name_en' => 'Free Fire',
                'slug' => 'free-fire-admin',
                'uid_label_bn' => 'প্লেয়ার UID',
                'uid_label_en' => 'Player UID',
                'description_bn' => 'বর্ণনা',
                'description_en' => 'Description',
                'requires_server' => false,
                'servers' => '',
                'sort_order' => 1,
                'is_active' => true,
            ])
            ->assertRedirect(route('admin.games.index'));

        $this->assertDatabaseHas('games', [
            'slug' => 'free-fire-admin',
            'is_active' => 1,
        ]);

        $game = Game::query()->where('slug', 'free-fire-admin')->first();
        $this->assertSame('Free Fire', $game->getTranslation('name', 'en'));
    }

    public function test_support_cannot_manage_catalog(): void
    {
        $this->seed(RolesAndPermissionsSeeder::class);
        $support = User::factory()->create();
        $support->assignRole('support');

        $this->actingAs($support)
            ->get(route('admin.games.index'))
            ->assertForbidden();
    }
}
