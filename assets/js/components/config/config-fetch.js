import { variables } from '../../common/variables'
import { resetAnim } from '../animation-reset'

export const fetchConfig = () => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  if (!urlParams.get('no-controls')) {
    document.documentElement.removeAttribute('data-theme_hours')
    document.documentElement.removeAttribute('data-theme_minutes')

    const entries = urlParams.entries()
    if (entries) {
      for (const entry of entries) {
        if (variables.displayConfig[entry[0]] !== undefined) {
          const boolValue = String(entry[1]) === 'true'
          variables.displayConfig[entry[0]] = boolValue

          if (entry[0] === 'display_landscape' && !boolValue) {
            document.documentElement.dataset.landscape = false
          }

          if (entry[0] === 'display_time') {
            if (entry[1] !== 'now') {
              let foundTime = variables.config.states.filter((state) => state.name === entry[1])
              if (foundTime.length) {
                foundTime = foundTime[0]

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
          document.documentElement.dataset.theme_hours = date.getHours()
          document.documentElement.dataset.theme_minutes = date.getMinutes()

          resetAnim()
        },
        () => {
          resetAnim()
        }
      )
    }
  }
}
