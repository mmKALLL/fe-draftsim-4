import { useState, type ReactNode } from 'react'
import { DEFAULT_DRAFT_STATE, DEFAULT_SETUP_STATE, type AppScreen, type DraftState, type SetupParticipant, type SetupState } from './app-state'
import { createInitialDraftState, draftCharacterForCurrentPlayer } from './draft-utils'
import { DraftScreen } from './screens/DraftScreen'
import { MainMenu } from './screens/MainMenu'
import { NewGameSetup } from './screens/NewGameSetup'
import { PlayerDetailsScreen } from './screens/PlayerDetailsScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import type { CharacterCard } from './types'

export const App = (): ReactNode => {
  const [screen, setScreen] = useState<AppScreen>('menu')
  const [setup, setSetup] = useState<SetupState>(DEFAULT_SETUP_STATE)
  const [draft, setDraft] = useState<DraftState>(DEFAULT_DRAFT_STATE)
  const [selectedResultsPlayerId, setSelectedResultsPlayerId] = useState<SetupParticipant['id']>(DEFAULT_SETUP_STATE.players[0]?.id ?? 'human-1')

  const beginDraft = (): void => {
    setDraft(createInitialDraftState(setup))
    setScreen('draft')
  }

  const pickCharacter = (characterId: CharacterCard['id']): void => {
    setDraft((previous) => draftCharacterForCurrentPlayer(previous, setup, characterId))
  }

  const viewPlayerDetails = (playerId: SetupParticipant['id']): void => {
    setSelectedResultsPlayerId(playerId)
    setScreen('playerDetails')
  }

  if (screen === 'setup') {
    return <NewGameSetup onBack={() => setScreen('menu')} onBeginDraft={beginDraft} setup={setup} setSetup={setSetup} />
  }

  if (screen === 'draft') {
    return <DraftScreen draft={draft} onBack={() => setScreen('setup')} onPick={pickCharacter} onViewResults={() => setScreen('results')} setup={setup} />
  }

  if (screen === 'results') {
    return <ResultsScreen draft={draft} onBack={() => setScreen('draft')} onMainMenu={() => setScreen('menu')} onViewPlayerDetails={viewPlayerDetails} setup={setup} />
  }

  if (screen === 'playerDetails') {
    return <PlayerDetailsScreen draft={draft} onBack={() => setScreen('results')} onMainMenu={() => setScreen('menu')} playerId={selectedResultsPlayerId} setup={setup} />
  }

  return <MainMenu onNewGame={() => setScreen('setup')} />
}
