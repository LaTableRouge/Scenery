import { stringReplaceOpenAndWrite, viteStringReplace } from '@mlnop/string-replace'
import sassGlobImports from '@mlnop/vite-plugin-sass-glob-import'
import autoprefixer from 'autoprefixer'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const __dirname = dirname(fileURLToPath(import.meta.url))
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
const filesToEdit: Array<{
	filePath: string[]
	replace: Array<{ from: RegExp; to: string }>
}> = []
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

	const entriesToCompile: string[] = []
	if (entryFiles.length) {
		entryFiles.forEach((group) => {
			if (group) {
				/*
				|--------------------------------------------------------------------------
				| TypeScript Compilation
				|--------------------------------------------------------------------------
				|
				| Create array of files to compile
				|
				*/
				if (group.scripts?.length) {
					group.scripts.forEach((file) => {
						const entry = `${file.input}/${file.name}.ts`
						if (!entriesToCompile.includes(entry)) {
							entriesToCompile.push(entry)
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
					namespace(filepath: string) {
						const fileParts = filepath.replace('.scss', '').split('/')
						return `${fileParts.at(-4)}-${fileParts.at(-3)}`
					}
				}),
				enforce: 'pre' as const
			},
			{
				...viteStringReplace(filesToEdit),
				apply: 'build' as const,
				enforce: 'pre' as const
			},
			viteStaticCopy({
				targets: filesToCopy
			})
		].filter(Boolean),

		esbuild: isProduction
			? {
					target: 'es2020',
					minifyIdentifiers: false,
					keepNames: true,
					pure: ['console.log'],
					reserveProps: /^__\(*$/
				}
			: undefined,

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
			minify: isProduction ? ('esbuild' as const) : false,
			outDir: distPath,
			emptyOutDir: true,
			manifest: true,
			sourcemap: !isProduction,
			target: 'es2020',
			cssCodeSplit: true,
			cssTarget: 'es2020'
		},

		server: {
			host: '0.0.0.0', // Required for Docker - listen on all interfaces
			port: 5173,
			strictPort: true,
			cors: true,
			https: false,
			open: false,
			allowedHosts: isProduction ? [] : true,
			hmr: (() => {
				const isDocker = process.env.DOCKER === 'true' || process.env.VITE_DOCKER === 'true'
				const hmrHost = process.env.VITE_HMR_HOST || (isDocker ? 'localhost' : 'localhost')
				const hmrPort = process.env.VITE_HMR_PORT ? parseInt(process.env.VITE_HMR_PORT, 10) : 5173

				return {
					host: hmrHost,
					port: hmrPort
				}
			})(),
			watch: {
				usePolling: true // Required for Docker file watching
			}
		},

		css: {
			devSourcemap: !isProduction,
			postcss: {
				plugins: [autoprefixer]
			},
			preprocessorOptions: {
				scss: {
					api: 'modern-compiler' as const
				}
			}
		},

		clearScreen: false,
		appType: 'custom' as const
	}
})
