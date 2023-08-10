import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'
import { run } from 'vite-plugin-run'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const { resolve } = require('path')
const { stringReplace, viteStringReplace } = require('@mlnop/string-replace')

const chore = process.env.npm_config_chore
const isProduction = process.env.NODE_ENV === 'production'

/*
 |--------------------------------------------------------------------------
 | Config
 |--------------------------------------------------------------------------
 |
 | Assets path
 | Destination path
 |
 */
const assetsPath = `./assets`
const distPath = `./build`


/*
 |--------------------------------------------------------------------------
 | Assets Config
 |--------------------------------------------------------------------------
 | JS = [
 |    {
 |     - File name
 |     - File input
 |    }
 |  ]
 |
 | SCSS = [
 |    {
 |     - File name
 |     - File input
 |    }
 |  ]
 |
 */
const entryFiles = [
  {
    scripts: [
      {
        name: 'app',
        input: `${assetsPath}/js`
      }
    ],
    styles: [
      {
        name: 'app',
        input: `${assetsPath}/scss`
      }
    ],
    php: [`${assetsPath}/includes`, 'index.php']
  }
].filter(Boolean)

/*
 |--------------------------------------------------------------------------
 | Files to edit
 |--------------------------------------------------------------------------
 |  [
 |    {
 |     - File path array/string
 |     - regex or string to be replaced
 |     - string to replace with
 |    }
 |  ]
 |
 */
const filesToEdit = []
if (isProduction) {
  filesToEdit.push(
    {
      filePath: [
        resolve(__dirname, `${assetsPath}/includes`),
        resolve(__dirname, 'index.php')
      ],
      replace: [
        {
          from: /\bvar_dump\(([^)]+)\);/g,
          to: ''
        }
      ]
    },
    {
      filePath: resolve(__dirname, `${assetsPath}/includes/common/variables.inc.php`),
      replace: [
        {
          from: /\bdefine\([ ]?'IS_VITE_DEVELOPMENT',[ ]?true[ ]?\);/g,
          to: "define('IS_VITE_DEVELOPMENT', false);"
        }
      ]
    }
  )
} else {
  filesToEdit.push(
    {
      filePath: resolve(__dirname, `${assetsPath}/includes/common/variables.inc.php`),
      replace: [
        {
          from: /\bdefine\([ ]?'IS_VITE_DEVELOPMENT',[ ]?false[ ]?\);/g,
          to: "define('IS_VITE_DEVELOPMENT', true);"
        }
      ]
    }
  )
}

/*
 |--------------------------------------------------------------------------
 | Copy config
 |--------------------------------------------------------------------------
 |
 | Files to copy from smwh to smwh else
 |
 | {
 |   - File input
 |   - File output
 | }
 |
 |
 */
const filesToCopy = [
  {
    src: 'index.php',
    dest: 'build/../'
  },
  {
    src: 'favicon.ico',
    dest: 'build/../'
  },
  {
    src: 'robots.txt',
    dest: 'build/../'
  },
  {
    src: `${assetsPath}/img/planets`,
    dest: 'assets/img/'
  },
  {
    src: `${assetsPath}/includes`,
    dest: 'assets/'
  },
  {
    src: `${assetsPath}/img/favicon`,
    dest: 'assets/img/'
  }
]

/*
|--------------------------------------------------------------------------
| Replace string in build files
|--------------------------------------------------------------------------
|
*/
const buildFilesToEdit = [
  {
    filePath: resolve(__dirname, `${distPath}/assets/includes/common/variables.inc.php`),
    replace: [
      {
        from: /\bdefine\([ ]?'IS_VITE_DEVELOPMENT',[ ]?false[ ]?\);/g,
        to: ''
      },
      {
        from: /\bdefine\('DIST_PATH',[ ]?DIST_FOLDER\);/g,
        to: "define('DIST_PATH', '.');"
      }
    ]
  }
]

/*
 |--------------------------------------------------------------------------
 |--------------------------------------------------------------------------
 |--------------------------------------------------------------------------
 | That's all, stop editing, happy development
 |--------------------------------------------------------------------------
 |--------------------------------------------------------------------------
 |--------------------------------------------------------------------------
 */

const commandArray = {
  js_lint: [],
  js_prettier: [],
  scss_lint: [],
  scss_prettier: [],
  php_lint: []
}

const entriesToCompile = []

if (entryFiles.length) {
  entryFiles.forEach(group => {
    if (group) {
      /*
      |--------------------------------------------------------------------------
      | Javascript Compilation
      |--------------------------------------------------------------------------
      |
      | Create array of files to compile
      |
      | Add lint command to array
      | Add prettier command to array
      |
      */
      if (group.scripts?.length) {
        group.scripts.forEach(file => {
          if (isProduction) {
            // Javascript linter file path
            if (chore === 'all' || chore === 'lint:js') {
              const javascriptLinter = `npx eslint --config ${resolve(__dirname, '.eslintrc.js')} --ignore-path ${resolve(__dirname, '.eslintignore')} --fix ${file.input}/**/*.js`
              if (!commandArray.js_lint.includes(javascriptLinter)) {
                if (commandArray.php_lint.length) {
                  commandArray.php_lint.push('&&')
                }
                commandArray.js_lint.push(javascriptLinter)
              }
            }

            // Javascript prettier cmd
            if (chore === 'all' || chore === 'prettier:js') {
              const javascriptPrettier = `npx prettier --config ${resolve(__dirname, '.prettierrc.js')} --ignore-path ${resolve(__dirname, '.prettierignore')} --write ${file.input}/**/*.js`
              if (!commandArray.js_prettier.includes(javascriptPrettier)) {
                if (commandArray.php_lint.length) {
                  commandArray.php_lint.push('&&')
                }
                commandArray.js_prettier.push(javascriptPrettier)
              }
            }
          }

          // Javascript compilation
          if (!entriesToCompile.includes(`${file.input}/${file.name}.js`)) {
            entriesToCompile.push(`${file.input}/${file.name}.js`)
          }
        })
      }

      /*
      |--------------------------------------------------------------------------
      | SCSS Compilation
      |--------------------------------------------------------------------------
      |
      | Create array of files to compile
      |
      | Add lint command to array
      | Add prettier command to array
      |
      */
      if (group.styles?.length) {
        group.styles.forEach(file => {
          if (isProduction) {
            // SCSS lint cmd
            if (chore === 'all' || chore === 'lint:scss') {
              const styleLintCommand = `npx stylelint --config ${resolve(__dirname, '.stylelintrc.json')}  --ignore-path ${resolve(__dirname, '.stylelintignore')} --fix ${file.input}/**/*.scss`
              if (!commandArray.scss_lint.includes(styleLintCommand)) {
                if (commandArray.php_lint.length) {
                  commandArray.php_lint.push('&&')
                }
                commandArray.scss_lint.push(styleLintCommand)
              }
            }

            // SCSS prettier cmd
            if (chore === 'all' || chore === 'prettier:scss') {
              const stylePrettier = `npx prettier --config ${resolve(__dirname, '.prettierrc.js')} --ignore-path ${resolve(__dirname, '.prettierignore')} --write ${file.input}/**/*.scss`
              if (!commandArray.scss_prettier.includes(stylePrettier)) {
                if (commandArray.php_lint.length) {
                  commandArray.php_lint.push('&&')
                }
                commandArray.scss_prettier.push(stylePrettier)
              }
            }
          }

          // SCSS compilation
          // if (chore === undefined || chore === 'all' || chore.includes('scss')) {
          //   if (!entriesToCompile.includes(`${file.input}/${file.name}.scss`)) {
          //     entriesToCompile.push(`${file.input}/${file.name}.scss`)
          //   }
          // }
        })
      }

      /*
      |--------------------------------------------------------------------------
      | PHP Template Linter
      |--------------------------------------------------------------------------
      |
      | Loop through the php array to lint them
      |
      | Add lint command
      |
      */
      if (group.php?.length) {
        group.php.forEach(file => {
          // PHP lint cmd
          if (chore === 'all' || chore === 'lint:php') {
            const phpLintCommand = `${resolve(__dirname, 'vendor/bin/php-cs-fixer.bat')} fix -v --show-progress=dots --using-cache=no ${file} --config=${resolve(__dirname, '.php-cs-fixer.php')}`
            if (!commandArray.php_lint.includes(phpLintCommand)) {
              if (commandArray.php_lint.length) {
                commandArray.php_lint.push('&&')
              }
              commandArray.php_lint.push(phpLintCommand)
            }
          }
        })
      }
    }
  })
}

/*
 |--------------------------------------------------------------------------
 | Global Vite config
 |--------------------------------------------------------------------------
 |
 | Plugins :
 |  - Replace in file
 |  - Live reload :
 |    - Files to refresh
 |  - Run :
 |    - execute scss lint command
 |    - execute scss prettier command
 |    - execute js lint command
 |    - execute js prettier command
 |    - execute php lint command
 | Options :
 |  - Build
 |    - minify when production build
 |    - terser options
 |    - define build directory
 |    - empty out dir ?
 |  - Server
 |    - hot reload config
 |  - CSS
 |    - autoprefixer when production build
 |
 */
export default defineConfig({
  base: './', // Url to apply refresh
  // root: themePath,
  plugins: [
    stringReplace(filesToEdit),

    isProduction
      ? viteStaticCopy({
        targets: filesToCopy
      })
      : false,

    isProduction
      ? run({
        silent: false,
        skipDts: true,
        input: [
          chore === 'all' || chore === 'prettier:scss'
            ? {
              name: 'prettier:scss',
              run: commandArray.scss_prettier,
            }
            : false,
          chore === 'all' || chore === 'lint:scss'
            ? {
              name: 'lint:scss',
              run: commandArray.scss_lint,
            }
            : false,
          chore === 'all' || chore === 'prettier:js'
            ? {
              name: 'prettier:js',
              run: commandArray.js_prettier,
            }
            : false,
          chore === 'all' || chore === 'lint:js'
            ? {
              name: 'lint:js',
              run: commandArray.js_lint,
            }
            : false,
          chore === 'all' || chore === 'lint:php'
            ? {
              name: 'lint:php',
              run: commandArray.php_lint,
            }
            : false,
        ].filter(Boolean)
      })
      : false,

    isProduction
      ? viteStringReplace(buildFilesToEdit)
      : false,
  ].filter(Boolean),

  build: {
    rollupOptions: {
      input: entriesToCompile,
    },
    write: true,
    minify: isProduction ? 'terser' : false,
    terserOptions: isProduction
      ? {
        compress: {
          pure_funcs: [
            'console.log',
            'console.time',
            'console.timeEnd',
            // 'console.error',
            // 'console.warn',
            // ...
          ]
        },
        // Make sure symbols under `pure_funcs`,
        // are also under `mangle.reserved` to avoid mangling.
        mangle: {
          reserved: [
            'console.log',
            'console.time',
            'console.timeEnd',
            '__'
            // 'console.error',
            // 'console.warn',
            // ...
          ]
        },
        output: {
          comments: false
        }
      }
      : null,
    outDir: distPath,
    emptyOutDir: true,
    manifest: true,
    sourcemap: !isProduction,
    assetsInlineLimit: 4096,
  },

  server: {
    cors: true,
    strictPort: true,
    port: 5173,
    https: false,
    open: false,
    hmr: {
      host: 'localhost'
    },
    watch: {
      usePolling: true
    },
  },

  css: {
    devSourcemap: !isProduction,
    postcss: {
      plugins: [
        autoprefixer
      ],
    }
  },

  clearScreen: false,
})
