import { getDeviceType } from '../common/functions'
import type { DrawnLayer, LandscapeLayer, RgbTuple, SceneryConfig } from '../common/types'
import layer1 from './landscape/layer1'
import layer2 from './landscape/layer2'
import layer3 from './landscape/layer3'
import layer4 from './landscape/layer4'
import layer5 from './landscape/layer5'
import layer6 from './landscape/layer6'
import layer7 from './landscape/layer7'
import layer8 from './landscape/layer8'
import layer9 from './landscape/layer9'
import layer10 from './landscape/layer10'

let sceneryCacheKey = ''
let cachedDrawnLayers: DrawnLayer[] | null = null
let parallaxFrameId: number | null = null

const buildColorCacheKey = (colors: RgbTuple[]): string => {
	return `${window.innerWidth}x${window.innerHeight}:${colors.map((color) => color.join(',')).join('|')}`
}

const configScenery = (colors: RgbTuple[]): SceneryConfig & { imageWaits: Promise<void>[] } => {
	const sceneryObject: Record<string, LandscapeLayer> = {}

	sceneryObject.layer1 = layer1([`rgb(${colors[1]})`])
	sceneryObject.layer2 = layer2([`rgb(${colors[2]})`])
	sceneryObject.layer3 = layer3([`rgb(${colors[3]})`])
	sceneryObject.layer4 = layer4([`rgb(${colors[4]})`])
	sceneryObject.layer5 = layer5([`rgb(${colors[5]})`, `rgb(${colors[11]})`, `rgb(${colors[12]})`, `rgb(${colors[13]})`, `rgb(${colors[14]})`])
	sceneryObject.layer6 = layer6([`rgb(${colors[6]})`, `rgb(${colors[15]})`, `rgb(${colors[16]})`, `rgb(${colors[19]})`, `rgb(${colors[20]})`, `rgb(${colors[21]})`, `rgb(${colors[22]})`])
	sceneryObject.layer7 = layer7([`rgb(${colors[7]})`, `rgb(${colors[17]})`, `rgb(${colors[18]})`])
	sceneryObject.layer8 = layer8([`rgb(${colors[8]})`])
	sceneryObject.layer9 = layer9([`rgb(${colors[9]})`])
	sceneryObject.layer10 = layer10([`rgb(${colors[10]})`])

	const layers: SceneryConfig['layers'] = {}
	const imageWaits: Promise<void>[] = []

	for (const property in sceneryObject) {
		const layer = sceneryObject[property]
		const img = new Image()
		const dataURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(layer.svg)

		imageWaits.push(
			new Promise<void>((resolve) => {
				img.onload = () => {
					layers[property] = { img }
					resolve()
				}
				img.onerror = () => resolve()
			})
		)

		img.src = dataURL
	}

	return {
		sceneryObject,
		layers,
		imageWaits
	}
}

const waitForSceneryImages = (imageWaits: Promise<void>[]): Promise<void> => {
	return Promise.all(imageWaits).then(() => undefined)
}

const initScenery = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, sceneryObject: Record<string, LandscapeLayer>, layers: SceneryConfig['layers'], parallaxOffsetX = 0, parallaxOffsetY = 0): DrawnLayer[] => {
	const drawnLayers: DrawnLayer[] = []
	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight
	const heightRatio = Math.round(windowHeight / windowWidth)

	canvas.width = windowWidth
	canvas.style.width = `${windowWidth}px`
	canvas.height = windowHeight
	canvas.style.height = `${windowHeight}px`

	context.clearRect(0, 0, windowWidth, windowHeight)

	for (const property in sceneryObject) {
		const layer = sceneryObject[property]
		const length = Object.keys(sceneryObject).length + 1

		let layerWidth = windowHeight * 2
		let layerHeight = windowHeight
		if (layerWidth > 2000) {
			layerWidth = 2000
			layerHeight = 1000
		}
		if (heightRatio >= 1) {
			layerWidth = windowWidth
			layerHeight = windowWidth / 2
		}

		const layerCanvas = document.createElement('canvas')
		layerCanvas.width = windowWidth
		layerCanvas.height = windowHeight
		const layerContext = layerCanvas.getContext('2d')
		if (!layerContext || !layers[property].img) {
			continue
		}

		layerContext.drawImage(layers[property].img, 0, windowHeight - layerHeight, layerWidth, layerHeight)

		while (layerWidth < windowWidth) {
			layerContext.drawImage(layerCanvas, layerWidth, 0)
			layerWidth <<= 1
		}

		const layerXPosition = parallaxOffsetX / (100 * (length - layer.layerNumber))
		const layerYPosition = parallaxOffsetY / (100 * (length - layer.layerNumber))
		context.drawImage(layerCanvas, layerXPosition, layerYPosition)

		drawnLayers.push({
			layerNumber: layer.layerNumber,
			layer: layerCanvas
		})
	}

	return drawnLayers
}

const redrawParallax = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, drawnLayers: DrawnLayer[], offsetX: number, offsetY: number): void => {
	context.clearRect(0, 0, canvas.width, canvas.height)
	drawnLayers.forEach((element) => {
		const length = drawnLayers.length + 1
		const layerXPositionOffset = offsetX / (100 * (length - element.layerNumber))
		const layerYPositionOffset = offsetY / (100 * (length - element.layerNumber))
		context.drawImage(element.layer, layerXPositionOffset, layerYPositionOffset)
	})
}

const attachParallax = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, drawnLayers: DrawnLayer[]): void => {
	window.onmousemove = null

	if (getDeviceType() !== 'desktop') {
		return
	}

	let pendingOffsetX = 0
	let pendingOffsetY = 0

	const parallaxFunction = (event: MouseEvent) => {
		pendingOffsetX = event.clientX
		pendingOffsetY = event.clientY

		if (parallaxFrameId !== null) {
			return
		}

		parallaxFrameId = window.requestAnimationFrame(() => {
			parallaxFrameId = null
			redrawParallax(canvas, context, drawnLayers, pendingOffsetX, pendingOffsetY)
		})
	}

	window.onmousemove = parallaxFunction
}

export const invalidateSceneryCache = (): void => {
	sceneryCacheKey = ''
	cachedDrawnLayers = null
	window.onmousemove = null

	if (parallaxFrameId !== null) {
		window.cancelAnimationFrame(parallaxFrameId)
		parallaxFrameId = null
	}
}

export const clearScenery = (): void => {
	const canvas = document.getElementById('scenery__layers') as HTMLCanvasElement | null
	if (!canvas) {
		return
	}

	const context = canvas.getContext('2d')
	if (context) {
		context.clearRect(0, 0, canvas.width, canvas.height)
	}

	invalidateSceneryCache()
}

export const makeScenery = async (colors: RgbTuple[]): Promise<void> => {
	const canvas = document.getElementById('scenery__layers') as HTMLCanvasElement | null
	if (!canvas) {
		return
	}

	const context = canvas.getContext('2d')
	if (!context) {
		return
	}

	const cacheKey = buildColorCacheKey(colors)
	const sceneryChanged = cacheKey !== sceneryCacheKey

	if (sceneryChanged) {
		const scenery = configScenery(colors)
		await waitForSceneryImages(scenery.imageWaits)
		cachedDrawnLayers = initScenery(canvas, context, scenery.sceneryObject, scenery.layers)
		sceneryCacheKey = cacheKey
		attachParallax(canvas, context, cachedDrawnLayers)
		return
	}

	if (cachedDrawnLayers) {
		redrawParallax(canvas, context, cachedDrawnLayers, 0, 0)
	}
}
