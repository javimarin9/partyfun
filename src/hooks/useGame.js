// Este hook se encarga de cargar las palabras y gestionarlas
export const fetchWords = async (setWordsDB, setThemesDB, setLoading) => {
	setLoading(true);
	try {
		const response = await fetch(
			"https://raw.githubusercontent.com/javimarin9/words-partyfun/refs/heads/main/words.json"
		);
		const data = await response.json();
		const allThemes = Object.keys(data);
		setWordsDB(data);
		setThemesDB(allThemes);
	} catch (error) {
		console.error("Error al cargar el archivo JSON:", error);
	} finally {
		setLoading(false);
	}
};

// Este hook se encarga de cargar las constantes
export const fetchConstants = async (setConstantsDB, setLoading) => {
	setLoading(true);
	try {
		const response = await fetch(
			"https://raw.githubusercontent.com/javimarin9/words-partyfun/refs/heads/main/constants.json"
		);
		const data = await response.json();
		setConstantsDB(data);
	} catch (error) {
		console.error("Error al cargar el archivo JSON:", error);
	} finally {
		setLoading(false);
	}
};
