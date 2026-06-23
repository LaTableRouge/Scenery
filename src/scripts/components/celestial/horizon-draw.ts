import { getHorizonY } from '../../common/sky-projection'
import { variables } from '../../common/variables'

export const drawHorizon = (context: CanvasRenderingContext2D, layerWidth: number, layerHeight: number): void => {
	if (!variables.displayConfig.display_horizon) {
		return
	}

	const horizonY = getHorizonY(layerHeight)
	context.beginPath()
	context.moveTo(0, horizonY)
	context.lineTo(layerWidth, horizonY)
	context.strokeStyle = 'gray'
	context.stroke()
}
