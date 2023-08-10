import { SearchAltitude, SearchHourAngle, SearchRiseSet } from 'astronomy-engine'

import { round } from '../../common/functions'
import { variables } from '../../common/variables'

const sunFormatTime = (date) => {
  const hours = date.getHours()
  let minutes = date.getMinutes()
  minutes = minutes / 100

  return round(hours + minutes, 2)
}

export const sunPhases = (observer) => {
  const date = variables.config.date()
  if (document.documentElement.dataset.theme_hours !== undefined) {
    date.setHours(Number(document.documentElement.dataset.theme_hours), Number(document.documentElement.dataset.theme_minutes), 0)
  }

  let sunPhases = []

  const noonInfos = SearchHourAngle('Sun', observer, 0, date)
  sunPhases.push({ name: 'solarNoon', time: sunFormatTime(noonInfos.time.date) })

  const nadirInfos = SearchHourAngle('Sun', observer, 12, date)
  sunPhases.push({ name: 'nadir', time: sunFormatTime(nadirInfos.time.date) })

  const dawnInfos = SearchAltitude('Sun', observer, 1, date, 1, -6)
  sunPhases.push({ name: 'dawn', time: sunFormatTime(dawnInfos.date) })

  const nauticalDawnInfos = SearchAltitude('Sun', observer, 1, date, 1, -12)
  sunPhases.push({ name: 'nauticalDawn', time: sunFormatTime(nauticalDawnInfos.date) })

  const duskInfos = SearchAltitude('Sun', observer, -1, date, 1, -6)
  sunPhases.push({ name: 'dusk', time: sunFormatTime(duskInfos.date) })

  const nauticalDuskInfos = SearchAltitude('Sun', observer, -1, date, 1, -12)
  sunPhases.push({ name: 'nauticalDusk', time: sunFormatTime(nauticalDuskInfos.date) })

  const nightInfos = SearchAltitude('Sun', observer, -1, date, 1, -18)
  sunPhases.push({ name: 'night', time: sunFormatTime(nightInfos.date) })

  const nightEndInfos = SearchAltitude('Sun', observer, 1, date, 1, -18)
  sunPhases.push({ name: 'nightEnd', time: sunFormatTime(nightEndInfos.date) })

  const sunriseInfos = SearchRiseSet('Sun', observer, 1, date, 1, 0)
  sunPhases.push({ name: 'sunrise', time: sunFormatTime(sunriseInfos.date) })

  const sunriseEndInfos = SearchAltitude('Sun', observer, 1, date, 1, 0)

  sunPhases.push({ name: 'sunriseEnd', time: sunFormatTime(sunriseEndInfos.date) })
  const sunsetInfos = SearchRiseSet('Sun', observer, -1, date, 1, 0)
  sunPhases.push({ name: 'sunset', time: sunFormatTime(sunsetInfos.date) })

  const sunsetStartInfos = SearchAltitude('Sun', observer, -1, date, 1, 0)
  sunPhases.push({ name: 'sunsetStart', time: sunFormatTime(sunsetStartInfos.date) })

  const goldenHourInfos = SearchAltitude('Sun', observer, -1, date, 1, 6)
  sunPhases.push({ name: 'goldenHour', time: sunFormatTime(goldenHourInfos.date) })

  const goldenHourEndInfos = SearchAltitude('Sun', observer, 1, date, 1, 6)
  sunPhases.push({ name: 'goldenHourEnd', time: sunFormatTime(goldenHourEndInfos.date) })

  // sort by time
  sunPhases = sunPhases.sort((a, b) => (a.time > b.time ? 1 : b.time > a.time ? -1 : 0))

  // remplis l'array de config avec les temps récupéré par l'api
  // récupère les temps de couché & levé de soleil
  if (sunPhases.length) {
    sunPhases.forEach((sunPhase, index) => {
      const name = sunPhase.name
      const time = sunPhase.time

      const found = variables.config.states.findIndex((state) => state.name === name)
      if (found !== undefined && found !== null) {
        variables.config.states[found].time = time
      }
    })
  }
}
