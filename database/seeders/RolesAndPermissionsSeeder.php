<?php

namespace Database\Seeders;

use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Seed application roles and baseline permissions.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'admin.access',
            'orders.view',
            'orders.manage',
            'users.view',
            'users.manage',
            'wallet.manage',
            'reports.view',
            'reports.export',
            'catalog.manage',
            'settings.manage',
            'activity.view',
        ];

        foreach ($permissions as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $roles = [
            'super_admin' => $permissions,
            'admin' => [
                'admin.access',
                'orders.view',
                'orders.manage',
                'users.view',
                'users.manage',
                'wallet.manage',
                'reports.view',
                'reports.export',
                'catalog.manage',
                'settings.manage',
                'activity.view',
            ],
            'support' => [
                'admin.access',
                'orders.view',
                'orders.manage',
                'users.view',
            ],
            'accountant' => [
                'admin.access',
                'reports.view',
                'reports.export',
                'wallet.manage',
                'orders.view',
            ],
            'reseller' => [],
            'customer' => [],
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::findOrCreate($roleName, 'web');
            $role->syncPermissions($rolePermissions);
        }

        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Admin',
                'phone' => '01700000000',
                'password' => Hash::make('password'),
                'locale' => 'bn',
                'balance' => 0,
                'status' => UserStatus::Active,
                'referral_code' => 'ADMIN001',
                'email_verified_at' => now(),
            ],
        );

        if (! $admin->hasRole('super_admin')) {
            $admin->assignRole('super_admin');
        }

        if (! $admin->hasRole('customer')) {
            $admin->assignRole('customer');
        }
    }
}
