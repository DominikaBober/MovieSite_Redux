import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers, compose} from 'redux';
import logger from 'redux-logger';
import { createMiddleware } from 'redux-api-middleware';
// import {ActorsReducer} from "./Actors/ActorsReducer.js";
import {MoviesReducer} from "./Movies/reducer.js";
import {PersonsReducer} from "./Persons/reducer.js";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const combinedReducers = combineReducers({
  movies: MoviesReducer,
  persons: PersonsReducer
});

const store = createStore(combinedReducers, 
  composeEnhancers(applyMiddleware(thunk, createMiddleware(), logger)),
);

export default store;