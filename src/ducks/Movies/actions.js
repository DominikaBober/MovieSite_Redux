import types from './types';

export const getMoviesAction = (payload) => ({
    type: types.GET_MOVIES,
    payload
});

export const addMovieAction = (payload) => ({
    type: types.ADD_MOVIE,
    payload
});

export const deleteMovieAction = (payload) => ({
    type: types.DELETE_MOVIE,
    payload
});

export const updateMovieAction = (payload) => ({
    type: types.UPDATE_MOVIE,
    payload
});
