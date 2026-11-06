<?php

namespace App\Http\Controllers\Storefront;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Game;
use App\Models\Notice;
use App\Models\Order;
use App\Models\Package;
use App\Models\Review;
use App\Models\Setting;
use App\Support\Mask;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the public storefront home page.
     */
    public function __invoke(Request $request): Response
    {
        $locale = app()->getLocale();

        $banners = Banner::query()
            ->active()
            ->ordered()
            ->get()
            ->map(fn (Banner $banner) => [
                'id' => $banner->id,
                'title' => $banner->getTranslation('title', $locale),
                'image' => $banner->image,
                'link' => $banner->link,
            ]);

        $notices = Notice::query()
            ->active()
            ->latest('id')
            ->get()
            ->map(fn (Notice $notice) => [
                'id' => $notice->id,
                'message' => $notice->getTranslation('message', $locale),
            ]);

        $games = Game::query()
            ->active()
            ->ordered()
            ->withCount(['packages' => fn ($query) => $query->active()])
            ->get()
            ->map(fn (Game $game) => $this->transformGameCard($game, $locale));

        $popularPackages = Package::query()
            ->active()
            ->with(['game' => fn ($query) => $query->active()])
            ->whereHas('game', fn ($query) => $query->active())
            ->whereNotNull('discount_price')
            ->ordered()
            ->limit(8)
            ->get()
            ->map(fn (Package $package) => $this->transformPackageCard($package, $locale));

        $flashSaleEndsAt = Setting::getValue('flash_sale_ends_at', now()->endOfDay()->toIso8601String());

        $recentOrders = Order::query()
            ->whereIn('status', [OrderStatus::Completed, OrderStatus::Processing, OrderStatus::Pending])
            ->with(['game', 'package', 'user'])
            ->latest('id')
            ->limit(10)
            ->get()
            ->map(fn (Order $order) => [
                'id' => $order->id,
                'name' => Mask::name($order->customerName()),
                'game' => $order->game?->getTranslation('name', $locale),
                'package' => $order->package?->getTranslation('name', $locale),
                'status' => $order->status->value,
                'created_at' => $order->created_at?->diffForHumans(),
            ]);

        $reviews = Review::query()
            ->approved()
            ->latest('id')
            ->limit(6)
            ->get()
            ->map(fn (Review $review) => [
                'id' => $review->id,
                'name' => Mask::name($review->name),
                'rating' => $review->rating,
                'comment' => $review->comment,
            ]);

        return Inertia::render('Home', [
            'banners' => $banners,
            'notices' => $notices,
            'games' => $games,
            'popularPackages' => $popularPackages,
            'flashSaleEndsAt' => $flashSaleEndsAt,
            'recentOrders' => $recentOrders,
            'reviews' => $reviews,
            'supportWhatsapp' => Setting::getValue('support_whatsapp'),
            'facebookLink' => Setting::getValue('facebook_link'),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function transformGameCard(Game $game, string $locale): array
    {
        return [
            'id' => $game->id,
            'slug' => $game->slug,
            'name' => $game->getTranslation('name', $locale),
            'image' => $game->image,
            'packages_count' => $game->packages_count,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function transformPackageCard(Package $package, string $locale): array
    {
        return [
            'id' => $package->id,
            'name' => $package->getTranslation('name', $locale),
            'price' => $package->price,
            'discount_price' => $package->discount_price,
            'game' => [
                'slug' => $package->game?->slug,
                'name' => $package->game?->getTranslation('name', $locale),
            ],
        ];
    }
}
