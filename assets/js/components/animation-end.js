import { variables } from '../common/variables'

// If we need to end the animation, this function will stop it
// running again using clearInterval
export const endAnim = () => {
  clearInterval(variables.animation)
}
