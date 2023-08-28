# [The Scenery]([URL](https://mlnop.fr/scenery/))

<img src="https://img.shields.io/badge/php-%5E8.0-blue">
<img src="https://img.shields.io/badge/node-%3E%3D%2018-brightgreen">

<br>

[![Monotone Landscape Illustration](https://mlnop.fr/portal/assets/img/scenery.webp)](https://mlnop.fr/scenery/)

<br>

A repository showcasing a monotone illustration of a landscape, with a wide grass field, trees, mountains, and a small house. The illustration dynamically represents the solar system planets based on the user's time, date, and location. The color scheme of the website changes according to the time of day, and a night sky with stars appears during nightime hours.

[Live preview](https://mlnop.fr/scenery/)

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
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Credits](#credits)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Make sure you have PHP 8.0+ and Node.js 18 installed.
2. Clone this repository: `git clone https://github.com/MLNOP/Scenery.git`
3. Navigate to the project directory: `cd Scenery`
4. Install Node.js dependencies: `npm install`
5. Install PHP dependencies: `composer install`

## Usage

1. Run the development server: `npm run watch`
2. Open your browser and navigate to the provided URL.
3. Explore the beautiful monotone landscape illustration with dynamically changing elements based on time, date, and location.

## Dependencies

- [ViteJS](https://vitejs.dev/): Fast, opinionated web dev build tool.
- [PHP 8.0+](https://www.php.net/): Server-side scripting language.
- [Node.js 18+](https://nodejs.org/): JavaScript runtime.
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
