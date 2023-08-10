import { delay, getDeviceType } from '../common/functions'
import { variables } from '../common/variables'
import layer1 from './landscape/layer1'
import layer2 from './landscape/layer2'
import layer3 from './landscape/layer3'
import layer4 from './landscape/layer4'
import layer5 from './landscape/layer5'
import layer6 from './landscape/layer6'
import layer7 from './landscape/layer7'
import layer8 from './landscape/layer8'
import layer9 from './landscape/layer9'
import layer10 from './landscape/layer10'

const configScenery = (colors) => {
  const sceneryObject = {}

  sceneryObject.layer1 = layer1([`rgb(${colors[1]})`])
  sceneryObject.layer2 = layer2([`rgb(${colors[2]})`])
  sceneryObject.layer3 = layer3([`rgb(${colors[3]})`])
  sceneryObject.layer4 = layer4([`rgb(${colors[4]})`])
  sceneryObject.layer5 = layer5([`rgb(${colors[5]})`, `rgb(${colors[11]})`, `rgb(${colors[12]})`, `rgb(${colors[13]})`, `rgb(${colors[14]})`])
  sceneryObject.layer6 = layer6([`rgb(${colors[6]})`, `rgb(${colors[15]})`, `rgb(${colors[16]})`, `rgb(${colors[19]})`, `rgb(${colors[20]})`, `rgb(${colors[21]})`, `rgb(${colors[22]})`])
  sceneryObject.layer7 = layer7([`rgb(${colors[7]})`, `rgb(${colors[17]})`, `rgb(${colors[18]})`])
  sceneryObject.layer8 = layer8([`rgb(${colors[8]})`])
  sceneryObject.layer9 = layer9([`rgb(${colors[9]})`])
  sceneryObject.layer10 = layer10([`rgb(${colors[10]})`])

  const layers = {}

  for (const property in sceneryObject) {
    const layer = sceneryObject[property]

    layers[property] = {}

    const img = new Image()
    img.onload = () => {
      layers[property].img = img
    }
    const dataURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(layer.svg)
    img.src = dataURL
  }
  return {
    sceneryObject: sceneryObject,
    layers: layers
  }
}

const initScenery = (canvas, context, sceneryObject, layers) => {
  const drawnLayers = []

  // Récupération des infos de la page
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const heightRatio = Math.round(windowHeight / windowWidth)

  // Set des dimensions du canvas
  canvas.width = windowWidth
  canvas.style.width = `${windowWidth}px`
  canvas.height = windowHeight
  canvas.style.height = `${windowHeight}px`

  // Draw des layers
  context.clearRect(0, 0, windowWidth, windowHeight)
  for (const property in sceneryObject) {
    // récupère les infos du layer
    const layer = sceneryObject[property]
    const length = Object.keys(sceneryObject).length + 1

    // Setup des dimensions des layers
    let layerWidth = windowHeight * 2
    let layerHeight = windowHeight
    if (layerWidth > 2000) {
      layerWidth = 2000
      layerHeight = 1000
    }
    if (heightRatio >= 1) {
      layerWidth = windowWidth
      layerHeight = windowWidth / 2
    }

    // création d'un canvas tampon
    const layerCanvas = document.createElement('canvas')
    layerCanvas.width = windowWidth
    layerCanvas.height = windowHeight
    const layerContext = layerCanvas.getContext('2d')

    // Draw la scène dans le canvas tampon
    layerContext.drawImage(layers[property].img, 0, windowHeight - layerHeight, layerWidth, layerHeight)

    // Patternise les layers dans le canvas tampon
    while (layerWidth < windowWidth) {
      layerContext.drawImage(layerCanvas, layerWidth, 0)
      layerWidth <<= 1
    }

    // Draw du canvas tampon dans le canvas maitre
    const layerXPosition = variables.mouseX / (100 * (length - layer.layerNumber))
    const layerYPosition = variables.mouseY / (100 * (length - layer.layerNumber))
    context.drawImage(layerCanvas, layerXPosition, layerYPosition)

    // Sauvegarde le canvas tampon pour la parralaxe
    drawnLayers.push({
      layerNumber: layer.layerNumber,
      layer: layerCanvas
    })
  }

  return drawnLayers
}

const parralaxScenery = (canvas, context, drawnLayers) => {
  // Remove du listener
  window.onmousemove = null

  // Ajout du listener
  if (getDeviceType() === 'desktop') {
    const parralaxFunction = (e) => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      drawnLayers.forEach((element) => {
        // récupère les infos du layer
        const length = drawnLayers.length + 1
        const layerXPositionOffset = e.clientX / (100 * (length - element.layerNumber))
        const layerYPositionOffset = e.clientY / (100 * (length - element.layerNumber))

        // Redraw la scène
        context.drawImage(element.layer, layerXPositionOffset, layerYPositionOffset)
      })
    }
    window.onmousemove = parralaxFunction
  }
}

export const makeScenery = async (colors) => {
  // récupération du canvas
  const canvas = document.getElementById('scenery__layers')
  if (canvas) {
    const context = canvas.getContext('2d')

    // Configuration des différents layers de la scène
    const scenery = configScenery(colors)
    const sceneryObject = scenery.sceneryObject
    const layers = scenery.layers

    await delay(100)

    // Init de la scène
    const drawnLayers = initScenery(canvas, context, sceneryObject, layers)

    // Parralax de la scène
    parralaxScenery(canvas, context, drawnLayers)
  }
}
