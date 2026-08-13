import { Observer } from 'astronomy-engine'

import { getPhaseShadowColor } from '../common/sky-projection'
import type { CelestialBodyConfig, RgbTuple } from '../common/types'
import { variables } from '../common/variables'
import { celestialDraw } from './celestial/celestial-draw'
import { drawHorizon } from './celestial/horizon-draw'

const celestialBodiesConfig: Record<string, CelestialBodyConfig> = {
	Mars: {
		name: 'Mars',
		color: '#f0e7e7',
		size: 15,
		phases: true,
		shadowBlur: false
	},
	Jupiter: {
		name: 'Jupiter',
		color: '#ebf3f6',
		size: 15,
		phases: true,
		shadowBlur: false
	},
	Saturn: {
		name: 'Saturn',
		color: '#ead6b8',
		size: 22,
		phases: false,
		shadowBlur: false
	},
	Uranus: {
		name: 'Uranus',
		color: '#ACE5EE',
		size: 18,
		phases: false,
		shadowBlur: false
	},
	Neptune: {
		name: 'Neptune',
		color: '#5b5ddf',
		size: 15,
		phases: true,
		shadowBlur: false
	},
	Sun: {
		name: 'Sun',
		color: '#fdfbd3',
		size: 30,
		phases: false,
		shadowBlur: true
	},
	Moon: {
		name: 'Moon',
		color: '#f4f6f0',
		size: 28,
		phases: true,
		shadowBlur: false
	},
	Mercury: {
		name: 'Mercury',
		color: '#e5e5e5',
		size: 15,
		phases: true,
		shadowBlur: false
	},
	Venus: {
		name: 'Venus',
		color: '#8B7D82',
		size: 15,
		phases: true
	}
}

type DisplayConfigKey = keyof typeof variables.displayConfig

export const createCelestials = async (bgColorRGB: RgbTuple): Promise<void> => {
	const canvas = document.getElementById('celestials__layers') as HTMLCanvasElement | null
	if (!canvas) {
		return
	}

	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight

	canvas.width = windowWidth
	canvas.style.width = `${windowWidth}px`
	canvas.height = windowHeight
	canvas.style.height = `${windowHeight}px`

	const context = canvas.getContext('2d')
	if (!context) {
		return
	}

	context.clearRect(0, 0, canvas.width, canvas.height)

	const observer = new Observer(variables.config.base_coordinates.lat, variables.config.base_coordinates.long, 0)

	if (variables.displayConfig.display_horizon) {
		drawHorizon(context, windowWidth, windowHeight)
	}

	for (const body in celestialBodiesConfig) {
		const displayKey = `display_${body.toLowerCase()}` as DisplayConfigKey
		if (variables.displayConfig[displayKey]) {
			const config = { ...celestialBodiesConfig[body] }
			config.shadowColor = getPhaseShadowColor(bgColorRGB)
			await celestialDraw(context, windowWidth, windowHeight, observer, config)
		}
	}
}
