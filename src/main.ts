import './styles.css'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { CHARACTER_ROSTER } from './data/characters'
import { logCharacterTotalMismatches } from './data/validation'

logCharacterTotalMismatches(CHARACTER_ROSTER)

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Missing #app root')
}

createRoot(app).render(createElement(App))
