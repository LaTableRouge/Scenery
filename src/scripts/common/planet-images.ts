import { getImg } from './functions'

const PLANET_IMAGE_BASE = './build/assets/src/img/planets'
const planetImageCache = new Map<string, HTMLImageElement>()

const planetNames = ['mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'sun', 'moon', 'mercury', 'venus']

export const preloadPlanetImages = (): Promise<HTMLImageElement[]> => {
	return Promise.all(planetNames.map((name) => getPlanetImage(name)))
}

export const getPlanetImage = (name: string): Promise<HTMLImageElement> => {
	const key = name.toLowerCase()
	const cached = planetImageCache.get(key)

	if (cached) {
		return Promise.resolve(cached)
	}

	return getImg(`${PLANET_IMAGE_BASE}/${key}.png`).then((img) => {
		planetImageCache.set(key, img)
		return img
	})
}
