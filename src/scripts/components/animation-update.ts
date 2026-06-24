import { getProgress } from '../common/functions'
import { computeInterpolatedPalette, resolveSceneTransition } from '../common/scene-state'
import type { RgbTuple } from '../common/types'
import { variables } from '../common/variables'
import { createCelestials } from './celestial'
import { clearScenery, makeScenery } from './landscape'
import { clearStars, createStars } from './stars'

const starStates = new Set(['nauticalDusk', 'night', 'nadir'])

export const updateAnim = async (): Promise<void> => {
	const scene = resolveSceneTransition(getProgress() * 24)
	document.documentElement.dataset.state = scene.lastState.name

	const colors = computeInterpolatedPalette(scene.lastState, scene.nextState, scene.progressCurr)
	const skyRgb: RgbTuple = colors[0] ?? [0, 0, 0]

	await createCelestials(skyRgb)

	if (variables.displayConfig.display_stars) {
		if (starStates.has(scene.lastState.name)) {
			createStars()
		} else {
			clearStars()
		}
	}

	if (variables.displayConfig.display_landscape) {
		await makeScenery(colors)
	} else {
		clearScenery()
	}
}
