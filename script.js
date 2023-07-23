const apiKey = 'aebf9a85'; // OMDB API key 
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const moviesContainer = document.getElementById('moviesContainer');
const detailsContainer = document.getElementById('detailsContainer');
const favoritesList = document.getElementById('favoritesList');

const favoriteMovies = [];

async function searchMovies() {
    const query = searchInput.value.trim();
    if (!query) return;

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`);
        const data = await response.json();

        if (data.Response === 'True') {
            displayMovies(data.Search);
        } else {
            moviesContainer.innerHTML = `<p>No results found.</p>`;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displayMovies(movies) {
    moviesContainer.innerHTML = '';
    movies.forEach((movie) => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const poster = movie.Poster === 'N/A' ? 'no-image.png' : movie.Poster;
        const rating = (Math.random() * 10).toFixed(1);

        movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.Title} Poster" onclick="openMovieDetails('${movie.imdbID}')">
            <button onclick="rateMovie('${movie.imdbID}')">Rate</button>
            <p>Total Ratings: ${rating} / 10</p>
            ${
                favoriteMovies.includes(movie.imdbID)
                    ? `<button onclick="removeFromFavorites('${movie.imdbID}')">Remove from Favorites</button>`
                    : `<button onclick="addToFavorites('${movie.imdbID}')">Add to Favorites</button>`
            }
        `;

        moviesContainer.appendChild(movieCard);
    });
}

function openMovieDetails(imdbID) {
    const newWindow = window.open('about:blank', '_blank');
    if (!newWindow) {
        alert('Please allow pop-ups to view movie details.');
        return;
    }

    fetchMovieDetails(imdbID)
        .then((data) => {
            const detailsHTML = `
                <img src="${data.Poster}" alt="${data.Title} Poster">
                <h2>${data.Title}</h2>
                <p>Year: ${data.Year}</p>
                <p>Language: ${data.Language}</p>
                <p>Country: ${data.Country}</p>
                <p>Genre: ${data.Genre}</p>
                <p>Plot: ${data.Plot}</p>
                <p>IMDB Rating: ${data.imdbRating}</p>
            `;
            newWindow.document.write(detailsHTML);
        })
        .catch((error) => {
            console.error('Error fetching movie details:', error);
            newWindow.document.write('<p>Error fetching movie details.</p>');
        });
}

async function fetchMovieDetails(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
    const data = await response.json();

    if (data.Response === 'True') {
        return data;
    } else {
        throw new Error(data.Error);
    }
}




async function showMovieDetails(imdbID) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
        const data = await response.json();

        if (data.Response === 'True') {
            const detailsHTML = `
                <img src="${data.Poster}" alt="${data.Title} Poster">
                <h2>${data.Title}</h2>
                <p>Year: ${data.Year}</p>
                <p>Language: ${data.Language}</p>
                <p>Country: ${data.Country}</p>
                <p>Genre: ${data.Genre}</p>
                <p>Plot: ${data.Plot}</p>
                <p>IMDB Rating: ${data.imdbRating}</p>
            `;

            detailsContainer.innerHTML = detailsHTML;
            detailsContainer.style.display = 'block';
        } else {
            detailsContainer.innerHTML = `<p>Details not found.</p>`;
            detailsContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}
function showMovieDetails(imdbID) {
    window.location.href = `details.html?imdbID=${imdbID}`;
}



function addToFavorites(imdbID) {
    if (!favoriteMovies.includes(imdbID)) {
        favoriteMovies.push(imdbID);
        alert('Movie added to favorites!');
        updateFavoritesList();
    } else {
        alert('This movie is already in your favorites.');
    }
}

function removeFromFavorites(imdbID) {
    const index = favoriteMovies.indexOf(imdbID);
    if (index !== -1) {
        favoriteMovies.splice(index, 1);
        alert('Movie removed from favorites!');
        updateFavoritesList();
    }
}

async function updateFavoritesList() {
    favoritesList.innerHTML = '';

    for (const imdbID of favoriteMovies) {
        try {
            const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
            const data = await response.json();

            if (data.Response === 'True') {
                const listItem = document.createElement('li');
                listItem.innerText = data.Title;
                const removeButton = document.createElement('button');
                removeButton.innerText = 'Remove';
                removeButton.onclick = () => removeFromFavorites(imdbID);
                listItem.appendChild(removeButton);
                favoritesList.appendChild(listItem);
            } else {
                console.error('Error fetching movie details:', data.Error);
            }
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    }
}


searchButton.addEventListener('click', searchMovies);
