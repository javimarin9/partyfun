import Button from "./button";

const CoverScreen = ({ title, description, onStartGame }) => (
	<div className="intro">
		<h2>{title}</h2>
		<p>{description}</p>
		<Button onClick={onStartGame}>Empezar</Button>
	</div>
);

export default CoverScreen;
