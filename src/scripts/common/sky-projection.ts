import type { RgbTuple } from './types'
import { variables } from './variables'

export type SkyPosition = {
	x: number
	y: number
	horizonY: number
}

export const getHorizonY = (layerHeight: number): number => {
	return layerHeight - variables.config.horizon()
}

export const getSkyCanvasPosition = (layerWidth: number, layerHeight: number, azimuth: number, altitude: number): SkyPosition => {
	const adjustedAzimuth = azimuth + (270.0 - variables.facingAzimuth)
	const horizonY = getHorizonY(layerHeight)
	const altitudeRad = (altitude * Math.PI) / 180
	const azimuthRad = (adjustedAzimuth * Math.PI) / 180

	const x = layerWidth / 2 + ((Math.cos(azimuthRad) * layerHeight) / 2) * Math.cos(altitudeRad)
	const y = horizonY - (Math.sin(altitudeRad) * layerHeight) / 2

	return { x, y, horizonY }
}

/** Full-viewport dome projection — stars fill the canvas at any resolution. */
export const getStarCanvasPosition = (layerWidth: number, layerHeight: number, azimuth: number, altitude: number): SkyPosition => {
	const adjustedAzimuthRad = ((azimuth + (270.0 - variables.facingAzimuth)) * Math.PI) / 180
	const altitudeRad = (altitude * Math.PI) / 180

	const x = layerWidth / 2 + (layerWidth / 2) * Math.sin(adjustedAzimuthRad)
	const y = layerHeight / 2 - (Math.sin(altitudeRad) * layerHeight) / 2

	return { x, y, horizonY: getHorizonY(layerHeight) }
}

export const shouldDrawSkyObject = (altitude: number): boolean => {
	return altitude > 0 || variables.displayConfig.display_below_horizon
}

export const isLandscapeEnabled = (): boolean => {
	if (!variables.displayConfig.display_landscape) {
		return false
	}

	return document.documentElement.dataset.landscape !== 'false'
}

/** Phase shadow must match the visible backdrop behind the celestials canvas. */
export const getPhaseShadowColor = (skyRgb: RgbTuple): string => {
	if (!isLandscapeEnabled()) {
		return 'rgba(0, 0, 0, 0.9)'
	}

	return `rgba(${skyRgb.join(',')}, 0.9)`
}
