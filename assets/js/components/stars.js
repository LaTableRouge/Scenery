import { Observer } from 'astronomy-engine'

import { variables } from '../common/variables'
import { starCatalog } from './stars/stars-catalog'
import { starsDraw } from './stars/stars-draw'

const starsConfig = {
  starMagnitudeLimit: 6.0,
  brightStarColor: '#ffffff',
  mediumStarColor: '#afafaf',
  dimStarColor: '#7f7f7f'
}

export const createStars = () => {
  const canvas = document.getElementById('stars__layers')
  if (canvas) {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // Set des dimensions du canvas
    canvas.width = windowWidth
    canvas.style.width = `${windowWidth}px`
    canvas.height = windowHeight
    canvas.style.height = `${windowHeight}px`

    // clear canvas
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Set the date and observer location
    const observer = new Observer(variables.config.base_coordinates.lat, variables.config.base_coordinates.long, 0)

    starsDraw(context, windowWidth, windowHeight, observer, starCatalog, starsConfig)
  }
}
