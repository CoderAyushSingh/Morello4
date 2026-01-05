
const API_KEY = '09c337f143b22c7f2a83ab8e1f6ab8d3';
const BASE_URL = 'https://api.themoviedb.org/3/search/tv';

const seriesList = [
    "Dexter: Resurrection",
    "Monsters", // Trying 'Monsters' for the Ryan Murphy series
    "Monster: The Jeffrey Dahmer Story"
];

async function findSeries() {
    for (const title of seriesList) {
        try {
            const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(title)}&include_adult=false`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                data.results.forEach(m => {
                    console.log(`${title}: ${m.id} (${m.name}, ${m.first_air_date})`);
                });
            } else {
                console.log(`${title}: NOT FOUND`);
            }
        } catch (error) {
            console.error(`Error searching for ${title}:`, error.message);
        }
    }
}

findSeries();
