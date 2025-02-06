import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react"; // Importamos los iconos
import Button from "./button";

const TeamSelectionScreen = ({ onSelectTeams }) => {
	const [team1Players, setTeam1Players] = useState(["Jugador 1"]);
	const [team2Players, setTeam2Players] = useState(["Jugador 1"]);

	const handleAddPlayer = (setTeamPlayers) => {
		setTeamPlayers((prevPlayers) => [
			...prevPlayers,
			`Jugador ${prevPlayers.length + 1}`,
		]);
	};

	const handleRemovePlayer = (setTeamPlayers, index) => {
		setTeamPlayers((prevPlayers) => prevPlayers.filter((_, i) => i !== index));
	};

	const handleStartGame = () => {
		onSelectTeams(team1Players, team2Players);
	};

	return (
		<div className="team-selection">
			<h2>Selecciona los jugadores</h2>

			{/* Equipo 1 */}
			<div>
				<h3>Jugadores del Equipo 1</h3>
				{team1Players.map((player, index) => (
					<div key={index} className="player-row">
						<input
							type="text"
							value={player}
							onChange={(e) =>
								setTeam1Players((prev) =>
									prev.map((p, i) => (i === index ? e.target.value : p))
								)
							}
						/>
						<button
							onClick={() => handleRemovePlayer(setTeam1Players, index)}
							className="icon-btn"
						>
							<Trash2 size={20} />
						</button>
					</div>
				))}
				<button
					onClick={() => handleAddPlayer(setTeam1Players)}
					className="icon-btn"
				>
					<PlusCircle size={22} />
				</button>
			</div>

			{/* Equipo 2 */}
			<div>
				<h3>Jugadores del Equipo 2</h3>
				{team2Players.map((player, index) => (
					<div key={index} className="player-row">
						<input
							type="text"
							value={player}
							onChange={(e) =>
								setTeam2Players((prev) =>
									prev.map((p, i) => (i === index ? e.target.value : p))
								)
							}
						/>
						<button
							onClick={() => handleRemovePlayer(setTeam2Players, index)}
							className="icon-btn"
						>
							<Trash2 size={20} />
						</button>
					</div>
				))}
				<button
					onClick={() => handleAddPlayer(setTeam2Players)}
					className="icon-btn"
				>
					<PlusCircle size={22} />
				</button>
			</div>

			{/* Botón para iniciar el juego */}
			<Button onClick={handleStartGame}>Iniciar Juego</Button>
		</div>
	);
};

export default TeamSelectionScreen;
