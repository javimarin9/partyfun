import Button from "./button";

const SummaryScreen = ({
	correctWords,
	incorrectWords,
	onContinueToPause,
	remainingWords,
}) => {
	return (
		<div className="pause-screen">
			<h2>Resumen del turno</h2>

			{correctWords.length > 0 && (
				<div className="summary-words">
					{correctWords.map((word, index) => (
						<span className="correct-word" key={index}>
							{word}
						</span>
					))}
				</div>
			)}

			{incorrectWords.length > 0 && (
				<div className="summary-words">
					{incorrectWords.map((word, index) => (
						<span className="incorrect-word" key={index}>
							{word}
						</span>
					))}
				</div>
			)}

			<p>{`Quedan ${remainingWords.length} palabras`}</p>

			<Button onClick={onContinueToPause}>Continuar</Button>
		</div>
	);
};

export default SummaryScreen;
