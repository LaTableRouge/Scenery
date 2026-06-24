import type { DeviceType, RgbTuple } from './types'
import { variables } from './variables'

export const hexToRgb = (hex: string): RgbTuple | null => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null
}

export const lerp = (start: number, end: number, progress: number): number => {
	return (1 - progress) * start + progress * end
}

export const applyColour = (key: string, color: RgbTuple): void => {
	document.documentElement.style.setProperty(`--color-${key}`, `rgb(${color.join(',')})`)
	document.documentElement.style.setProperty(`--color-rgb-${key}`, color.join(','))
}

export const round = (num: number, places: number): number => {
	const power = Math.pow(10, places)
	return Math.round(num * power) / power
}

export const getProgress = (): number => {
	const d = variables.config.date()
	if (document.documentElement.dataset.theme_hours !== undefined) {
		d.setHours(Number(document.documentElement.dataset.theme_hours), Number(document.documentElement.dataset.theme_minutes), 0)
	}

	return variables.config.anims[variables.animMode].getProgress(d)
}

export const getDeviceType = (): DeviceType => {
	const ua = navigator.userAgent
	if (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1) {
		return 'tablet'
	}
	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		return 'tablet'
	}
	if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
		return 'mobile'
	}
	return 'desktop'
}

export const getImg = (url: string): Promise<HTMLImageElement> => {
	const img = new Image()
	img.crossOrigin = '*'
	img.src = url

	return new Promise((resolve, reject) => {
		img.onload = () => resolve(img)
		img.onerror = (err) => reject(err)
	})
}
