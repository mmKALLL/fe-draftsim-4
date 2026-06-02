import './styles.css'
import { CHARACTER_ROSTER } from './data/characters'
import { logCharacterTotalMismatches } from './data/validation'

logCharacterTotalMismatches(CHARACTER_ROSTER)

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Missing #app root')
}

const root = document.createElement('main')
root.className = 'app-root'
root.dataset.app = 'fe-draftsim'
root.setAttribute('aria-label', 'FE11 Draft Sim')

app.replaceChildren(root)
