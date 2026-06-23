import { applyColour, hexToRgb, lerp } from './functions'
import type { RgbTuple, SceneState } from './types'
import { variables } from './variables'

export type ResolvedSceneTransition = {
	lastState: SceneState
	nextState: SceneState
	progressCurr: number
}

export const resolveSceneTransition = (progressHours: number): ResolvedSceneTransition => {
	let nextIndex = variables.config.states.findIndex((frame) => {
		return (frame.time ?? 0) !== 0 && progressHours < (frame.time ?? 0)
	})
	if (nextIndex < 0) {
		nextIndex = 0
	}

	let lastIndex = nextIndex - 1
	if (lastIndex < 0) {
		lastIndex = variables.config.states.length - 1
	}

	const lastState = variables.config.states[lastIndex]!
	const nextState = variables.config.states[nextIndex]!
	const diff = (nextState.time ?? 0) - (lastState.time ?? 0)
	const progressCurr = diff === 0 ? 0 : (progressHours - (lastState.time ?? 0)) / diff

	return { lastState, nextState, progressCurr }
}

export const computeInterpolatedPalette = (lastState: SceneState, nextState: SceneState, progressCurr: number): RgbTuple[] => {
	const colors: RgbTuple[] = []

	for (const key of Object.keys(lastState.colors_palette).sort((a, b) => Number(a) - Number(b))) {
		const lastRGB = hexToRgb(lastState.colors_palette[key])
		const nextRGB = hexToRgb(nextState.colors_palette[key])

		if (!lastRGB || !nextRGB) {
			continue
		}

		const currRGB: RgbTuple = [Math.round(lerp(lastRGB[0], nextRGB[0], progressCurr)), Math.round(lerp(lastRGB[1], nextRGB[1], progressCurr)), Math.round(lerp(lastRGB[2], nextRGB[2], progressCurr))]

		applyColour(key, currRGB)
		colors[Number(key)] = currRGB
	}

	return colors
}
