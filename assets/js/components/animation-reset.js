import { updateAnim } from './animation-update'

export const resetAnim = async () => {
  const canvas = document.querySelectorAll('canvas')
  if (canvas.length) {
    canvas.forEach((canva) => {
      // clear canvas
      const context = canva.getContext('2d')
      context.clearRect(0, 0, canva.width, canva.height)
    })
  }

  // Remove du listener
  window.onmousemove = null

  updateAnim()
}
