const eslintPluginReact = require('eslint-plugin-react')
const eslintPluginSimpleImportSort = require('eslint-plugin-simple-import-sort')
const eslintPluginSortDestructureKeys = require('eslint-plugin-sort-destructure-keys')
const eslintPluginUnusedImports = require('eslint-plugin-unused-imports')
const eslint = require('@eslint/js')
const { globalIgnores } = require('eslint/config')
const globals = require('globals')
const tseslint = require('typescript-eslint')

module.exports = tseslint.config(globalIgnores(['**/static/*', '**/build/*', '**/dist/*', 'linters/*', 'webpack.config.js', 'vite.config.ts']), eslint.configs.recommended, ...tseslint.configs.recommended, {
	name: 'eslint-config-scripts',
	files: ['**/*.{js,jsx,ts,tsx}'],
	languageOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		globals: {
			wp: true,
			wpchildparams: true,
			jQuery: true,
			...globals.browser,
			...globals.node
		}
	},
	linterOptions: {
		reportUnusedDisableDirectives: 'error'
	},
	plugins: {
		react: eslintPluginReact,
		'unused-imports': eslintPluginUnusedImports,
		'simple-import-sort': eslintPluginSimpleImportSort,
		'sort-destructure-keys': eslintPluginSortDestructureKeys
	},
	settings: {
		'import/core-modules': [],
		'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
		react: {
			version: 'detect'
		}
	},
	rules: {
		'object-shorthand': 'off',
		'space-before-function-paren': 'off',
		'comma-dangle': ['error', 'only-multiline'],
		'generator-star-spacing': [
			'error',
			{
				before: false,
				after: true
			}
		],
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': 'error',
		'unused-imports/no-unused-imports': 'warn',
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
		'no-console': 'warn',
		'operator-linebreak': ['error', 'before'],
		'react/react-in-jsx-scope': 'off',
		'react/prop-types': 'off',
		'react/jsx-sort-props': [
			'warn',
			{
				ignoreCase: true,
				callbacksLast: true,
				shorthandFirst: true,
				multiline: 'ignore',
				reservedFirst: true
			}
		],
		'sort-destructure-keys/sort-destructure-keys': [
			'error',
			{
				caseSensitive: false
			}
		]
	}
})
