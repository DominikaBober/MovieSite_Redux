import types from './types';

export const PersonsReducer = (state = [], action) => {
    switch(action.type){
        case types.GET_PERSONS:
            return [...action.payload];
        case types.ADD_PERSON:
            return [...state, action.payload];
        case types.UPDATE_PERSON:
            return state.map(el=>{
                if(el.id === action.payload.id){
                    let updatedElement = el
                    updatedElement.first_name = action.payload.first_name
                    updatedElement.last_name = action.payload.last_name
                    updatedElement.birth_date =  action.payload.birth_date
                    updatedElement.image_url = action.payload.image_url
                    updatedElement.nationality = action.payload.nationality
                    return updatedElement 
                }
                else{
                    return el
                }
            })

        case types.DELETE_PERSON:
            return [...state.filter(el => el.id !== action.payload.id)];
        default:
            return state;
    }
}
