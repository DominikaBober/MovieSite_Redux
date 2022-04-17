import axios from "axios";
import * as actions from './actions';

import persons from './../persons.json';

export const getPersons = () => {
    return dispatch => {
        dispatch(actions.getPersonsAction(persons));
    }
}


export const addPerson = (newPerson) => {
    return async dispatch => {
        dispatch(actions.addPersonAction(newPerson));
    }
}

export const updatePerson = (person) => {
    return async dispatch => {
        dispatch(actions.updatePersonAction(person));
    }
}

export const deletePerson = (PersonId) => {
    return async dispatch => {
        dispatch(actions.deletePersonAction({id: PersonId}));
    }
}
