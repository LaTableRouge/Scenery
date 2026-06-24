import { variables } from '../../common/variables'
import { resetAnim } from '../animation-reset'

export const setConfig = (): void => {
	const form = document.querySelector('.js-config') as HTMLFormElement | null
	if (form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault()

			const formData = new FormData(form)
			const entriesKeys: string[] = []

			for (const pair of formData.entries()) {
				entriesKeys.push(pair[0])
			}

			for (const key in variables.displayConfig) {
				if (key === 'display_landscape') {
					if (entriesKeys.includes(key)) {
						document.documentElement.removeAttribute('data-landscape')
					} else {
						document.documentElement.dataset.landscape = 'false'
					}
				}
				if (key === 'display_time') {
					const time = formData.get(key) as string
					if (time === 'now') {
						document.documentElement.removeAttribute('data-theme_hours')
						document.documentElement.removeAttribute('data-theme_minutes')
					} else {
						const foundTime = variables.config.states.find((state) => state.name === time)
						if (foundTime) {
							const timeParts = `${foundTime.time}`.split('.')

							// Add the time to html params
							document.documentElement.dataset.theme_hours = timeParts[0]
							document.documentElement.dataset.theme_minutes = timeParts[1]
						}
					}
					variables.displayConfig[key] = time
				} else {
					if (entriesKeys.includes(key)) {
						;(variables.displayConfig[key as keyof typeof variables.displayConfig] as boolean) = true
					} else {
						;(variables.displayConfig[key as keyof typeof variables.displayConfig] as boolean) = false
					}
				}
			}

			resetAnim()
		})
	}
}
