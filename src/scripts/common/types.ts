export type RgbTuple = [number, number, number]

export type ColorsPalette = Record<string, string>

export type SceneState = {
	name: string
	time?: number
	colors_palette: ColorsPalette
}

export type Coordinates = {
	lat: number
	long: number
}

export type AnimConfig = {
	interval: number
	getProgress: (now: Date) => number
}

export type DisplayConfig = {
	display_time: string
	display_names: boolean
	display_stars: boolean
	display_landscape: boolean
	display_below_horizon: boolean
	display_horizon: boolean
	display_sun: boolean
	display_neptune: boolean
	display_uranus: boolean
	display_saturn: boolean
	display_jupiter: boolean
	display_mars: boolean
	display_moon: boolean
	display_venus: boolean
	display_mercury: boolean
}

export type AppConfig = {
	anims: Record<string, AnimConfig>
	base_coordinates: Coordinates
	date: (time?: string | number | Date) => Date
	horizon: (height?: number) => number
	states: SceneState[]
}

export type Variables = {
	config: AppConfig
	facingAzimuth: number
	displayConfig: DisplayConfig
	animation: ReturnType<typeof setInterval> | false
	animMode: string
}

export type DeviceType = 'desktop' | 'tablet' | 'mobile'

export type LandscapeLayer = {
	layerNumber: number
	svg: string
}

export type CelestialBodyConfig = {
	name: string
	color: string
	size: number
	phases?: boolean
	shadowBlur?: boolean
	shadowColor?: string
}

export type StarEntry = {
	name: string
	ra: number
	dec: number
	mag: number
}

export type StarsConfig = {
	starMagnitudeLimit: number
	brightStarColor: string
	mediumStarColor: string
	dimStarColor: string
}

export type DrawnLayer = {
	layerNumber: number
	layer: HTMLCanvasElement
}

export type SceneryLayers = Record<string, { img: HTMLImageElement }>

export type SceneryConfig = {
	sceneryObject: Record<string, LandscapeLayer>
	layers: SceneryLayers
}
