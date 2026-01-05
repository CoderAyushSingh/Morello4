
const API_KEY = '09c337f143b22c7f2a83ab8e1f6ab8d3';
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

const movies = [
    "Pati Patni Aur Woh", // General search to see if sequel pops up
    "Pati Patni Aur Woh 2",
    "Nagzilla",
    "King" // Need to look for a 2026 release specifically
];

async function findMovies() {
    console.log("Searching for Retry Movies...");
    for (const movie of movies) {
        try {
            const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(movie)}&include_adult=false`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                data.results.forEach(m => {
                    // Log potential candidates
                    if (m.release_date && (m.release_date.includes('2025') || m.release_date.includes('2026'))) {
                        console.log(`CANDIDATE for ${movie}: ${m.id} (${m.title}, ${m.release_date})`);
                    }
                });
                // Also just log the first result for reference
                const first = data.results[0];
                console.log(`FIRST RESULT for ${movie}: ${first.id} (${first.title}, ${first.release_date})`);

            } else {
                console.log(`${movie}: NOT FOUND`);
            }
        } catch (error) {
            console.error(`Error searching for ${movie}:`, error.message);
        }
    }
}

findMovies();
