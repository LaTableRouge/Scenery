import { DefineStar, Equator, Horizon } from 'astronomy-engine'

import { variables } from '../../common/variables'

export const starsDraw = (context, layerWidth, layerHeight, observer, starCatalog, config) => {
  const date = variables.config.date()
  if (document.documentElement.dataset.theme_hours !== undefined) {
    date.setHours(Number(document.documentElement.dataset.theme_hours), Number(document.documentElement.dataset.theme_minutes), 0)
  }

  for (let i = 0; i < starCatalog.length; ++i) {
    const star = starCatalog[i]
    if (star.mag <= config.starMagnitudeLimit) {
      DefineStar('Star1', star.ra, star.dec, 1000)
      const EQUOfDate = Equator('Star1', date, observer, true, true)
      const horizon = Horizon(date, observer, EQUOfDate.ra, EQUOfDate.dec, 'normal')
      const altitude = horizon.altitude
      if (altitude > 0 || variables.displayConfig.display_below_horizon) {
        let azimuth = horizon.azimuth
        // add the facing azimuth for the sun to rise in the right and set on the left
        azimuth = azimuth + (270.0 - variables.facingAzimuth)

        const x = layerWidth / 2 + (layerWidth / 2) * Math.cos(azimuth - Math.PI / 2)
        const y = layerHeight / 2 - (Math.sin((altitude * Math.PI) / 180) * layerHeight) / 2

        let color
        if (star.mag <= 2.0) {
          color = config.brightStarColor
        } else if (star.mag <= 3.5) {
          color = config.mediumStarColor
        } else {
          color = config.dimStarColor
        }

        context.beginPath()
        context.fillStyle = color
        context.arc(x, y, 1, 0, 2 * Math.PI)
        context.fill()

        // Draw text next to the celestial body
        if (variables.displayConfig.display_names) {
          context.font = '10px Arial'
          context.fillStyle = 'white'
          context.fillText(star.name, x + 5, y + 5)
        }

        // TODO : vérifier le bon positionnement
      }
    }
  }
}
