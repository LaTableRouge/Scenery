import { DefineStar, Equator, Horizon, type Observer } from 'astronomy-engine'

import { getStarCanvasPosition, shouldDrawSkyObject } from '../../common/sky-projection'
import type { StarEntry, StarsConfig } from '../../common/types'
import { variables } from '../../common/variables'

export const starsDraw = (context: CanvasRenderingContext2D, layerWidth: number, layerHeight: number, observer: Observer, starCatalog: StarEntry[], config: StarsConfig): void => {
	const date = variables.config.date()
	if (document.documentElement.dataset.theme_hours !== undefined) {
		date.setHours(Number(document.documentElement.dataset.theme_hours), Number(document.documentElement.dataset.theme_minutes), 0)
	}

	for (let i = 0; i < starCatalog.length; ++i) {
		const star = starCatalog[i]
		if (star.mag > config.starMagnitudeLimit) {
			continue
		}

		DefineStar('Star1', star.ra, star.dec, 1000)
		const EQUOfDate = Equator('Star1', date, observer, true, true)
		const horizon = Horizon(date, observer, EQUOfDate.ra, EQUOfDate.dec, 'normal')
		const altitude = horizon.altitude

		if (!shouldDrawSkyObject(altitude)) {
			continue
		}

		const { x, y } = getStarCanvasPosition(layerWidth, layerHeight, horizon.azimuth, altitude)

		let color: string
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

		if (variables.displayConfig.display_names) {
			context.font = '10px Arial'
			context.fillStyle = 'white'
			context.fillText(star.name, x + 5, y + 5)
		}
	}
}
