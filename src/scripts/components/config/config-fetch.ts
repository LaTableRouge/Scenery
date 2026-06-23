import type { DisplayConfig } from '../../common/types'
import { variables } from '../../common/variables'
import { resetAnim } from '../animation-reset'

export const fetchConfig = (): void => {
	const queryString = window.location.search
	const urlParams = new URLSearchParams(queryString)
	if (!urlParams.get('no-controls')) {
		document.documentElement.removeAttribute('data-theme_hours')
		document.documentElement.removeAttribute('data-theme_minutes')

		const entries = urlParams.entries()
		if (entries) {
			for (const entry of entries) {
				const key = entry[0] as keyof DisplayConfig
				if (variables.displayConfig[key] !== undefined) {
					const boolValue = String(entry[1]) === 'true'
					if (key !== 'display_time') {
						;(variables.displayConfig[key] as boolean) = boolValue
					}

					if (key === 'display_landscape' && !boolValue) {
						document.documentElement.dataset.landscape = 'false'
					}

					if (key === 'display_time') {
						if (entry[1] !== 'now') {
							const foundTime = variables.config.states.find((state) => state.name === entry[1])
							if (foundTime) {
								const time = `${foundTime.time}`.split('.')

								// Add the time to html params
								document.documentElement.dataset.theme_hours = time[0]
								document.documentElement.dataset.theme_minutes = time[1]
							}
						}

						variables.displayConfig.display_time = entry[1]
					}
				}
			}

			resetAnim()
		}

		const geolocation = urlParams.get('geolocation')
		if (geolocation) {
			navigator.geolocation.getCurrentPosition(
				(param) => {
					// Add the coordinates to the global config object
					variables.config.base_coordinates.lat = param.coords.latitude
					variables.config.base_coordinates.long = param.coords.longitude

					// Add the timezone to html params
					const date = new Date(param.timestamp)
					document.documentElement.dataset.theme_hours = String(date.getHours())
					document.documentElement.dataset.theme_minutes = String(date.getMinutes())

					resetAnim()
				},
				() => {
					resetAnim()
				}
			)
		}
	}
}
