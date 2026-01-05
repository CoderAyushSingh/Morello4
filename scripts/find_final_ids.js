
const API_KEY = '09c337f143b22c7f2a83ab8e1f6ab8d3';
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

const movies = [
    "Naagzilla", // Correct spelling
    "King"
];

async function findMovies() {
    console.log("Searching for Final Missing Movies...");
    for (const movie of movies) {
        try {
            const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(movie)}&include_adult=false`;
            const response = await fetch(url);
            const data = await response.json();

            // Log all 2025/2026 candidates
            if (data.results && data.results.length > 0) {
                data.results.forEach(m => {
                    if (m.release_date && (m.release_date.includes('2025') || m.release_date.includes('2026'))) {
                        console.log(`CANDIDATE for ${movie}: ${m.id} (${m.title}, ${m.release_date})`);
                    }
                });
            } else {
                console.log(`${movie}: NOT FOUND`);
            }
        } catch (error) {
            console.error(`Error searching for ${movie}:`, error.message);
        }
    }
}

findMovies();
