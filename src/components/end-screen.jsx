import Button from "./button";

const EndScreen = ({ score }) => {
	const team1Score = score[0];
	const team2Score = score[1];

	// Determinar el color de cada equipo (verde para el ganador, rojo para el perdedor)
	const team1Class = team1Score > team2Score ? "winner" : "loser";
	const team2Class = team2Score > team1Score ? "winner" : "loser";

	return (
		<div className="end-screen">
			<h2>¡Juego Terminado!</h2>
			<div className="winner-loser">
				<span className={team1Class}>Equipo 1: {team1Score} pts</span>
				<span className={team2Class}>Equipo 2: {team2Score} pts</span>
			</div>
			<Button onClick={() => window.location.reload()}>Jugar de Nuevo</Button>
		</div>
	);
};

export default EndScreen;
