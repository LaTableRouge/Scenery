import { Equator, Horizon, Illumination, RotateVector, Rotation_EQD_HOR } from 'astronomy-engine'

import { getImg } from '../../common/functions'
import { variables } from '../../common/variables'

const Camera = (observer, time, bodyName) => {
  const RAD2DEG = 57.295779513082321

  // Calculate the topocentric equatorial coordinates of date for the Moon.
  // Assume aberration does not matter because the Moon is so close and has such a small relative velocity.
  const moonEQU = Equator(bodyName, time, observer, true, false)

  // Calculate the phase angle and magnitude of the Moon.
  const illum = Illumination(bodyName, time)
  const phaseAngle = illum.phase_angle
  const mag = illum.mag

  // Calculate the tilt angle of the sunlit side, as seen by the camera.
  // The x-axis is now pointing directly at the object, z is up in the camera image, y is to the left.
  const vec = RotateVector(Rotation_EQD_HOR(time, observer), moonEQU.vec)
  const tilt = RAD2DEG * Math.atan2(vec.y, vec.z)

  // Return the phase angle and tilt angle of the Moon.
  return {
    phaseAngle: phaseAngle,
    tiltAngle: tilt,
    magnitude: mag
  }
}

export const celestialDraw = async (context, layerWidth, layerHeight, observer, config) => {
  const date = variables.config.date()
  if (document.documentElement.dataset.theme_hours !== undefined) {
    date.setHours(Number(document.documentElement.dataset.theme_hours), Number(document.documentElement.dataset.theme_minutes), 0)
  }

  const EQUOfDate = Equator(config.name, date, observer, true, true)
  const hor = Horizon(date, observer, EQUOfDate.ra, EQUOfDate.dec, 'normal')
  const altitude = hor.altitude

  // Don't draw if it's below the horizon
  if (altitude > 0 || variables.displayConfig.display_below_horizon) {
    let azimuth = hor.azimuth
    // add the facing azimuth for the sun to rise in the right and set on the left
    azimuth = azimuth + (270.0 - variables.facingAzimuth)

    const horizonY = layerHeight - variables.config.horizon()

    // Convert the azimuth and altitude to x and y coordinates on the canvas
    const x = layerWidth / 2 + ((Math.cos((azimuth * Math.PI) / 180) * layerHeight) / 2) * Math.cos((altitude * Math.PI) / 180)
    const y = horizonY - (Math.sin((altitude * Math.PI) / 180) * layerHeight) / 2

    // Fetch the point of view from observer
    const cameraDatas = Camera(observer, date, config.name)

    // Angles for bodies that have phases
    let phaseAngle = (cameraDatas.phaseAngle % 360) / 360
    phaseAngle = (phaseAngle + 0.5) % 1

    let phase = 0
    if (phaseAngle <= 0.5) {
      phase = 4 * phaseAngle - 1
    } else {
      phase = 4 * (1 - phaseAngle) - 1
    }

    // Create a new canvas for the bodies (to prevent artifacts)
    const bodyCanvas = document.createElement('canvas')
    bodyCanvas.width = config.size * 2
    bodyCanvas.height = config.size * 2
    const bodyContext = bodyCanvas.getContext('2d')

    await getImg(`./assets/img/planets/${config.name.toLowerCase()}.png`)
      .then((img) => {
        const imgWidth = img.width
        const imgHeight = img.height
        const canvasWidth = bodyCanvas.width
        const canvasHeight = bodyCanvas.height

        // Calculate the aspect ratio of the image and canvas
        const aspectRatioImg = imgWidth / imgHeight
        const aspectRatioCanvas = canvasWidth / canvasHeight

        let scale = 1
        if (aspectRatioImg > aspectRatioCanvas) {
          // If the image aspect ratio is wider than the canvas aspect ratio
          // then scale the image width to the canvas width
          scale = canvasWidth / imgWidth
        } else {
          // If the image aspect ratio is taller than the canvas aspect ratio
          // then scale the image height to the canvas height
          scale = canvasHeight / imgHeight
        }

        // Calculate the new image dimensions with the chosen scaling factor
        const newImgWidth = imgWidth * scale
        const newImgHeight = imgHeight * scale

        if (config.phases) {
          // draw the whole moon
          bodyContext.beginPath()
          bodyContext.arc(config.size, config.size, config.size, 0, 2 * Math.PI, true)
          bodyContext.closePath()
          bodyContext.fillStyle = 'rgba(0,0,0,0)'
          bodyContext.fill()

          bodyContext.drawImage(img, 0, 0, newImgWidth, newImgHeight)

          // draw half of the moon
          bodyContext.beginPath()
          bodyContext.arc(config.size, config.size, config.size, -Math.PI / 2, Math.PI / 2, true)
          bodyContext.closePath()
          bodyContext.fillStyle = config.shadowColor
          bodyContext.fill()

          // draw the part that will make the crescent
          bodyContext.translate(config.size, config.size)
          bodyContext.scale(phase, 1)
          bodyContext.translate(-config.size, -config.size)
          bodyContext.beginPath()
          bodyContext.arc(config.size, config.size, config.size, -Math.PI / 2, Math.PI / 2, true)
          bodyContext.closePath()
          bodyContext.fillStyle = phase > 0 ? 'rgba(0,0,0,0)' : config.shadowColor
          bodyContext.fill()
          if (phaseAngle > 0.25 && phaseAngle < 0.75) {
            bodyContext.drawImage(img, 0, 0, newImgWidth, newImgHeight)
          }

          // TODO : voir pourquoi le tiltangle n'est pas accurate

          // Draw the body canvas into the main canvas
          context.translate(x, y)
          context.rotate(cameraDatas.tiltAngle)
          context.translate(-x, -y)
          context.drawImage(bodyCanvas, x - config.size, y - config.size)

          // Restore the canvas state to the original orientation
          context.restore()

          // Rotate the canvas back to the original orientation
          context.translate(x, y)
          context.rotate(-cameraDatas.tiltAngle)
          context.translate(-x, -y)
        } else {
          // Set shadow blur to better see the bodies on the canvas
          if (config.shadowBlur) {
            context.shadowColor = config.color
            context.shadowBlur = 15
          }

          bodyContext.drawImage(img, 0, 0, newImgWidth, newImgHeight)

          // TODO : voir pourquoi le tiltangle n'est pas accurate

          // Draw the body canvas into the main canvas
          context.translate(x, y)
          context.rotate(cameraDatas.tiltAngle)
          context.translate(-x, -y)
          context.drawImage(bodyCanvas, x - config.size, y - config.size)

          // Restore the canvas state to the original orientation
          context.restore()

          // Rotate the canvas back to the original orientation
          context.translate(x, y)
          context.rotate(-cameraDatas.tiltAngle)
          context.translate(-x, -y)
        }
      })
      .catch(() => {
        context.beginPath()
        context.fillStyle = config.color
        context.arc(x, y, config.size, 0, Math.PI * 2)
        context.fill()
      })

    // reset of the shadow blur for a different one on other bodies
    context.shadowBlur = 0

    // Draw text next to the celestial body
    if (variables.displayConfig.display_names) {
      context.font = '14px Arial'
      context.fillStyle = 'white'
      context.fillText(config.name, x + config.size + 5, y + config.size + 5)
    }
  }
}
