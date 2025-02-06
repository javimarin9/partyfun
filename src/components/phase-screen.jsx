import Button from "./button";

const PhaseScreen = ({
	onContinue,
	currentTeamTurn,
	playerNames,
	currentTeam,
}) => {
	const currentPlayerPosition = currentTeamTurn[currentTeam];
	const currentPlayerName = playerNames[currentTeam][currentPlayerPosition];
	return (
		<div className="pause-screen">
			<h2>¡Fase Terminada!</h2>
			<p>{`Hora de adivinar de nuevo todas las palabras`}</p>
			<p>{`Le toca a ${currentPlayerName}`}</p>
			<Button onClick={onContinue}>Continuar</Button>
		</div>
	);
};

export default PhaseScreen;
