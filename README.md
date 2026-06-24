# [The Scenery](<[URL](https://scenery.mlnop.fr/)>)

![Node](https://img.shields.io/badge/node-%3E%3D%2022-brightgreen)
![PHP](https://img.shields.io/badge/php-%5E8-blue)

[![Preview](https://scenery.mlnop.fr/build/assets/img/preview.png)](https://scenery.mlnop.fr/)

A landscape illustration that follows the time of day: parallax scenery, planet positions from your location, and a star field at night.
Colors shift through dawn, day, dusk, and night using [Astronomy Engine](https://www.npmjs.com/package/astronomy-engine).

**[Live demo](https://scenery.mlnop.fr/)**

## What it does

- Parallax landscape (field, trees, mountains, house) on desktop
- Sun, Moon, and planets drawn from real astronomy data
- Sky palette and CSS colors driven by the current time of day
- Stars at night; optional config panel to toggle layers and time presets
- PHP serves the page and switches between Vite dev assets and production build output

## Stack

- **Frontend:** TypeScript, SCSS, Vite
- **Backend:** PHP 8+ (entry page and asset manifest)
- **Tooling:** ESLint, Stylelint, PHPStan, Husky

## Getting started

**Requirements:** PHP 8.0+, Node.js 22+, [Composer](https://getcomposer.org/)

```bash
git clone https://github.com/MLNOP/Scenery.git
cd Scenery
composer install
npm install
```

**Development** (Vite HMR on port `5173`):

```bash
npm run watch
```

Serve the project with PHP (or Docker below) and open the site in your browser.

**Production build:**

```bash
npm run build
```

Output goes to `build/`. PHP reads `build/.vite/manifest.json` to load compiled assets.

**Lint / format:**

```bash
npm run beautify:all
```

## Docker

PHP 8.3 + Apache + Node.js 24. Optional [Traefik](https://traefik.io/) labels are included.

1. Create `.env`:

   ```bash
   PROJECT_NAME=scenery
   APP_FQDN=local.scenery.com
   ```

2. Add to hosts (`127.0.0.1 local.scenery.com`).

3. Start:

   ```bash
   docker compose build
   docker compose up -d
   docker compose exec docker_app composer install
   docker compose exec docker_app npm install
   ```

4. Open `http://local.scenery.com` and run Vite inside the container:

   ```bash
   docker compose exec docker_app npm run watch
   ```

Useful commands: `docker compose down`, `docker compose exec docker_app bash`, `docker compose logs -f docker_app`.

## Known limitations

- Planet phase tilt may still need visual tuning
- Star field uses a stylized dome projection, not a full planetarium model

## Credits

Inspired by or built with help from:

- [timeanddate.com — Moon & sun phases](https://www.timeanddate.com/astronomy/france/avignon)
- [Moon phase on canvas (CodePen)](https://codepen.io/anowodzinski/pen/ZWKXPQ)
- [Don Cross sky view](http://cosinekitty.com/sky_view.html)
- [Firewatch-style parallax landscape (CodePen)](https://codepen.io/accudio/pen/GRNmbjJ)
- [Astronomy Engine](https://github.com/cosinekitty/astronomy)

## Contributing

1. Fork the repo and create a branch
2. Make and test your changes locally
3. Open a pull request with a short description

## License

[MIT License](LICENSE.txt)
