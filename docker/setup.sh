#!/bin/bash

# تعیین متغیر برای فعال/غیرفعال کردن این اسکریپت
RUN_SETUP=${RUN_SETUP:-true}

if [ "$RUN_SETUP" = "true" ]; then
    echo "Starting Laravel setup..."

    # انتظار برای آماده شدن سرویس‌های داکر
    echo "Waiting for MySQL to be ready..."
    while ! mysqladmin ping -h"db-pando360" -u"root" -p"root" --silent; do
        sleep 1
    done

    # نصب وابستگی‌های Composer
    echo "Installing Composer dependencies..."
    composer install --no-interaction --optimize-autoloader

    echo "Setting Spatie..."
    php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
    # تولید کلید برنامه
    echo "Generating application key..."
    php artisan key:generate

    # اجرای میگریشن‌ها
    echo "Running migrations..."
    php artisan migrate --force

    # تنظیمات Passport
    set -e

    echo "Setting up Passport..."

    # ایجاد کلیدهای رمزنگاری
    php artisan passport:keys --force

    # ایجاد کلاینت دسترسی شخصی (اگر وجود ندارد)
    if ! php artisan passport:client --personal --no-interaction --name="Personal Access Client"; then
        echo "Creating personal access client..."
        php artisan passport:client --personal --no-interaction --name="Personal Access Client" > /dev/null 2>&1
    fi

    # ایجاد کلاینت Password Grant (اگر نیاز است)
    if ! php artisan passport:client --password --no-interaction --name="Password Grant Client"; then
        echo "Creating password grant client..."
        php artisan passport:client --password --no-interaction --name="Password Grant Client" > /dev/null 2>&1
    fi

    echo "Passport setup completed successfully!"

    # لینک استوریج
    echo "Creating storage link..."
    php artisan storage:link

    # کش کردن روتر و کانفیگ
    echo "Caching routes and config..."
    php artisan route:cache
    php artisan config:cache
    php artisan db:seed
    echo "Laravel setup completed successfully!"
else
    echo "Skipping Laravel setup (RUN_SETUP is not 'true')"
fi