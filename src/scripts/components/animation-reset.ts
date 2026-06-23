import { Observer } from 'astronomy-engine'

import { variables } from '../common/variables'
import { updateAnim } from './animation-update'
import { sunPhases } from './celestial/sun-phases'
import { invalidateSceneryCache } from './landscape'

export const resetAnim = async (): Promise<void> => {
	const canvas = document.querySelectorAll('canvas')
	if (canvas.length) {
		canvas.forEach((canva) => {
			const context = canva.getContext('2d')
			if (context) {
				context.clearRect(0, 0, canva.width, canva.height)
			}
		})
	}

	window.onmousemove = null
	invalidateSceneryCache()

	const observer = new Observer(variables.config.base_coordinates.lat, variables.config.base_coordinates.long, 0)
	sunPhases(observer)

	await updateAnim()
}
