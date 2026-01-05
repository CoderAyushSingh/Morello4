
const API_KEY = '09c337f143b22c7f2a83ab8e1f6ab8d3';
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

const movies = [
    "Jurassic World Rebirth",
    "Frankenstein",
    "Happy Gilmore 2",
    "Mission: Impossible - The Final Reckoning"
];

async function findMovies() {
    for (const movie of movies) {
        try {
            const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(movie)}&include_adult=false`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                // Try to find 2025/2026
                const match = data.results.find(m => m.release_date && (m.release_date.includes('2025') || m.release_date.includes('2026'))) || data.results[0];
                console.log(`${movie}: ${match.id}`);
            } else {
                console.log(`${movie}: NOT FOUND`);
            }
        } catch (error) {
            console.error(`Error searching for ${movie}:`, error.message);
        }
    }
}

findMovies();
