import { Observer } from 'astronomy-engine'

import { getProgress, hexToRgb, lerp } from '../common/functions'
import { variables } from '../common/variables'
import { celestialDraw } from './celestial/celestial-draw'
import { drawHorizon } from './celestial/horizon-draw'
import { sunPhases } from './celestial/sun-phases'

const getBGBackground = () => {
  // Get the progress through the animation. getProgress returns a number between 0 and 1.
  // To simplify working with time, we multiply this by 24 to get progress through the day.
  const progress = getProgress() * 24
  // Find the next 'state' we are transitioning to based on the 'at' property.
  // The 'at' property sets at what hour that state should be at.
  let nextIndex = variables.config.states.findIndex((frame) => {
    return frame.time !== 0 && progress < frame.time
  })
  if (nextIndex < 0) {
    nextIndex = 0
  }

  // The previous 'state' is the one before the next one, so we remove 1.
  let lastIndex = nextIndex - 1
  if (lastIndex < 0) {
    lastIndex = variables.config.states.length - 1
  }

  // Get the onjects for the last and next states
  const lastState = variables.config.states[lastIndex]
  const nextState = variables.config.states[nextIndex]

  // Calculate the difference between the 'at' values of the previous and last states,
  // so we can get our progress between them based on the progress we got above.
  const diff = nextState.time - lastState.time
  const progressCurr = (progress - lastState.time) / diff

  // We use hex codes for colours for convenience, but it's a lot easier to transition
  // seperate Red, Green, Blue values so we convert them to a [R, G, B] array
  const lastRGB = hexToRgb(lastState.colors_palette[0])
  const nextRGB = hexToRgb(nextState.colors_palette[0])

  // Get the new RGB by using 'lerping' to find the value between the last and next
  // colours based on how far we are through the current animation.
  // The lerp function doesn't necessarily return an int so we round it.
  return [Math.round(lerp(lastRGB[0], nextRGB[0], progressCurr)), Math.round(lerp(lastRGB[1], nextRGB[1], progressCurr)), Math.round(lerp(lastRGB[2], nextRGB[2], progressCurr))]
}

const celestialBodiesConfig = {
  Mars: {
    name: 'Mars',
    color: '#f0e7e7',
    size: 15,
    phases: true,
    shadowBlur: false
  },
  Jupiter: {
    name: 'Jupiter',
    color: '#ebf3f6',
    size: 15,
    phases: true,
    shadowBlur: false
  },
  Saturn: {
    name: 'Saturn',
    color: '#ead6b8',
    size: 22,
    phases: false,
    shadowBlur: false
  },
  Uranus: {
    name: 'Uranus',
    color: '#ACE5EE',
    size: 18,
    phases: false,
    shadowBlur: false
  },
  Neptune: {
    name: 'Neptune',
    color: '#5b5ddf',
    size: 15,
    phases: true,
    shadowBlur: false
  },
  Sun: {
    name: 'Sun',
    color: '#fdfbd3',
    size: 30,
    phases: false,
    shadowBlur: true
  },
  Moon: {
    name: 'Moon',
    color: '#f4f6f0',
    size: 30,
    phases: true,
    shadowBlur: false
  },
  Mercury: {
    name: 'Mercury',
    color: '#e5e5e5',
    size: 15,
    phases: true,
    shadowBlur: false
  },
  Venus: {
    name: 'Venus',
    color: '#8B7D82',
    size: 15,
    phases: true
  }
}

export const createCelestials = (bgColorRGB) => {
  const canvas = document.getElementById('celestials__layers')
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

    // Get the sun phases through the day and add it to global variables
    sunPhases(observer)

    if (variables.displayConfig.display_horizon) {
      drawHorizon(context, windowWidth, windowHeight)
    }

    if (!bgColorRGB) {
      bgColorRGB = getBGBackground()
    }

    for (const body in celestialBodiesConfig) {
      if (variables.displayConfig[`display_${body.toLowerCase()}`]) {
        const config = celestialBodiesConfig[body]
        config.shadowColor = `rgba(${bgColorRGB}, 0.9)`

        // Draw celestials bodies
        celestialDraw(context, windowWidth, windowHeight, observer, config)
      }
    }
  }
}
