FROM php:8.3-apache

ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /app

# Install system dependencies
RUN apt-get update -qq && \
    apt-get install -qy --no-install-recommends \
    git \
    unzip \
    zip \
    curl \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libzip-dev \
    libonig-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php && \
    mv composer.phar /usr/local/bin/composer && \
    chmod +x /usr/local/bin/composer

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) \
    opcache \
    zip \
    gd \
    mbstring

# Copy configuration files
COPY docker/conf/vhost.conf /etc/apache2/sites-available/000-default.conf
COPY docker/conf/apache.conf /etc/apache2/conf-available/z-app.conf

# Enable Apache modules and configuration
RUN a2enmod rewrite remoteip && \
    a2enconf z-app && \
    a2ensite 000-default
