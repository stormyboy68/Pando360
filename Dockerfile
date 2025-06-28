FROM php:8.3-fpm

# Set working directory
WORKDIR /var/www/html

# Set timezone
ENV TZ=Asia/Tehran
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install dependencies
RUN apt-get update && apt-get install -y \
    libonig-dev \
    libzip-dev \
    libxml2-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    curl \
    bash \
    build-essential \
    autoconf \
    default-mysql-client \
    netcat-openbsd \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
    pdo_mysql \
    mbstring \
    zip \
    gd \
    bcmath \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Add asbcrypto extension
RUN mkdir -p /var/www/include/extensions
COPY ./docker/include/extensions/asbcrypto.so /var/www/include/extensions/asbcrypto.so
RUN echo "extension=/var/www/include/extensions/asbcrypto.so" > /usr/local/etc/php/conf.d/asbcrypto.ini

# Set correct permissions
RUN usermod -u 1000 www-data && groupmod -g 1000 www-data

# Create storage structure and set permissions
RUN mkdir -p /var/www/html/storage/framework/cache/data \
    && mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/storage/app \
    && mkdir -p /var/www/html/storage/framework/views \
    && mkdir -p /var/www/html/storage/framework/sessions \
    && chown -R www-data:www-data /var/www/html/storage \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/run
RUN mkdir -p /var/www/html/vendor/php-http && \
    chown -R www-data:www-data /var/www/html/vendor && \
    chmod -R 775 /var/www/html/vendor

# Ensure bootstrap/cache exists and has correct permissions
RUN mkdir -p /var/www/html/bootstrap/cache \
    && chown -R www-data:www-data /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/bootstrap/cache\
    && chown -R www-data:www-data /var/www/html/bootstrap \
    && chmod -R 775 /var/www/html/bootstrap

COPY ./docker/setup.sh /usr/local/bin/setup
RUN chmod +x /usr/local/bin/setup
# Final ownership for working directory
RUN chown -R www-data:www-data /var/www/html
RUN chown -R www-data:www-data /var/www/html/*
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
