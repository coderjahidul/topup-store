# CURSOR MASTER PROMPT: Game Top-up & Diamond Store (Laravel + React + Inertia)

You are a senior full-stack engineer. Build a production-ready **Game Top-up / Diamond selling web application** for the Bangladesh market. Work in phases. After each phase, stop, summarize what you built, list the files changed, and wait for my "continue" before starting the next phase. Never skip tests, validation, or security.

---

## 1. TECH STACK (fixed, do not change)

- Backend: **Laravel 11** (PHP 8.2+)
- Frontend: **React 18 + Inertia.js** (use Laravel Breeze React stack as base)
- Styling: **Tailwind CSS**
- Database: **MySQL**
- Cache/Queue/Session: **Redis** (fallback to database driver in local)
- Admin panel: custom Inertia pages (AdminLayout), role-protected
- Excel/PDF export: `maatwebsite/excel`, `barryvdh/laravel-dompdf`
- Translatable DB content: `spatie/laravel-translatable`
- Permissions: `spatie/laravel-permission` (roles: super_admin, admin, support, accountant, reseller, customer)
- Activity log: `spatie/laravel-activitylog`
- Testing: Pest or PHPUnit (feature tests for every money flow)

---

## 2. PRODUCT OVERVIEW

A website where customers buy in-game currency (Free Fire Diamond, PUBG UC, Mobile Legends Diamond, etc.) by entering their Player UID. Customers can order as **guest** (no account) or as **registered user** (wallet, history, coupons).

Primary payment methods: **bKash, Nagad, Rocket** (manual TrxID verification first, gateway/API later) plus **wallet balance**.

Delivery: **manual** (admin tops up via supplier panel and marks complete) first, with a **supplier API abstraction** so auto top-up can be plugged in later.

---

## 3. LANGUAGES (Bangla + English)

- Default locale: `bn`. Supported: `bn`, `en`.
- Static UI strings: `lang/bn.json` and `lang/en.json`. Share translations through `HandleInertiaRequests`. Create a React hook `useTrans()` returning `t(key)`.
- Language switcher in navbar (বাংলা | English). Store in session/cookie; for logged-in users save in `users.locale`.
- Database content (game name, package name, description, notice, banner title) uses `spatie/laravel-translatable` (JSON columns, `bn` and `en`).
- Bangla validation messages in `lang/bn/validation.php`.
- Fonts: Hind Siliguri (bn), Inter (en). Switch with `html[lang]`.
- Keep money amounts, UIDs, TrxIDs in English digits always.
- Emails/SMS follow the recipient's locale.

---

## 4. DATABASE SCHEMA (create migrations, models, factories, seeders)

- `users`: id, name, email (nullable unique), phone (unique), password, locale, balance (decimal 12,2 default 0), status (active/blocked), referral_code (unique), referred_by (nullable), last_player_uid (nullable), email_verified_at, timestamps. Use spatie roles.
- `games`: id, name (json), slug (unique), image, banner, description (json), uid_label (json, e.g. "Player UID"), requires_server (bool), servers (json nullable), sort_order, is_active, timestamps, soft deletes.
- `packages`: id, game_id, name (json), price, discount_price (nullable), reseller_price (nullable), cost_price (for profit report), stock (nullable = unlimited), supplier_code (nullable), is_active, sort_order, timestamps, soft deletes.
- `orders`: id, order_number (unique, format `ORD-YYYYMMDD-XXXX`), user_id (**nullable** for guests), guest_name, guest_phone, guest_email (nullable), game_id, package_id, player_uid, server (nullable), player_name (nullable), quantity (default 1), amount, discount_amount, coupon_id (nullable), final_amount, payment_method (wallet/bkash/nagad/rocket), payment_status (unpaid/pending/paid/failed/refunded), trx_id (nullable, **unique when not null**), sender_number (nullable), status (pending/processing/completed/failed/refunded/cancelled), supplier_id (nullable), supplier_order_ref (nullable), admin_note, ip_address, user_agent, completed_at, timestamps.
- `wallet_transactions`: id, user_id, type (credit/debit), source (add_money/order/refund/admin_adjust/cashback/referral), amount, balance_before, balance_after, reference_type, reference_id, trx_id (nullable), note, timestamps. Immutable ledger: never update or delete rows.
- `add_money_requests`: id, user_id, payment_method_id, amount, sender_number, trx_id (unique), status (pending/approved/rejected), admin_id, admin_note, timestamps.
- `payment_methods`: id, name, code, account_number, account_type (personal/agent/merchant), instruction (json), logo, min_amount, max_amount, charge_percent, is_active, sort_order.
- `coupons`: id, code (unique), type (percent/fixed), value, min_order_amount, max_discount, usage_limit, used_count, per_user_limit, starts_at, expires_at, applicable_game_id (nullable), first_order_only (bool), is_active.
- `coupon_usages`: id, coupon_id, order_id, user_id (nullable), phone (nullable).
- `banners`: id, title (json), image, link, sort_order, is_active.
- `notices`: id, message (json), is_active.
- `reviews`: id, order_id, user_id (nullable), name, rating (1-5), comment, is_approved.
- `suppliers`: id, name, code, driver (class name), credentials (encrypted json), balance_cache, is_active.
- `supplier_logs`: id, order_id, supplier_id, request (json), response (json), status, timestamps.
- `settings`: key/value (site name, logo, favicon, support WhatsApp, Facebook link, maintenance flag, min order, SMS/email config).
- `referrals`, `cashback` handled through wallet_transactions + settings.

Add proper indexes on: orders(status), orders(user_id), orders(player_uid), orders(guest_phone), wallet_transactions(user_id), packages(game_id).

---

## 5. CUSTOMER FEATURES

1. **Home page**: banners slider, notice marquee, game grid, popular packages, flash sale section with countdown, recent orders feed (name partially masked), why-choose-us, reviews, FAQ, footer.
2. **Game page**: game banner, package cards (price, discount badge), UID input (with label per game), optional server select, saved last UID autofill, payment method selector, coupon field, order summary, "Buy Now".
3. **Guest checkout**: name, phone (BD format `01[3-9]XXXXXXXX`), optional email, UID, payment method, sender number, TrxID. No account needed.
4. **Registered checkout**: pay by wallet (instant debit) or manual payment.
5. **Order tracking page** (public): search by `order_number` + `phone` (both required, so nobody can see another person's order). Show timeline: Pending → Processing → Completed.
6. **Auth**: register (phone + password, email optional), login by phone or email, password reset, email/phone verification optional.
7. **Dashboard**: wallet balance, add money, order history, re-order button, transaction history, profile, change password, language preference, referral code and earnings.
8. **Add Money**: choose method, see account number and instruction, enter amount, sender number, TrxID, submit request (pending until admin approves).
9. **Reviews**: after completed order, customer can rate.
10. **Static pages**: About, Terms, Privacy, Refund Policy, Contact (admin editable).
11. **PWA**: manifest + service worker, installable on mobile.
12. **Floating support button**: WhatsApp/Messenger link from settings.

---

## 6. ADMIN FEATURES (prefix `/admin`, role-protected)

- **Dashboard**: today/week/month sales, profit (price − cost_price), orders by status, new users, pending add-money count, top games/packages, sales chart (last 30 days).
- **Games / Packages CRUD** with bn/en fields, image upload, sort order, activate/deactivate, bulk price update.
- **Orders**: filters (status, game, date, payment method, search by order no/UID/phone/TrxID), view details, actions: mark processing, complete, fail + auto-refund to wallet, cancel, add note. Show duplicate-UID and suspicious flags.
- **Add Money Requests**: approve/reject, approval credits wallet through `WalletService`.
- **Users**: list, search, block/unblock, adjust balance (requires note, written to ledger), view order and transaction history, assign role.
- **Coupons, Banners, Notices, Payment Methods, Reviews moderation, Suppliers, Settings, Static pages**.
- **Reports**: sales, profit, wallet ledger, by game, by user. Export to Excel and PDF.
- **Staff roles**: admin, support (orders only), accountant (reports and wallet only).
- **Activity log** page showing who did what.
- **Notification bell**: new order / add-money request (polling or Laravel Echo optional).

---

## 7. ARCHITECTURE RULES

- Thin controllers. Business logic in **Services**: `OrderService`, `WalletService`, `CouponService`, `PaymentVerificationService`, `SupplierService`, `NotificationService`.
- Validation in **FormRequest** classes. Authorization with **Policies** and middleware.
- Use **Enums** for statuses (OrderStatus, PaymentStatus, TransactionType).
- Use **API Resources**/Inertia props transformers. Never leak sensitive fields to the frontend.
- Use **Jobs + Queues** for: sending SMS/email, supplier API calls, report exports.
- **Supplier abstraction**: `SupplierInterface` with `placeOrder()`, `checkStatus()`, `getBalance()`, `verifyPlayer()`. Create `ManualSupplier` (default) and a `SampleApiSupplier` stub. Add a retry job with exponential backoff and write every call to `supplier_logs`. Do not hardcode any real supplier; I will add credentials later.
- Use database **transactions** with `lockForUpdate()` for any balance or stock change.
- Use `config/` and `.env` for secrets. Never commit secrets.

---

## 8. MONEY & SECURITY (critical)

- Wallet debit/credit only via `WalletService` inside `DB::transaction` with `lockForUpdate()` on the user row. Write a ledger row with `balance_before` and `balance_after` every time.
- Prevent double submit: idempotency token on order form + unique `trx_id`.
- Prevent double refund and double approval: check status inside the transaction.
- Rate limiting: login (5/min), order create (10/min per IP), add-money (5/min), order tracking (10/min).
- Captcha (Cloudflare Turnstile) on guest checkout and register.
- Validate BD phone numbers. Validate UID format per game (configurable regex).
- Normalize and validate TrxID (trim, uppercase, length) and reject duplicates.
- CSRF, XSS-safe output, mass-assignment protection (`$fillable`), SQL injection safe queries.
- Encrypt supplier credentials (`encrypted` cast).
- Secure headers, HTTPS-only cookies in production, `APP_DEBUG=false` in prod.
- Block blocked users from ordering. Log IP and user agent on orders.
- Fraud checks: flag many orders from same IP/phone/UID in short time; flag very large first orders.
- All admin actions logged in activity log.
- Image upload validation (mime, size), store with hashed names.

---

## 9. UI / UX DIRECTION

- Dark gaming theme (deep navy/black background, neon cyan/purple/orange accents), rounded cards, subtle glow on hover, smooth transitions.
- **Mobile-first**, fully responsive. Most users are on phones in Bangladesh.
- Reusable components: Navbar, Footer, GameCard, PackageCard, Modal, Toast, Skeleton loaders, EmptyState, Pagination, StatusBadge, LanguageSwitcher, CountdownTimer, PaymentMethodSelector.
- Layouts: `GuestLayout`, `AppLayout`, `AdminLayout` (sidebar + topbar).
- Checkout must be completable in 3 steps on mobile: select package → enter UID → pay.
- Lazy-load images, use WebP, optimize bundle (code-split admin pages).
- Make sure Bangla text does not break layouts (it is longer than English).
- Accessible: labels, focus states, sufficient contrast.

---

## 10. EMAIL / SMS NOTIFICATIONS

Notification channels abstracted behind `NotificationService`. Events: order placed, order completed, order failed/refunded, add-money approved/rejected, welcome. SMS provider driver is pluggable (leave a stub, I will add provider later). Send in the user's locale.

---

## 11. TESTING

Write feature tests for: guest order, wallet order, insufficient balance, concurrent wallet debit, duplicate TrxID, coupon rules, add-money approval, refund on fail, order tracking authorization, admin role access, locale switching. Add factories and a `DatabaseSeeder` with demo games (Free Fire, PUBG Mobile, Mobile Legends), packages, payment methods, an admin user (`admin@example.com` / change on first login), and sample coupons.

---

## 12. PHASES (stop after each one)

**Phase 1: Foundation**
Install Laravel 11, Breeze React (Inertia), Tailwind, packages from section 1. Configure locale system, fonts, `HandleInertiaRequests`, `useTrans`, layouts, language switcher, base theme, roles/permissions seeder. Provide `.env.example` and setup instructions.

**Phase 2: Database & Models**
All migrations, enums, models with relationships and casts, factories, seeders.

**Phase 3: Public Storefront**
Home, game page, package selection, UID input, payment selector, static pages, banners, notices.

**Phase 4: Orders & Wallet Core**
`WalletService`, `OrderService`, `CouponService`, guest and registered checkout, order tracking, add-money flow, idempotency and rate limits, tests.

**Phase 5: Customer Dashboard**
Orders, transactions, add money, profile, referral, re-order, reviews.

**Phase 6: Admin Panel**
Dashboard, CRUD for games/packages/coupons/banners/notices/payment methods, orders management, add-money approval, users, settings, activity log, staff roles.

**Phase 7: Suppliers & Automation**
Supplier interface, manual driver, API stub driver, retry jobs, supplier logs, stock alerts, notifications.

**Phase 8: Reports, Polish, Deploy**
Reports and exports, fraud flags, PWA, SEO (meta tags, sitemap, Open Graph, hreflang), performance tuning, security review, Nginx + Supervisor + SSL deployment guide.

---

## 13. OUTPUT RULES

- Show the full code of every new/changed file. No placeholders like "..." or "rest of code".
- Use clear folder structure: `app/Services`, `app/Enums`, `app/Http/Requests`, `app/Policies`, `app/Jobs`, `app/Suppliers`, `resources/js/Pages`, `resources/js/Components`, `resources/js/Layouts`, `resources/js/hooks`.
- Follow PSR-12 and Laravel conventions. Use strict, readable naming.
- At the end of each phase give: (1) summary, (2) commands to run, (3) how to test manually, (4) known limitations.
- Do not integrate any unofficial, hacked, or glitch-based top-up method. Supplier integration must use official reseller/distributor APIs only.

**Start with Phase 1 now.**
