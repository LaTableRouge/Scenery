import { type Body, Equator, Horizon, Illumination, type Observer,RotateVector, Rotation_EQD_HOR as RotationEQDHor } from 'astronomy-engine'

import { getPlanetImage } from '../../common/planet-images'
import { getSkyCanvasPosition, shouldDrawSkyObject } from '../../common/sky-projection'
import type { CelestialBodyConfig } from '../../common/types'
import { variables } from '../../common/variables'

type CameraData = {
	phaseAngle: number
	tiltAngle: number
	magnitude: number
}

const DEG2RAD = Math.PI / 180

const Camera = (observer: Observer, time: Date, bodyName: string): CameraData => {
	const bodyEquator = Equator(bodyName as Body, time, observer, true, false)
	const illum = Illumination(bodyName as Body, time)
	const vec = RotateVector(RotationEQDHor(time, observer), bodyEquator.vec)
	const tilt = Math.atan2(vec.y, vec.z) / DEG2RAD

	return {
		phaseAngle: illum.phase_angle,
		tiltAngle: tilt,
		magnitude: illum.mag
	}
}

const drawBodyOnMainCanvas = (context: CanvasRenderingContext2D, bodyCanvas: HTMLCanvasElement, x: number, y: number, tiltAngle: number, size: number): void => {
	context.save()
	context.translate(x, y)
	context.rotate(tiltAngle * DEG2RAD)
	context.translate(-x, -y)
	context.drawImage(bodyCanvas, x - size, y - size)
	context.restore()
}

export const celestialDraw = async (context: CanvasRenderingContext2D, layerWidth: number, layerHeight: number, observer: Observer, config: CelestialBodyConfig): Promise<void> => {
	const date = variables.config.date()
	if (document.documentElement.dataset.theme_hours !== undefined) {
		date.setHours(Number(document.documentElement.dataset.theme_hours), Number(document.documentElement.dataset.theme_minutes), 0)
	}

	const EQUOfDate = Equator(config.name as Body, date, observer, true, true)
	const hor = Horizon(date, observer, EQUOfDate.ra, EQUOfDate.dec, 'normal')
	const altitude = hor.altitude

	if (!shouldDrawSkyObject(altitude)) {
		return
	}

	const { x, y } = getSkyCanvasPosition(layerWidth, layerHeight, hor.azimuth, altitude)
	const cameraDatas = Camera(observer, date, config.name)

	let phaseAngle = (cameraDatas.phaseAngle % 360) / 360
	phaseAngle = (phaseAngle + 0.5) % 1

	let phase = 0
	if (phaseAngle <= 0.5) {
		phase = 4 * phaseAngle - 1
	} else {
		phase = 4 * (1 - phaseAngle) - 1
	}

	const bodyCanvas = document.createElement('canvas')
	bodyCanvas.width = config.size * 2
	bodyCanvas.height = config.size * 2
	const bodyContext = bodyCanvas.getContext('2d')
	if (!bodyContext) {
		return
	}

	try {
		const img = await getPlanetImage(config.name)
		const imgWidth = img.width
		const imgHeight = img.height
		const canvasWidth = bodyCanvas.width
		const canvasHeight = bodyCanvas.height
		const aspectRatioImg = imgWidth / imgHeight
		const aspectRatioCanvas = canvasWidth / canvasHeight

		let scale = 1
		if (aspectRatioImg > aspectRatioCanvas) {
			scale = canvasWidth / imgWidth
		} else {
			scale = canvasHeight / imgHeight
		}

		const newImgWidth = imgWidth * scale
		const newImgHeight = imgHeight * scale

		if (config.phases) {
			bodyContext.beginPath()
			bodyContext.arc(config.size, config.size, config.size, 0, 2 * Math.PI, true)
			bodyContext.closePath()
			bodyContext.fillStyle = 'rgba(0,0,0,0)'
			bodyContext.fill()
			bodyContext.drawImage(img, 0, 0, newImgWidth, newImgHeight)

			bodyContext.beginPath()
			bodyContext.arc(config.size, config.size, config.size, -Math.PI / 2, Math.PI / 2, true)
			bodyContext.closePath()
			bodyContext.fillStyle = config.shadowColor ?? 'rgba(0,0,0,0.9)'
			bodyContext.fill()

			bodyContext.translate(config.size, config.size)
			bodyContext.scale(phase, 1)
			bodyContext.translate(-config.size, -config.size)
			bodyContext.beginPath()
			bodyContext.arc(config.size, config.size, config.size, -Math.PI / 2, Math.PI / 2, true)
			bodyContext.closePath()
			bodyContext.fillStyle = phase > 0 ? 'rgba(0,0,0,0)' : (config.shadowColor ?? 'rgba(0,0,0,0.9)')
			bodyContext.fill()

			if (phaseAngle > 0.25 && phaseAngle < 0.75) {
				bodyContext.drawImage(img, 0, 0, newImgWidth, newImgHeight)
			}

			drawBodyOnMainCanvas(context, bodyCanvas, x, y, cameraDatas.tiltAngle, config.size)
		} else {
			if (config.shadowBlur) {
				context.shadowColor = config.color
				context.shadowBlur = 15
			}

			bodyContext.drawImage(img, 0, 0, newImgWidth, newImgHeight)
			drawBodyOnMainCanvas(context, bodyCanvas, x, y, cameraDatas.tiltAngle, config.size)
		}
	} catch {
		context.beginPath()
		context.fillStyle = config.color
		context.arc(x, y, config.size, 0, Math.PI * 2)
		context.fill()
	}

	context.shadowBlur = 0

	if (variables.displayConfig.display_names) {
		context.font = '14px Arial'
		context.fillStyle = 'white'
		context.fillText(config.name, x + config.size + 5, y + config.size + 5)
	}
}
