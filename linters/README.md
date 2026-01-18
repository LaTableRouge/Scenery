# Development Tools Configuration

This directory contains configuration files for various development tools used in the project.

## Available Tools

### Prettier

Code formatter that enforces a consistent style across your codebase.

- **Config File**: [prettier.config.js](./prettier.config.js)
- **Ignore File**: [.prettierignore](.prettierignore)
- **Documentation**: [Prettier Docs](https://prettier.io/docs/en/)
- **Example Commands**:

  ```bash
  # Format all SCSS files in 'your-theme'
  npx prettier --config 'linters/prettier.config.js' --ignore-path 'linters/.prettierignore' --no-error-on-unmatched-pattern --write 'web/app/themes/your-theme/**/*.scss'

  # Format all JSON files in 'your-theme'
  npx prettier --config 'linters/prettier.config.js' --ignore-path 'linters/.prettierignore' --no-error-on-unmatched-pattern --write 'web/app/themes/your-theme/**/*.json'

  # Format multiple file types using brace expansion in 'your-theme'
  npx prettier --config 'linters/prettier.config.js' --ignore-path 'linters/.prettierignore' --no-error-on-unmatched-pattern --write {README,web/app/themes/your-theme/**/*}.md
  ```

### Stylelint

A mighty, modern linter that helps you avoid errors and enforce conventions in your styles.

- **Config File**: [stylelint.config.js](./stylelint.config.js)
- **ignore File**: [.stylelintignore](.stylelintignore)
- **Documentation**: [Stylelint Docs](https://stylelint.io/user-guide/)
- **Example Commands**:

  ```bash
  # Lint all SCSS files in 'your-theme'
  npx stylelint --config 'linters/stylelint.config.js' --ignore-path 'linters/.stylelintignore' --allow-empty-input --fix 'web/app/themes/your-theme/**/*.scss'
  ```

### ESLint

A tool for identifying and fixing problems in JavaScript code (can be used for other types of files with additionnal plugins).

- **Config File**: [eslint.config.js](./eslint.config.js)
- **Ignore File**: In the latest version of eslint you can ignore files directly in the config file
- **Documentation**: [ESLint Docs](https://eslint.org/docs/latest/)
- **Example Commands**:

  ```bash
  # Lint all scripts files in 'your-theme'
  npx eslint --config 'linters/eslint.config.js' --no-error-on-unmatched-pattern --fix 'web/app/themes/your-theme/**/*.{js,jsx,ts,tsx}'
  ```

### Markdownlint CLI2

A fast, flexible, configuration-based command-line interface for linting Markdown/CommonMark files.

- **Config File**: [.markdownlint.json](./.markdownlint.json)
- **Documentation**: [Markdownlint CLI2 Docs](https://github.com/DavidAnson/markdownlint-cli2)
- **Example Commands**:

  ```bash
  # Lint and fix all markdown files in 'your-theme' and README
  npx markdownlint-cli2 --config 'linters/.markdownlint.json' --fix {README,web/app/themes/your-theme/**/*}.md !node_modules !vendor
  ```

### PHP CS Fixer

A tool to automatically fix PHP coding standards issues. It can modernize your code and (micro) optimize it.

- **Config File**: [.php-cs-fixer.dist.php](./.php-cs-fixer.dist.php)
- **Documentation**: [PHP CS Fixer Docs](https://cs.symfony.com/)
- **Example Commands**:

  ```bash
  # Fix PHP coding standards in 'your-theme'
  vendor/bin/php-cs-fixer fix -v --show-progress=dots --allow-risky=yes --using-cache=no --config=linters/.php-cs-fixer.dist.php web/app/themes/your-theme
  ```

### Twig CS Fixer

A tool to automatically fix Twig Coding Standards issues. It enforces consistent spacing, naming conventions, and formatting in Twig templates.

- **Documentation**: [Twig CS Fixer Docs](https://github.com/VincentLanglet/Twig-CS-Fixer)
- **Example Commands**:

  ```bash
  # Fix Twig coding standards in 'your-theme'
  vendor/bin/twig-cs-fixer --fix --no-cache lint web/app/themes/your-theme
  ```

### PHPStan

A static analysis tool that discovers bugs in your code without running it.

- **Config File**: [phpstan.dist.neon](./phpstan.dist.neon)
- **Documentation**: [PHPStan Docs](https://phpstan.org/user-guide/getting-started)
- **Example Commands**:

  ```bash
  # Analyze PHP files with PHPStan in 'your-theme'
  vendor/bin/phpstan analyse --no-progress --no-interaction web/app/themes/your-theme
  ```

## Best Practices

1. Always use quotes around glob patterns to prevent shell expansion
2. Keep your configuration files in this `linters/` directory for better organization
3. Use tool-specific flags for fixing issues:
   - Prettier: `--write`
   - Stylelint/ESLint: `--fix`
   - PHP CS Fixer/Twig CS Fixer: `--fix`

## File Pattern Matching

### Basic Patterns

- `**/*` - Matches all files in all subdirectories
- `*.{ext}` - Matches files with specific extension
- `!dir/**` - Excludes specific directories

### Examples from This Project

1. **Multiple File Extensions**:

   ```bash
   # JavaScript and TypeScript files
   'web/app/themes/your-theme/**/*.{js,jsx,ts,tsx}'
   ```

2. **Single File Type**:

   ```bash
   # SCSS files
   'web/app/themes/your-theme/**/*.scss'

   # JSON files
   'web/app/themes/your-theme/**/*.json'

   # Markdown files
   'web/app/themes/your-theme/**/*.md'
   ```

3. **Brace Expansion**:

   ```bash
   # README and theme markdown files
   {README,web/app/themes/your-theme/**/*}.md
   ```

4. **Excluding Directories**:

   ```bash
   # Markdown files excluding node_modules and vendor
   {README,web/app/themes/your-theme/**/*}.md !node_modules !vendor
   ```

### Best Practices for patterns

1. **Always Quote Patterns**:

   ```bash
   # Good
   'web/app/themes/your-theme/**/*.scss'

   # Bad
   web/app/themes/your-theme/**/*.scss
   ```

2. **Use Brace Expansion for Multiple Patterns**:

   ```bash
   # Good
   {README,web/app/themes/your-theme/**/*}.md

   # Bad
   README.md web/app/themes/your-theme/**/*.md
   ```

3. **Group Related Extensions**:

   ```bash
   # Good
   'web/app/themes/your-theme/**/*.{js,jsx,ts,tsx}'

   # Bad
   'web/app/themes/your-theme/**/*.js' 'web/app/themes/your-theme/**/*.jsx'
   ```
