import Button from "./button";

const GameScreen = ({
	word,
	timeRemaining,
	onGuess,
	currentPhase,
	currentTeam,
	currentTeamTurn,
	playerNames,
	remainingWords,
}) => {
	// Asegurar que el índice del jugador no se pase de la cantidad de jugadores
	const currentPlayerPosition = currentTeamTurn[currentTeam];
	const currentPlayerName = playerNames[currentTeam][currentPlayerPosition];

	return (
		<div className="game-screen">
			<h3>{`Fase ${currentPhase} - Turno de ${currentPlayerName}`}</h3>
			<p>{`Quedan ${remainingWords.length} palabras`}</p>
			<h2 className="highlighted-text">{`${word}`}</h2>
			<p>{`Tiempo restante: ${timeRemaining}s`}</p>

			<div className="btn-group">
				<Button
					onClick={() => {
						if (timeRemaining > 0) onGuess(true);
					}}
				>
					Correcto
				</Button>
				<Button
					onClick={() => {
						if (timeRemaining > 0) onGuess(false);
					}}
				>
					Pasar
				</Button>
			</div>
		</div>
	);
};

export default GameScreen;
