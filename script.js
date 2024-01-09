const apiKey = '1bfdbff05c2698dc917dd28c08d41096';

function searchMovies() {
    const searchQuery = document.getElementById('searchInput').value;
    document.getElementById('upcomingMoviesList').style.display = 'none';
    fetchMovies(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchQuery}`, displayMovies);
}

function fetchUpcomingMovies() {
    fetchMovies(`https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`, displayMovies, 'upcomingMoviesList');
}

function fetchMovies(url, callback, containerId = 'moviesList') {
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data.results, containerId))
        .catch(error => console.error('Error fetching data:', error));
}

function displayMovies(movies, containerId = 'moviesList') {
    const moviesListContainer = document.getElementById(containerId);
    moviesListContainer.innerHTML = '';

    movies.forEach(movie => {
        const movieCard = MovieCard(movie);
        moviesListContainer.appendChild(movieCard);
    });
}

function MovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const title = document.createElement('h2');
    title.textContent = movie.title;

    const posterPath = movie.poster_path;
    const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'placeholder_image_url.jpg';

    const posterImage = document.createElement('img');
    posterImage.src = posterUrl;
    posterImage.alt = movie.title;

    movieCard.appendChild(posterImage);
    movieCard.appendChild(title);

    // Add an event listener to navigate to a separate page with movie details
    movieCard.addEventListener('click', () => MovieDetailsPage(movie.id));

    return movieCard;
}

function MovieDetails() {
    const queryParams = new URLSearchParams(window.location.search);
    const movieId = queryParams.get('movieId');

    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
    const url_similarmovies = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=en-US&page=1`;

    Promise.all([fetch(url), fetch(url_similarmovies)])
        .then(([movieResponse, similarMoviesResponse]) => {
            return Promise.all([movieResponse.json(), similarMoviesResponse.json()]);
        })
        .then(([movie, similarMovies]) => {
            DisplayMovieDetails(movie);
            SimilarMovies(similarMovies.results);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function SimilarMovies(similarMovies) {
    const similarMoviesContainer = document.createElement('div');
    similarMoviesContainer.classList.add('similar-movies-container');

    const heading = document.createElement('h2');
    heading.textContent = 'Similar Movies';

    const similarMoviesList = document.createElement('div');
    similarMoviesList.classList.add('similar-movies-list');

    similarMovies.forEach(similarMovie => {
        const similarMovieCard = MovieCard(similarMovie);
        similarMoviesList.appendChild(similarMovieCard);
    });

    similarMoviesContainer.appendChild(heading);
    similarMoviesContainer.appendChild(similarMoviesList);

    document.getElementById('movieDetails').appendChild(similarMoviesContainer);
}

function DisplayMovieDetails(movie) {
    const movieDetailsContainer = document.getElementById('movieDetails');
    movieDetailsContainer.innerHTML = '';

    const title = document.createElement('h2');
    title.textContent = movie.title;

    const releaseDate = document.createElement('p');
    releaseDate.innerHTML = `<strong>Release Date:</strong> ${movie.release_date}`;

    const rating = document.createElement('p');
    rating.innerHTML = `<strong>Rating:</strong> ${movie.vote_average}`;

    const genre = document.createElement('p');
    genre.innerHTML = `<strong>Genre:</strong> ${movie.genres.map(genre => genre.name).join(', ')}`;

    const story = document.createElement('p');
    story.textContent = movie.overview;

    const posterPath = movie.poster_path;
    const posterUrl = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'placeholder_image_url.jpg';

    const posterImage = document.createElement('img');
    posterImage.src = posterUrl;
    posterImage.alt = movie.title;

    movieDetailsContainer.appendChild(title);
    movieDetailsContainer.appendChild(posterImage);
    movieDetailsContainer.appendChild(releaseDate);
    movieDetailsContainer.appendChild(rating);
    movieDetailsContainer.appendChild(genre);
    movieDetailsContainer.appendChild(story);
}



fetchUpcomingMovies();

document.getElementById('searchButton').addEventListener('click', searchMovies);
document.querySelector('.container-details').style.display = 'none';
