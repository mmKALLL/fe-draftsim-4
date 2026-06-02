/* Compose the review canvas */
function App() {
  return (
    <DesignCanvas>
      <DCSection id="menu" title="Main Menu & Setup" subtitle="Tone-setter + draft configuration">
        <DCArtboard id="menu" label="Main Menu" width={390} height={844}><MainMenu /></DCArtboard>
        <DCArtboard id="setup" label="Game Setup" width={390} height={844}><GameSetup /></DCArtboard>
      </DCSection>

      <DCSection id="draft" title="Draft Phase — core loop" subtitle="Power-curve status overview + pack-of-cards picking">
        <DCArtboard id="draft" label="Draft Phase" width={390} height={844}><DraftScreen /></DCArtboard>
      </DCSection>

      <DCSection id="score" title="Standings" subtitle="Three toggle views: Scores · Team Power · Rosters">
        <DCArtboard id="scores" label="Scores (placement + bonus)" width={390} height={844}><ScoreScreen view="scores" /></DCArtboard>
        <DCArtboard id="power" label="Team Power by phase" width={390} height={844}><ScoreScreen view="power" /></DCArtboard>
        <DCArtboard id="rosters" label="Rosters" width={390} height={844}><ScoreScreen view="rosters" /></DCArtboard>
      </DCSection>

      <DCSection id="end" title="Game End" subtitle="Final results & podium">
        <DCArtboard id="end" label="Game End" width={390} height={844}><GameEnd /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
