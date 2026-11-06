<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AddMoneyController;
use App\Http\Controllers\Admin\BannerController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GameController;
use App\Http\Controllers\Admin\NoticeController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'permission:admin.access'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', DashboardController::class)->name('dashboard');

        Route::get('/orders', [OrderController::class, 'index'])
            ->middleware('permission:orders.view')
            ->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])
            ->middleware('permission:orders.view')
            ->name('orders.show');
        Route::post('/orders/{order}/processing', [OrderController::class, 'processing'])
            ->middleware('permission:orders.manage')
            ->name('orders.processing');
        Route::post('/orders/{order}/complete', [OrderController::class, 'complete'])
            ->middleware('permission:orders.manage')
            ->name('orders.complete');
        Route::post('/orders/{order}/fail', [OrderController::class, 'fail'])
            ->middleware('permission:orders.manage')
            ->name('orders.fail');
        Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])
            ->middleware('permission:orders.manage')
            ->name('orders.cancel');
        Route::post('/orders/{order}/note', [OrderController::class, 'note'])
            ->middleware('permission:orders.manage')
            ->name('orders.note');

        Route::get('/add-money', [AddMoneyController::class, 'index'])
            ->middleware('permission:wallet.manage')
            ->name('add-money.index');
        Route::post('/add-money/{addMoneyRequest}/approve', [AddMoneyController::class, 'approve'])
            ->middleware('permission:wallet.manage')
            ->name('add-money.approve');
        Route::post('/add-money/{addMoneyRequest}/reject', [AddMoneyController::class, 'reject'])
            ->middleware('permission:wallet.manage')
            ->name('add-money.reject');

        Route::middleware('permission:catalog.manage')->group(function () {
            Route::resource('games', GameController::class)->except(['show']);
            Route::resource('packages', PackageController::class)->except(['show']);
            Route::resource('coupons', CouponController::class)->except(['show']);
            Route::resource('banners', BannerController::class)->except(['show']);
            Route::resource('notices', NoticeController::class)->except(['show']);
            Route::resource('payment-methods', PaymentMethodController::class)
                ->parameters(['payment-methods' => 'payment_method'])
                ->except(['show']);
        });

        Route::get('/users', [UserController::class, 'index'])
            ->middleware('permission:users.view')
            ->name('users.index');
        Route::get('/users/{user}', [UserController::class, 'show'])
            ->middleware('permission:users.view')
            ->name('users.show');
        Route::post('/users/{user}/block', [UserController::class, 'block'])
            ->middleware('permission:users.manage')
            ->name('users.block');
        Route::post('/users/{user}/unblock', [UserController::class, 'unblock'])
            ->middleware('permission:users.manage')
            ->name('users.unblock');
        Route::post('/users/{user}/adjust-balance', [UserController::class, 'adjustBalance'])
            ->middleware('permission:wallet.manage')
            ->name('users.adjust-balance');
        Route::post('/users/{user}/roles', [UserController::class, 'updateRoles'])
            ->middleware('permission:users.manage')
            ->name('users.roles');

        Route::get('/reviews', [ReviewController::class, 'index'])
            ->middleware('permission:catalog.manage')
            ->name('reviews.index');
        Route::post('/reviews/{review}/approve', [ReviewController::class, 'approve'])
            ->middleware('permission:catalog.manage')
            ->name('reviews.approve');
        Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])
            ->middleware('permission:catalog.manage')
            ->name('reviews.destroy');

        Route::get('/settings', [SettingController::class, 'edit'])
            ->middleware('permission:settings.manage')
            ->name('settings.edit');
        Route::put('/settings', [SettingController::class, 'update'])
            ->middleware('permission:settings.manage')
            ->name('settings.update');

        Route::get('/activity', ActivityLogController::class)
            ->middleware('permission:activity.view')
            ->name('activity.index');
    });
