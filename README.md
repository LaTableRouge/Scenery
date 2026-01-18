# [The Scenery](<[URL](https://scenery.mlnop.fr/)>)

![Node](https://img.shields.io/badge/node-%3E%3D%2022-brightgreen)
![PHP](https://img.shields.io/badge/php-%5E8-blue)

[![Monotone Landscape Illustration](https://scenery.mlnop.fr/build/assets/img/preview.png)](https://scenery.mlnop.fr/)

A repository showcasing a monotone illustration of a landscape, with a wide grass field, trees, mountains, and a small house.
The illustration dynamically represents the solar system planets based on the user's time, date, and location.
The color scheme of the website changes according to the time of day, and a night sky with stars appears during nightime hours.

[Live preview](https://scenery.mlnop.fr/)

## Features

- Foreground grass field, trees, background mountain range, and a small house with parallax based on the mouse cursor.
- Solar system planets' representation based on the user's time, date, and location.
- Dynamic color changes reflecting the time of day.
- Night sky with stars during nightime.
- Utilizes the Astronomy Engine npm package.
- Implemented in vanilla JavaScript, SCSS, and PHP (why PHP ? because I like it).
- Compiled with ViteJS.

## Upcoming Features

- **Tilt Angle Adjustment**: The tilt angle for the planets is not right idk why.

- **Accurate Stars' Positions**: We're also planning to incorporate accurate star positions based on location and time, adding a touch of realism to the night sky.

## Table of Contents

- [Installation](#installation)
- [Docker Setup](#docker-setup)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Credits](#credits)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Make sure you have PHP 8.0+ and Node.js 22 installed.
2. Clone this repository: `git clone https://github.com/MLNOP/Scenery.git`
3. Navigate to the project directory: `cd Scenery`
4. Install Node.js dependencies: `npm install`
5. Install PHP dependencies: `composer install`

## Docker Setup

This project includes a Docker configuration for easy development and deployment. The setup uses PHP 8.3 with Apache and includes Node.js 24 for running Vite.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Traefik](https://traefik.io/) setup (if using the provided Traefik labels)

### Quick Start

1. Create a `.env` file in the root directory:

   ```bash
   PROJECT_NAME=scenery
   APP_FQDN=local.scenery.com
   ```

2. Add to your `/etc/hosts` file (macOS/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

   ```text
   127.0.0.1 local.scenery.com
   ```

3. Build and start the container:

   ```bash
   docker compose build
   docker compose up -d
   ```

4. Install dependencies inside the container:

   ```bash
   docker compose exec docker_app composer install
   docker compose exec docker_app npm install
   ```

5. Access the application at `http://local.scenery.com` (or your configured `APP_FQDN`)

### Development

To run the Vite dev server inside the container:

```bash
docker compose exec docker_app npm run watch
```

The Vite dev server will be available on port `5173`.

### Common Commands

```bash
# Start/Stop containers
docker compose up -d
docker compose down

# Access container shell
docker compose exec docker_app bash

# View logs
docker compose logs -f docker_app

# Rebuild after changes
docker compose build --no-cache
docker compose up -d
```

## Usage

1. Run the development server: `npm run watch`
2. Open your browser and navigate to the provided URL.
3. Explore the beautiful monotone landscape illustration with dynamically changing elements based on time, date, and location.

## Dependencies

- [ViteJS](https://vitejs.dev/): Fast, opinionated web dev build tool.
- [PHP 8.0+](https://www.php.net/): Server-side scripting language.
- [Node.js 22+](https://nodejs.org/): JavaScript runtime.
- [Astronomy Engine](https://www.npmjs.com/package/astronomy-engine): NPM package for astronomy calculations.

## Credits

Stuff who inspired/helped me

- [Moon & sun phases](https://www.timeanddate.com/astronomy/france/avignon)
- [Moon Phase on js canvas](https://codepen.io/anowodzinski/pen/ZWKXPQ)
- [Don Cross sky view](http://cosinekitty.com/sky_view.html)
- [Firewatch-style SVG parallax landscape](https://codepen.io/accudio/pen/GRNmbjJ)
- [Chat GPT](https://openai.com/blog/chatgpt)

## Contributing

Contributions are welcome! Here's how you can get involved:

1. Fork the repository and create a new branch.
2. Make your changes and test them locally.
3. Submit a pull request explaining your changes.

## License

This project is licensed under the [MIT License](LICENSE).
