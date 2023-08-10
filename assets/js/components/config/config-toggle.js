export const toggleConfig = () => {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  if (!urlParams.get('no-controls')) {
    const button = document.querySelector('.js-config-toggle')
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault()
        const parent = button.closest('[data-open]')
        if (parent) {
          const boolValue = String(parent.dataset.open) === 'true'

          parent.dataset.open = !boolValue
        }
      })
    }
  }
}
