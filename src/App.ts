import { createElement } from 'react'

export const App = () =>
  createElement(
    'main',
    {
      className: 'app-root',
      'data-app': 'fe-draftsim',
      'aria-label': 'Emblem Draft',
    },
    createElement(
      'section',
      {
        className: 'app-placeholder',
      },
      createElement('p', { className: 'app-placeholder__eyebrow' }, 'DESIGN READY'),
      createElement('h1', { className: 'app-placeholder__title' }, 'Emblem Draft'),
      createElement('p', { className: 'app-placeholder__copy' }, 'React is wired in. The next slice can build the menu and setup screens from the handoff.'),
    ),
  )

