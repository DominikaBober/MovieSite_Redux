import axios from "axios";
import * as actions from './actions';

export const checkConnetion = () => {
    return async () => {
        try {
            const response = await 
            axios.get('http://localhost:5000/api/persons');
            if(response.status === 200){
                return "OK"
            }
        } catch(error) {
            console.log(error);
            return "NOT OK"
        }
    }
}

export const getPersons = () => {
    return async dispatch => {
        await axios.get('http://localhost:5000/api/persons').then((response) => {
            dispatch(actions.getPersonsAction(response.data));
        }).catch((error)=>{
            console.log(error)
        });
    }
}


export const addPerson = (newPerson) => {
    return async dispatch => {
        try {
            const response = await 
            axios.post('http://localhost:5000/api/persons', newPerson);
            if(response.status === 200){
                dispatch(actions.addPersonAction(response.data));
                return "OK"
            }
        } catch(error) {
            console.log(error);
            return "NOT OK"
        }
    }
}

export const updatePerson = (person) => {
    return async dispatch => {
        try {
            const response = await 
            axios.put(`http://localhost:5000/api/persons/${person.id}`, person);
            if(response.status === 200){
                dispatch(actions.updatePersonAction(response.data));
                return "OK"
            }
        } catch(error) {
            console.log(error);
            return "NOT OK"
        }
    }
}

export const deletePerson = (PersonId) => {
    return async dispatch => {
        await axios.delete(`http://localhost:5000/api/persons/${PersonId}`).then((response) => {
            dispatch(actions.deletePersonAction({id: PersonId}));
            return response
        }).catch((error)=>{
            console.log(error)
        })
    }
}
