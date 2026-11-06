<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class StaticPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_static_pages_render_seeded_content(): void
    {
        $this->seed();

        $this->get(route('pages.show', 'about'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Static/Show')
                ->where('page', 'about')
                ->has('title')
                ->has('content')
            );
    }

    public function test_unknown_static_page_returns_not_found(): void
    {
        $this->get('/pages/does-not-exist')->assertNotFound();
    }
}
