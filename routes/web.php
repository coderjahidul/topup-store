<?php

use App\Http\Controllers\LocaleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Storefront\CheckoutPreviewController;
use App\Http\Controllers\Storefront\GameController;
use App\Http\Controllers\Storefront\HomeController;
use App\Http\Controllers\Storefront\PageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');

Route::post('/locale', [LocaleController::class, 'update'])->name('locale.update');

Route::get('/games/{game:slug}', [GameController::class, 'show'])->name('games.show');
Route::post('/games/{game:slug}/checkout-preview', CheckoutPreviewController::class)
    ->middleware('throttle:10,1')
    ->name('games.checkout-preview');

Route::get('/pages/{page}', [PageController::class, 'show'])
    ->whereIn('page', PageController::PAGES)
    ->name('pages.show');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
