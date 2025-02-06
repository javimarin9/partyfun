import Button from "./button";

const PauseScreen = ({
	remainingWords,
	currentTeamTurn,
	onContinue,
	playerNames,
	currentTeam,
}) => {
	const currentPlayerPosition = currentTeamTurn[currentTeam];
	const currentPlayerName = playerNames[currentTeam][currentPlayerPosition];
	return (
		<div className="pause-screen">
			<h2>Siguiente turno</h2>
			<p>{`Le toca a ${currentPlayerName}`}</p>
			<p>{`Quedan ${remainingWords.length} palabras`}</p>
			<Button onClick={onContinue}>Continuar</Button>
		</div>
	);
};

export default PauseScreen;
