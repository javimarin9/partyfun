import Button from "./button";

const ThemeSelectionScreen = ({ onSelectTheme, themesDB }) => (
	<div className="theme-selection">
		<h2>Selecciona una temática</h2>
		{themesDB.map((theme) => (
			<Button key={theme} onClick={() => onSelectTheme(theme)}>
				{theme.replace(/_/g, " ").replace(/^./, (char) => char.toUpperCase())}{" "}
			</Button>
		))}
		<Button onClick={() => onSelectTheme("random")}>Mezcladas</Button>
	</div>
);

export default ThemeSelectionScreen;
