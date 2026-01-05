
const API_KEY = '09c337f143b22c7f2a83ab8e1f6ab8d3';
const BASE_URL = 'https://api.themoviedb.org/3/search/tv';

const seriesList = [
    "The White Lotus",
    "The Last of Us",
    "Severance",
    "Wednesday",
    "Squid Game",
    "Dexter: Resurrection",
    "Monster",
    "Dept. Q",
    "Andor",
    "Black Mirror"
];

async function findSeries() {
    console.log("Searching for series...");
    for (const title of seriesList) {
        try {
            const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(title)}&include_adult=false`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                // Just take the first result or try to be smart about it
                const match = data.results[0];
                console.log(`${title}: ${match.id} (${match.name}, ${match.first_air_date})`);
            } else {
                console.log(`${title}: NOT FOUND`);
            }
        } catch (error) {
            console.error(`Error searching for ${title}:`, error.message);
        }
    }
}

findSeries();
