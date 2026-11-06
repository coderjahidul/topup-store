<?php

use App\Http\Controllers\Customer\DashboardController;
use App\Http\Controllers\Customer\OrderController as CustomerOrderController;
use App\Http\Controllers\Customer\ReferralController;
use App\Http\Controllers\Customer\ReviewController;
use App\Http\Controllers\Customer\WalletTransactionController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Storefront\AddMoneyController;
use App\Http\Controllers\Storefront\GameController;
use App\Http\Controllers\Storefront\HomeController;
use App\Http\Controllers\Storefront\OrderController;
use App\Http\Controllers\Storefront\OrderTrackingController;
use App\Http\Controllers\Storefront\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::post('/locale', [LocaleController::class, 'update'])->name('locale.update');

Route::get('/games/{game:slug}', [GameController::class, 'show'])->name('games.show');
Route::post('/games/{game:slug}/orders', [OrderController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('orders.store');

Route::get('/track-order', [OrderTrackingController::class, 'create'])->name('orders.track');
Route::post('/track-order', [OrderTrackingController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('orders.track.lookup');
Route::get('/track-order/result', [OrderTrackingController::class, 'show'])
    ->middleware('throttle:10,1')
    ->name('orders.track.show');

Route::get('/pages/{page}', [PageController::class, 'show'])
    ->whereIn('page', PageController::PAGES)
    ->name('pages.show');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::get('/my/orders', [CustomerOrderController::class, 'index'])->name('customer.orders.index');
    Route::get('/my/orders/{order}', [CustomerOrderController::class, 'show'])->name('customer.orders.show');
    Route::post('/my/orders/{order}/reorder', [CustomerOrderController::class, 'reorder'])->name('customer.orders.reorder');
    Route::post('/my/orders/{order}/reviews', [ReviewController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('customer.reviews.store');

    Route::get('/my/transactions', WalletTransactionController::class)->name('customer.transactions');
    Route::get('/my/referrals', ReferralController::class)->name('customer.referrals');

    Route::get('/wallet/add-money', [AddMoneyController::class, 'create'])->name('wallet.add-money');
    Route::post('/wallet/add-money', [AddMoneyController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('wallet.add-money.store');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
