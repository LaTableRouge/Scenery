import { stringReplaceOpenAndWrite, viteStringReplace } from '@mlnop/string-replace'
import sassGlobImports from '@mlnop/vite-plugin-sass-glob-import'
import autoprefixer from 'autoprefixer'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const chore = process.env.npm_config_chore

/*
 |--------------------------------------------------------------------------
 | Global config
 |--------------------------------------------------------------------------
 |
 | Assets path
 | Destination path
 |
 */
const assetsPath = 'src'
const distPath = 'build'

/*
 |--------------------------------------------------------------------------
 | Assets config
 |--------------------------------------------------------------------------
 | {
 |  scripts = [
 |      {
 |        - File name
 |        - File input
 |      }
 |    ]
 |
 |  styles = [
 |      {
 |        - File name
 |        - File input
 |      }
 |    ]
 | }
 |
 */
const entryFiles = [
	{
		scripts: [
			{
				name: 'app',
				input: `${assetsPath}/scripts`
			}
		],
		styles: []
	}
]

/*
 |--------------------------------------------------------------------------
 | Files to edit
 |--------------------------------------------------------------------------
 |  [
 |    {
 |     - File path (array of strings)
 |     - Replace (array)
 |       {
 |        from (regex of string)
 |        to (string)
 |       }
 |    }
 |  ]
 |
 */
const filesToEdit = []
if (chore !== 'ci') {
	filesToEdit.push({
		filePath: [resolve(__dirname, 'includes/'), resolve(__dirname, 'index.php')],
		replace: [
			{
				from: /\bvar_dump\(([^)]+)\);/g,
				to: ''
			}
		]
	})
}

/*
 |--------------------------------------------------------------------------
 | Copy config
 |--------------------------------------------------------------------------
 |  [
 |    {
 |      - File input (string)
 |      - File output (string)
 |    }
 |  ]
 |
 */
const filesToCopy = [
	{
		src: `${assetsPath}/img`,
		dest: 'assets/'
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

export default defineConfig(async ({ command, mode }) => {
	const isProduction = command === 'build'

	const env = loadEnv(mode, process.cwd(), '')
	const chore = env?.npm_config_chore

	const entriesToCompile = []
	if (entryFiles.length) {
		entryFiles.forEach((group) => {
			if (group) {
				/*
				|--------------------------------------------------------------------------
				| Javascript Compilation
				|--------------------------------------------------------------------------
				|
				| Create array of files to compile
				|
				*/
				if (group.scripts?.length) {
					group.scripts.forEach((file) => {
						if (!entriesToCompile.includes(`${file.input}/${file.name}.js`)) {
							entriesToCompile.push(`${file.input}/${file.name}.js`)
						}
					})
				}
			}
		})
	}

	/*
	 |--------------------------------------------------------------------------
	 | Replace in file
	 |--------------------------------------------------------------------------
	 |
	 | Replace string in file
	 | Change vite constant in watch
	 | Change vite constant in build
	 |
	 */
	if (chore !== 'ci') {
		if (isProduction) {
			stringReplaceOpenAndWrite(resolve(__dirname, 'includes/common/variables.inc.php'), [
				{
					from: /\bdefine\([ ]?'IS_VITE_DEVELOPMENT',[ ]?true[ ]?\);/g,
					to: "define('IS_VITE_DEVELOPMENT', false);"
				}
			])
		} else {
			stringReplaceOpenAndWrite(resolve(__dirname, 'includes/common/variables.inc.php'), [
				{
					from: /\bdefine\([ ]?'IS_VITE_DEVELOPMENT',[ ]?false[ ]?\);/g,
					to: "define('IS_VITE_DEVELOPMENT', true);"
				}
			])
		}
	}

	/*
	 |--------------------------------------------------------------------------
	 | Global Vite config
	 |--------------------------------------------------------------------------
	 |
	 | Plugins :
	 |  - Replace in file
	 |  - Enable Sass glob imports
	 |  - Static files copy
	 |  - Run :
	 |    - execute scss lint command
	 |    - execute scss prettier command
	 |    - execute js lint command
	 |    - execute js prettier command
	 |    - execute php lint command
	 | Options :
	 |  - Build
	 |    - minify when production build
	 |    - define build directory
	 |    - empty build dir
	 |  - Server
	 |    - hot reload config
	 |  - CSS
	 |    - autoprefixer when production build
	 |
	 */
	return {
		base: './', // Url to apply refresh
		plugins: [
			{
				...sassGlobImports({
					namespace(filepath) {
						const fileParts = filepath.replace('.scss', '').split('/')
						return `${fileParts.at(-4)}-${fileParts.at(-3)}`
					}
				}),
				enforce: 'pre'
			},
			{
				...viteStringReplace(filesToEdit),
				apply: 'build',
				enforce: 'pre'
			},
			viteStaticCopy({
				targets: filesToCopy
			})
		].filter(Boolean),

		esbuild: isProduction
			? {
				minifyIdentifiers: false,
				keepNames: true,
				pure: ['console.log'],
				reserveProps: /^__\(*$/
			}
			: null,

		build: {
			rollupOptions: {
				input: entriesToCompile,
				output: {
					entryFileNames: 'assets/[name].js',
					chunkFileNames: 'assets/[name].js',
					assetFileNames: 'assets/[name].[ext]'
				}
			},
			write: true,
			minify: isProduction ? 'esbuild' : false,
			outDir: distPath,
			emptyOutDir: true,
			manifest: true,
			// ssrManifest: true,
			sourcemap: !isProduction,
			target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
			cssCodeSplit: true,
			cssTarget: ['edge88', 'firefox78', 'chrome87', 'safari14']
			// cssMinify: 'lightningcss'
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
			}
		},

		css: {
			devSourcemap: !isProduction,
			postcss: {
				plugins: [autoprefixer]
			},
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler'
				}
			}
		},

		clearScreen: false,
		appType: 'custom'
	}
})
