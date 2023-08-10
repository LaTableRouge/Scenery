import { variables } from '../../common/variables'

export const drawHorizon = (context, layerWidth, layerHeight) => {
  const horizonY = layerHeight - variables.config.horizon()
  context.beginPath()
  context.moveTo(0, horizonY)
  context.lineTo(layerWidth, horizonY)
  context.strokeStyle = 'gray'
  context.stroke()
}
