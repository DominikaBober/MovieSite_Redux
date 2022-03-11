import types from './types';

export const MoviesReducer = (state = [], action) => {
    switch(action.type){
        case types.GET_MOVIES:
            return [...action.payload];
        case types.ADD_MOVIE:
            return [...state, action.payload];
        case types.UPDATE_MOVIE:
            return state.map(el=>{
                if(el.id === action.payload.id){
                    let updatedElement = el
                    updatedElement.title = action.payload.title
                    updatedElement.genre = action.payload.genre
                    updatedElement.release_date = action.payload.release_date
                    updatedElement.description = action.payload.description
                    updatedElement.image_url = action.payload.image_url
                    updatedElement.director_id = action.payload.director_id
                    return updatedElement 
                }
                else{
                    return el
                }
            })

        case types.DELETE_MOVIE:
            return [...state.filter(el => el.id !== action.payload.id)];
        default:
            return state;
    }
}
