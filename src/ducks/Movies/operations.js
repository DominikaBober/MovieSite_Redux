import axios from "axios";
import * as actions from './actions';
import movies from './../movies.json';

export const getMovies = () => {
    return dispatch => {
        dispatch(actions.getMoviesAction(movies));
    }
}

export const addMovie = (newMovie) => {
    return async dispatch => {
        dispatch(actions.addMovieAction(newMovie));
    }
}

export const updateMovie = (movie) => {
    return async dispatch => {
        dispatch(actions.updateMovieAction(movie));
    }
}

export const deleteMovie = (movieId) => {
    return async dispatch => {
        dispatch(actions.deleteMovieAction({id: movieId}));
    }
}
