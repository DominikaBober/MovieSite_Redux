export const getMovies = (state) => state.movies;

export const getMovie = (state, movieId) => {return state.movies.find(movie => movie.id === parseInt(movieId))}
