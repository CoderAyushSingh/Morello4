
const API_KEY = '09c337f143b22c7f2a83ab8e1f6ab8d3';
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

const movies = [
    "Ikkis",
    "The Raja Saab",
    "Jana Nayagan", // Note: Might be tricky, could be a working title
    "Border 2",
    "Mardaani 3",
    "Pati Patni Aur Woh 2", // Assuming "Pati Patni Aur Woh Do" implies 2
    "The Paradise",
    "Battle of Galwan", // Check exact title
    "Toxic",
    "Nagzilla",
    "Drishyam 3",
    "Ramayana",
    "King",
    "Love and War"
];

async function findMovies() {
    console.log("Searching for Upcoming Indian Movies...");
    for (const movie of movies) {
        try {
            const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(movie)}&include_adult=false`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                // Try to find the one with year 2025/2026 if multiple
                const match = data.results.find(m => m.release_date && (m.release_date.includes('2025') || m.release_date.includes('2026'))) || data.results[0];
                console.log(`${movie}: ${match.id} (${match.title}, ${match.release_date})`);
            } else {
                console.log(`${movie}: NOT FOUND`);
            }
        } catch (error) {
            console.error(`Error searching for ${movie}:`, error.message);
        }
    }
}

findMovies();
