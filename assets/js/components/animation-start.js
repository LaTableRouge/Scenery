import { variables } from '../common/variables'
import { updateAnim } from './animation-update'

// Declaring our animation loop in a variable allows us to end it when needed.
export const startAnim = () => {
  // Run our update loop immediately after starting.
  updateAnim()

  // setInterval runs our update loop with a predetermined interval
  // based on the animation mode we are using.
  variables.animation = setInterval(updateAnim, variables.config.anims[variables.animMode].interval)
}
