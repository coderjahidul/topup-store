# Deployment Guide — TopUp Store (Nginx + Supervisor + SSL)

Production checklist for a typical Ubuntu 22.04/24.04 VPS with Nginx, PHP-FPM 8.4, MySQL, Redis, and Supervisor.

## 1. Server packages

```bash
sudo apt update
sudo apt install -y nginx mysql-server redis-server supervisor \
  php8.4-fpm php8.4-cli php8.4-mysql php8.4-redis php8.4-xml \
  php8.4-mbstring php8.4-curl php8.4-zip php8.4-gd php8.4-bcmath \
  unzip git curl
```

Install Composer and Node 22+ for builds (build assets on CI or locally, then upload `public/build`).

## 2. Application layout

```bash
sudo mkdir -p /var/www/topup-store
sudo chown -R $USER:www-data /var/www/topup-store
cd /var/www/topup-store
# git clone / rsync release here
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate
```

Suggested `.env` production values:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
CACHE_STORE=redis
SESSION_SECURE_COOKIE=true

SUPPLIER_DEFAULT=manual
```

Then:

```bash
php artisan migrate --force
php artisan db:seed --force   # first deploy only
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan permission:cache-reset
npm ci && npm run build       # or copy prebuilt public/build
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R ug+rwx storage bootstrap/cache
```

## 3. Nginx site

`/etc/nginx/sites-available/topup-store`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    root /var/www/topup-store/public;
    index index.php;

    ssl_certificate     /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    client_max_body_size 20M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff2)$ {
        expires 7d;
        access_log off;
        try_files $uri =404;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable and reload:

```bash
sudo ln -s /etc/nginx/sites-available/topup-store /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 4. SSL (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
sudo systemctl reload nginx
```

## 5. Supervisor — queue workers

`/etc/supervisor/conf.d/topup-store-worker.conf`:

```ini
[program:topup-store-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/topup-store/artisan queue:work redis --sleep=1 --tries=5 --timeout=120 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/topup-store/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start topup-store-worker:*
```

## 6. Scheduler (cron)

```bash
sudo crontab -u www-data -e
```

Add:

```cron
* * * * * cd /var/www/topup-store && php artisan schedule:run >> /dev/null 2>&1
```

This runs hourly stock checks and any future scheduled tasks.

## 7. Security checklist

- [ ] `APP_DEBUG=false`, strong `APP_KEY`
- [ ] MySQL user limited to the app database
- [ ] Redis bound to localhost / passworded
- [ ] `SESSION_SECURE_COOKIE=true`, HTTPS only
- [ ] Firewall: allow 80/443, SSH; deny public MySQL/Redis
- [ ] Fail2ban on SSH/Nginx (optional)
- [ ] Rotate `admin@example.com` password immediately after first seed
- [ ] Keep supplier credentials only in encrypted DB / env — never in git
- [ ] Run `composer audit` regularly
- [ ] Backups: MySQL dump + `storage/` nightly

## 8. Zero-downtime-ish release tips

1. Build assets in CI.
2. Deploy to a new release directory.
3. `php artisan migrate --force`
4. Symlink `current` → new release.
5. `php artisan config:cache && php artisan route:cache`
6. `sudo supervisorctl restart topup-store-worker:*`
7. `sudo systemctl reload php8.4-fpm`

## 9. Health checks

- `https://your-domain.com/up`
- `https://your-domain.com/sitemap.xml`
- `https://your-domain.com/manifest.webmanifest`
- Place a wallet test order and confirm Supervisor processes `ProcessSupplierOrderJob`
