import types from './types';

export const getPersonsAction = (payload) => ({
    type: types.GET_PERSONS,
    payload
});

export const addPersonAction = (payload) => ({
    type: types.ADD_PERSON,
    payload
});

export const deletePersonAction = (payload) => ({
    type: types.DELETE_PERSON,
    payload
});

export const updatePersonAction = (payload) => ({
    type: types.UPDATE_PERSON,
    payload
});
