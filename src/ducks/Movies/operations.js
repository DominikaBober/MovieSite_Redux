import axios from "axios";
import * as actions from './actions';

export const checkConnetion = () => {
    return async () => {
        try {
            const response = await 
            axios.get('http://localhost:5000/api/movies');
            if(response.status === 200){
                return "OK"
            }
        } catch(error) {
            console.log(error);
            return "NOT OK"
        }
    }
}

export const getMovies = () => {
    return async dispatch => {
        await axios.get('http://localhost:5000/api/movies').then((response) => {
            if (response.status === 200){
                dispatch(actions.getMoviesAction(response.data));
            }
        }).catch((error)=>{
            console.log(error)
        });
    }
}

export const addMovie = (newMovie) => {
    return async dispatch => {
        try {
            const response = await 
            axios.post('http://localhost:5000/api/movies', newMovie);
            if(response.status === 200){
                dispatch(actions.addMovieAction(response.data));
                return "OK"
            }
        } catch(error) {
            console.log(error);
            return "NOT OK"
        }
    }
}

export const updateMovie = (movie) => {
    return async dispatch => {
        try {
            const response = await 
            axios.put(`http://localhost:5000/api/movies/${movie.id}`, movie);
            if(response.status === 200){
                dispatch(actions.updateMovieAction(response.data));
                return "OK"
            }
        } catch(error) {
            console.log(error);
            return "NOT OK"
        }
    }
}

export const deleteMovie = (movieId) => {
    return async dispatch => {
        await axios.delete(`http://localhost:5000/api/movies/${movieId}`).then((response) => {
            if (response.status === 200){
                dispatch(actions.deleteMovieAction({id: movieId}));
                return response
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
}
