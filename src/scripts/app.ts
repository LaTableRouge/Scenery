import '../styles/app.scss'

import { Observer } from 'astronomy-engine'

import { getDeviceType } from './common/functions'
import { preloadPlanetImages } from './common/planet-images'
import { variables } from './common/variables'
import { startAnim } from './components/animation-start'
import { updateAnim } from './components/animation-update'
import { sunPhases } from './components/celestial/sun-phases'
import { fetchConfig } from './components/config/config-fetch'
import { setConfig } from './components/config/config-set'
import { toggleConfig } from './components/config/config-toggle'

window.addEventListener('DOMContentLoaded', () => {
	const observer = new Observer(variables.config.base_coordinates.lat, variables.config.base_coordinates.long, 0)

	sunPhases(observer)
	preloadPlanetImages()

	fetchConfig()
	setConfig()
	toggleConfig()

	startAnim()

	let timeout: number | undefined
	let windowXinitialValue = window.innerWidth
	window.addEventListener('resize', () => {
		if (timeout) {
			window.cancelAnimationFrame(timeout)
		}

		timeout = window.requestAnimationFrame(() => {
			if (getDeviceType() === 'desktop') {
				void updateAnim()
			} else if (window.innerWidth !== windowXinitialValue) {
				void updateAnim()
				windowXinitialValue = window.innerWidth
			}
		})
	})

	window.addEventListener('message', (event) => {
		if (event.origin.includes('.mlnop.fr') || event.origin === 'http://local.mlnop.fr' || event.origin === 'http://local.library.fr' || event.origin === 'https://latablegrise.fr' || event.origin === 'https://latableorange.fr' || event.origin === 'https://latablerouge.ninja' || event.origin === 'https://latablebleue.fr') {
			window.parent.postMessage(document.documentElement.style.cssText, '*')
		}
	})
})
