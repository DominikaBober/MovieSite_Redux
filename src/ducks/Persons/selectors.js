export const getPersons = (state) =>  state.persons;

export const getPerson = (state, personId) => { return state.persons.find(movie => movie.id === parseInt(personId)) }
