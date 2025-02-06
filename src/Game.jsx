import React, { useState, useEffect, useRef } from "react";
import { fetchWords, fetchConstants } from "./hooks/useGame"; // Hook para cargar las palabras
import GameScreen from "./components/game-screen";
import SummaryScreen from "./components/summary-screen";
import PauseScreen from "./components/pause-screen";
import EndScreen from "./components/end-screen";
import PhaseScreen from "./components/phase-screen";
import TeamSelectionScreen from "./components/team-selection-screen";
import ThemeSelectionScreen from "./components/theme-selection-screen";
import CoverScreen from "./components/cover-screen";
import shuffleArray from "./utils/shuffleArray";
import "./Game.css";

function Game() {
	const [wordsDB, setWordsDB] = useState({});
	const [themesDB, setThemesDB] = useState([]);
	const [loading, setLoading] = useState(false);
	const [constantsDB, setConstantsDB] = useState({});

	const [gameState, setGameState] = useState("start");

	const [playerNames, setPlayerNames] = useState([
		["Jugador 1"],
		["Jugador 2"],
	]); // Equipos con sus jugadores
	const [currentTeam, setCurrentTeam] = useState(0);
	const [currentTeamTurn, setCurrentTeamTurn] = useState(
		Array(playerNames.length).fill(0)
	);
	const [correctWords, setCorrectWords] = useState([]); // Palabras correctas
	const [incorrectWords, setIncorrectWords] = useState([]); // Palabras incorrectas
	const [score, setScore] = useState([0, 0]); // Puntuación de ambos equipos
	const [allWords, setAllWords] = useState([]); // Todas las palabras aleatorias
	const [remainingWords, setRemainingWords] = useState([]); // Palabras restantes
	const [currentWord, setCurrentWord] = useState(""); // Palabra actual
	const [timeRemaining, setTimeRemaining] = useState(40); // Tiempo restante
	const [wordIndex, setWordIndex] = useState(0); // Índice de la palabra actual
	const [showSummaryPhase, setShowSummaryPhase] = useState(false); // Para controlar la fase de resumen
	const [isPaused, setIsPaused] = useState(false); // Fase pausada
	const [currentPhase, setCurrentPhase] = useState(1); // Fase actual
	const [gameOver, setGameOver] = useState(false); // Estado de fin de juego
	const timerRef = useRef(null);

	const startGame = () => {
		setGameState("teamSelection");
	};

	const selectTeams = (team1Players, team2Players) => {
		setPlayerNames([team1Players, team2Players]);
		setGameState("themeSelection");
	};

	const selectTheme = (theme) => {
		let selectedWords = [];

		if (theme === "random") {
			const allWords = Object.values(wordsDB).flat();
			selectedWords = shuffleArray(allWords).slice(0, constantsDB.totalWords);
		} else {
			selectedWords = shuffleArray(wordsDB[theme]).slice(
				0,
				constantsDB.totalWords
			);
		}

		setAllWords(selectedWords);
		setRemainingWords(selectedWords);
		setCurrentWord(selectedWords[0]);
		setGameState("game");
	};

	const handleCorrectWord = () => {
		// Si la palabra está en incorrectWords, la quitamos de ahí
		if (incorrectWords.includes(currentWord)) {
			setIncorrectWords((prevIncorrectWords) =>
				prevIncorrectWords.filter((word) => word !== currentWord)
			);
		}

		// Verificar si la palabra no está ya en correctWords antes de agregarla
		if (!correctWords.includes(currentWord)) {
			setCorrectWords((prevCorrectWords) => [...prevCorrectWords, currentWord]);
		}
	};

	const handleIncorrectWord = () => {
		// Verificar si la palabra no está ya en incorrectWords antes de agregarla
		if (!incorrectWords.includes(currentWord)) {
			setIncorrectWords((prevIncorrectWords) => [
				...prevIncorrectWords,
				currentWord,
			]);
		}
	};

	const handleWordGuess = (isCorrect) => {
		if (isCorrect) {
			// Actualizar la puntuación y las palabras restantes de manera correcta
			setScore((prevScore) => {
				const newScore = [...prevScore];
				newScore[currentTeam]++;
				return newScore;
			});

			handleCorrectWord();

			setRemainingWords((prevWords) => {
				// Si la palabra fue correcta, la eliminamos de las palabras restantes
				let updatedWords = [...prevWords];
				if (isCorrect) {
					updatedWords = updatedWords.filter((word) => word !== currentWord);
				}

				if (updatedWords.length === 0) {
					// Si ya no hay palabras, pausamos la fase y cambiamos a la siguiente
					if (currentPhase < constantsDB.totalPhases) {
						setShowSummaryPhase(true);
						setIsPaused(true); // Cambio de fase
					} else {
						setGameOver(true); // Terminar el juego si no hay más fases
					}
				}

				// Pasar a la siguiente palabra
				setWordIndex((prevIndex) => {
					const nextIndex = (prevIndex + 1) % updatedWords.length;
					setCurrentWord(updatedWords[nextIndex]);
					return nextIndex;
				});

				return updatedWords;
			});
		} else {
			// Penalización de tiempo si la palabra no fue correcta
			handleIncorrectWord();
			// Pasar a la siguiente palabra
			setWordIndex((prevIndex) => {
				const nextIndex = (prevIndex + 1) % remainingWords.length;
				setCurrentWord(remainingWords[nextIndex]);
				return nextIndex;
			});
			setTimeRemaining((prevTime) =>
				Math.max(prevTime - constantsDB.timePenalty, 0)
			);
		}
	};

	const handleNextPhase = () => {
		setIsPaused(false);
		setCurrentPhase((prevPhase) => prevPhase + 1);

		// Seleccionamos un nuevo orden de palabras para la siguiente fase
		const shuffledWords = shuffleArray(allWords).slice(
			0,
			constantsDB.totalWords
		);
		setRemainingWords(shuffledWords);

		// Set the current word after updating remaining words
		setCurrentWord(shuffledWords[0]);
		setWordIndex(0);
		setTimeRemaining(constantsDB.timePerTurn);
	};

	const handleNextTurn = () => {
		const currentTeamAux = currentTeam;

		setCurrentTeam((prevTeam) => {
			const totalTeams = playerNames.length;
			const newCurrentTeam = (prevTeam + 1) % totalTeams;

			return newCurrentTeam;
		});

		setCurrentTeamTurn((prevPlayers) => {
			const updatedPlayers = [...prevPlayers];

			// Avanzamos el jugador SOLO del equipo que acaba de jugar (currentTeamAux)
			updatedPlayers[currentTeamAux] =
				(updatedPlayers[currentTeamAux] + 1) %
				playerNames[currentTeamAux].length;

			return updatedPlayers;
		});
		// Reordenar aleatoriamente las palabras restantes para el nuevo turno
		setRemainingWords((prevWords) => {
			const shuffledWords = shuffleArray(prevWords); // Barajamos las palabras restantes
			setWordIndex(0);
			setCurrentWord(shuffledWords[0]); // Establecemos la primera palabra como la actual
			return shuffledWords;
		});
		setTimeRemaining(constantsDB.timePerTurn); // Reiniciar el tiempo para el siguiente turno

		// Reiniciar las palabras correctas e incorrectas al comenzar un nuevo turno
		setCorrectWords([]);
		setIncorrectWords([]);
	};

	//Cargar palabras
	useEffect(() => {
		fetchWords(setWordsDB, setThemesDB, setLoading); // Hook para cargar palabras
		fetchConstants(setConstantsDB, setLoading);
	}, []);

	// Actualizamos timeRemaining cuando los datos de fetchConstants se hayan cargado
	useEffect(() => {
		if (constantsDB.timePerTurn) {
			setTimeRemaining(constantsDB.timePerTurn); // Asignamos el valor a timeRemaining
		}
	}, [constantsDB]);

	useEffect(() => {
		if (gameState === "game" && !gameOver && !isPaused) {
			timerRef.current = setInterval(() => {
				setTimeRemaining((prevTimeRemaining) => {
					if (prevTimeRemaining > 0) {
						return prevTimeRemaining - 1;
					} else {
						clearInterval(timerRef.current);
						handleIncorrectWord();
						setShowSummaryPhase(true);
						setIsPaused(true);
						return 0;
					}
				});
			}, 1000);
		}

		return () => {
			clearInterval(timerRef.current);
		};
	}, [gameState, timeRemaining, gameOver, isPaused, showSummaryPhase]);

	return (
		<div className="game-container">
			{gameState === "start" && (
				<CoverScreen
					title="¡Bienvenidos a PartyFun!"
					description="Adivina las palabras antes de que se acabe el tiempo."
					onStartGame={startGame}
				/>
			)}

			{gameState === "teamSelection" && (
				<TeamSelectionScreen onSelectTeams={selectTeams} />
			)}

			{gameState === "themeSelection" && (
				<ThemeSelectionScreen onSelectTheme={selectTheme} themesDB={themesDB} />
			)}

			{gameState === "game" && !gameOver && !isPaused && (
				<GameScreen
					currentTeam={currentTeam}
					currentTeamTurn={currentTeamTurn}
					word={currentWord}
					timeRemaining={timeRemaining}
					onGuess={handleWordGuess}
					currentPhase={currentPhase}
					playerNames={playerNames}
					remainingWords={remainingWords} // El siguiente equipo
				/>
			)}

			{showSummaryPhase && (
				<SummaryScreen
					remainingWords={remainingWords} // El siguiente equipo
					correctWords={correctWords}
					incorrectWords={incorrectWords}
					onContinueToPause={() => {
						setShowSummaryPhase(false);
						handleNextTurn(); // Cambiar al siguiente turno
					}}
				/>
			)}

			{isPaused && !showSummaryPhase && remainingWords.length > 0 && (
				<PauseScreen
					remainingWords={remainingWords} // El siguiente equipo
					currentTeamTurn={currentTeamTurn}
					playerNames={playerNames}
					currentTeam={currentTeam}
					onContinue={() => {
						setIsPaused(false); // Continuar con el siguiente turno
					}}
				/>
			)}

			{isPaused && !showSummaryPhase && remainingWords.length === 0 && (
				<PhaseScreen
					onContinue={() => {
						if (currentPhase < constantsDB.totalPhases) {
							handleNextPhase(); // Continuar con la siguiente fase
						}
					}}
					currentTeamTurn={currentTeamTurn}
					playerNames={playerNames}
					currentTeam={currentTeam}
				/>
			)}

			{gameOver && <EndScreen score={score} />}
		</div>
	);
}

export default Game;
