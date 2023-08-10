import baseConfig from './config'

export const variables = {}
variables.config = baseConfig()
variables.mouseX = 0
variables.mouseY = 0
variables.facingAzimuth = 0.0
variables.displayConfig = {
  display_time: 'now',
  display_names: false,
  display_stars: true,
  display_landscape: true,
  display_below_horizon: false,
  display_horizon: true,
  display_sun: true,
  display_neptune: true,
  display_uranus: true,
  display_saturn: true,
  display_jupiter: true,
  display_mars: true,
  display_moon: true,
  display_venus: true,
  display_mercury: true
}

// for the set interval to play animation
variables.animation = false

// This changes the interval and progress calculation between
// our dynamic animations 'live' and 'cycle'.
variables.animMode = 'live'

// TODO : gérer l'horizon pour les planètes
