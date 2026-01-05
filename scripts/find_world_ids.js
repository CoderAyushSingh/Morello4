
const API_KEY = '09c337f143b22c7f2a83ab8e1f6ab8d3';
const BASE_URL = 'https://api.themoviedb.org/3/search/movie';

const movies = [
    "Avengers: Doomsday",
    "Blade",
    "Avengers: Secret Wars",
    "New Jedi Order", // Star Wars
    "Toy Story 5",
    "Minions 3",
    "Spider-Man 4",
    "Fast & Furious 11", // Might be "Fast X Part 2" or just "Fast & Furious"
    "Dune: Messiah", // Dune Part 3
    "Ice Age 6"
];

async function findMovies() {
    console.log("Searching for Upcoming World Movies...");
    for (const movie of movies) {
        try {
            const url = `${BASE_URL}?api_key=${API_KEY}&query=${encodeURIComponent(movie)}&include_adult=false`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                // Try to catch any future release
                data.results.forEach(m => {
                    console.log(`CANDIDATE for ${movie}: ${m.id} (${m.title}, ${m.release_date})`);
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
