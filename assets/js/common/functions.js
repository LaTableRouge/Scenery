import { variables } from './variables'

export const addZeroToNumber = (number) => {
  return `0${number}`.slice(-2)
}

// A slightly bewildering regular expression that turns a hex code into [R, G. B] array.
// Well-tested though so I don't need to touch it!
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null
}

// Using 'linear interpolation' gets the value between the start and end values based on progress
export const lerp = (start, end, progress) => {
  return (1 - progress) * start + progress * end
}

// Uses name of custom property 'key' and [R, G, B] array and applies to root element
export const applyColour = (key, color) => {
  document.documentElement.style.setProperty(`--color-${key}`, `rgb(${color.join(',')})`)
  document.documentElement.style.setProperty(`--color-rgb-${key}`, color.join(','))
}

// Round number to 'places' number of figures after decimal.
export const round = (num, places) => {
  const power = Math.pow(10, places)
  return Math.round(num * power) / power
}

// As we have two different animation 'modes', we change the function used to work
// out the progress depending on that mode. See the config above for how they work.
export const getProgress = () => {
  const d = variables.config.date()
  if (document.documentElement.dataset.theme_hours !== undefined) {
    d.setHours(Number(document.documentElement.dataset.theme_hours), Number(document.documentElement.dataset.theme_minutes), 0)
  }
  const progress = variables.config.anims[variables.animMode].getProgress(d)

  return progress
}

export const getDeviceType = () => {
  const ua = navigator.userAgent
  if (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1) {
    return 'tablet'
  }
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet'
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile'
  }
  return 'desktop'
}

export const minWidth = (value) => {
  return window.matchMedia(`(min-width: ${variables.breakpoints[value]})`).matches
}

export const delay = (n) => {
  n = n || 2000

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, n)
  })
}

export const getImg = (url) => {
  const img = new Image()
  img.crossOrigin = '*'
  img.src = url

  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
  })
}
