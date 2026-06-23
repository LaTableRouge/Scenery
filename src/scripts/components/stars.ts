import { Observer } from 'astronomy-engine'

import { variables } from '../common/variables'
import { starCatalog } from './stars/stars-catalog'
import { starsDraw } from './stars/stars-draw'

const starsConfig = {
	starMagnitudeLimit: 6.0,
	brightStarColor: '#ffffff',
	mediumStarColor: '#afafaf',
	dimStarColor: '#7f7f7f'
}

export const clearStars = (): void => {
	const canvas = document.getElementById('stars__layers') as HTMLCanvasElement | null
	if (!canvas) {
		return
	}

	const context = canvas.getContext('2d')
	if (!context) {
		return
	}

	context.clearRect(0, 0, canvas.width, canvas.height)
}

export const createStars = (): void => {
	const canvas = document.getElementById('stars__layers') as HTMLCanvasElement | null
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

	starsDraw(context, windowWidth, windowHeight, observer, starCatalog, starsConfig)
}
