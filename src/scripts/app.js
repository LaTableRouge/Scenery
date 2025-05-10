import '../styles/app.scss' // nécéssaire pour le Hot Module Reload

import { Observer } from 'astronomy-engine'

import { getDeviceType } from './common/functions'
import { variables } from './common/variables'
import { startAnim } from './components/animation-start'
import { updateAnim } from './components/animation-update'
import { sunPhases } from './components/celestial/sun-phases'
import { fetchConfig } from './components/config/config-fetch'
import { setConfig } from './components/config/config-set'
import { toggleConfig } from './components/config/config-toggle'

window.addEventListener('DOMContentLoaded', () => {
	// Set the date and observer location
	const observer = new Observer(variables.config.base_coordinates.lat, variables.config.base_coordinates.long, 0)

	// Get the sun phases through the day and add it to global variables
	sunPhases(observer)

	/*
   * Fetch config from url
   * Set config from form
   * Open/Close config panel
   * */
	fetchConfig()
	setConfig()
	toggleConfig()

	startAnim()

	/*
   * Update la scène on resize
   * */
	let timeout
	let windowXinitialValue = window.innerWidth
	window.addEventListener('resize', () => {
		if (timeout) {
			window.cancelAnimationFrame(timeout)
		}

		timeout = window.requestAnimationFrame(async () => {
			if (getDeviceType() === 'desktop') {
				updateAnim()
			} else {
				if (window.innerWidth !== windowXinitialValue) {
					updateAnim()
					windowXinitialValue = window.innerWidth
				}
			}
		})
	})
})
