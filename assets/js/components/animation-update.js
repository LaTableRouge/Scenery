import { applyColour, getProgress, hexToRgb, lerp } from '../common/functions'
import { variables } from '../common/variables'
import { createCelestials } from './celestial'
import { makeScenery } from './landscape'
import { createStars } from './stars'

// This runs every update cycle, getting the progress, calculating
// the right colours and applying them to the root element
export const updateAnim = async () => {
  // The solar system
  console.time('Draw celestials')
  createCelestials()
  console.timeEnd('Draw celestials')

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
  document.documentElement.dataset.state = lastState.name
  const nextState = variables.config.states[nextIndex]

  // Calculate the difference between the 'at' values of the previous and last states,
  // so we can get our progress between them based on the progress we got above.
  const diff = nextState.time - lastState.time
  const progressCurr = (progress - lastState.time) / diff

  // Loop through all the colours. 'key' is the cutsom property name
  console.time('Colors handler')
  const colors = []
  Object.keys(lastState.colors_palette).forEach((key) => {
    // We use hex codes for colours for convenience, but it's a lot easier to transition
    // seperate Red, Green, Blue values so we convert them to a [R, G, B] array
    const lastRGB = hexToRgb(lastState.colors_palette[key])
    const nextRGB = hexToRgb(nextState.colors_palette[key])

    // Get the new RGB by using 'lerping' to find the value between the last and next
    // colours based on how far we are through the current animation.
    // The lerp function doesn't necessarily return an int so we round it.
    const currRGB = [Math.round(lerp(lastRGB[0], nextRGB[0], progressCurr)), Math.round(lerp(lastRGB[1], nextRGB[1], progressCurr)), Math.round(lerp(lastRGB[2], nextRGB[2], progressCurr))]
    // Apply the custom property to root using the name and our new RGB value.
    applyColour(key, currRGB)

    // Création d'un array de couleurs
    colors.push(currRGB)
  })
  console.timeEnd('Colors handler')

  // Draw stars
  if (variables.displayConfig.display_stars) {
    const starStates = ['nauticalDusk', 'night', 'nadir']
    if (starStates.includes(lastState.name)) {
      console.time('Draw stars')
      createStars()
      console.timeEnd('Draw stars')
    }
  }

  // Draw landscape
  if (variables.displayConfig.display_landscape) {
    console.time('Draw landscape')
    makeScenery(colors)
    console.timeEnd('Draw landscape')
  }
}
