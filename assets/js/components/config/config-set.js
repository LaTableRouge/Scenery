import { variables } from '../../common/variables'
import { resetAnim } from '../animation-reset'

export const setConfig = () => {
  const form = document.querySelector('.js-config')
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault()

      const formData = new FormData(form)
      const entriesKeys = []

      for (const pair of formData.entries()) {
        entriesKeys.push(pair[0])
      }

      for (const key in variables.displayConfig) {
        if (key === 'display_landscape') {
          if (entriesKeys.includes(key)) {
            document.documentElement.removeAttribute('data-landscape')
          } else {
            document.documentElement.dataset.landscape = false
          }
        }
        if (key === 'display_time') {
          const time = formData.get(key)
          if (time === 'now') {
            document.documentElement.removeAttribute('data-theme_hours')
            document.documentElement.removeAttribute('data-theme_minutes')
          } else {
            let foundTime = variables.config.states.filter((state) => state.name === time)
            if (foundTime.length) {
              foundTime = foundTime[0]

              const time = `${foundTime.time}`.split('.')

              // Add the time to html params
              document.documentElement.dataset.theme_hours = time[0]
              document.documentElement.dataset.theme_minutes = time[1]
            }
          }
          variables.displayConfig[key] = formData.get(key)
        } else {
          if (entriesKeys.includes(key)) {
            variables.displayConfig[key] = true
          } else {
            variables.displayConfig[key] = false
          }
        }
      }

      resetAnim()
    })
  }
}
