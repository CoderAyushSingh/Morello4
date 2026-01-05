
const API_KEY = '09c337f143b22c7f2a83ab8e1f6ab8d3';
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

const movies = [
    "Blade",
    "Avengers: Secret Wars",
    "New Jedi Order",
    "Toy Story 5",
    "Minions 3",
    "Spider-Man 4",
    "Dune: Messiah",
    "Ice Age 6"
];

async function findMovies() {
    console.log("Re-Searching for World Movies...");
    for (const movie of movies) {
        try {
            const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(movie)}&include_adult=false`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const candidates = data.results.filter(m => m.release_date && (m.release_date.includes('2025') || m.release_date.includes('2026') || m.release_date.includes('2027')));
                if (candidates.length > 0) {
                    candidates.forEach(m => console.log(`${movie}: ${m.id} (${m.title}, ${m.release_date})`));
                } else {
                    console.log(`${movie}: FOUND RESULTS BUT NO 2025-2027 DATE MATCH (First: ${data.results[0].title}, ${data.results[0].release_date})`);
                }
            } else {
                console.log(`${movie}: NOT FOUND`);
            }
        } catch (error) {
            console.error(`Error searching for ${movie}:`, error.message);
        }
    }
}

findMovies();
