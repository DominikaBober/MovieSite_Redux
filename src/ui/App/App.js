import './App.scss';
import {Route, Routes, Link, useLocation} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { connect } from 'react-redux'

// import components
import Movies from '../Movies/Movies';
import Movie from '../Movies/Movie';
import Dashboard from '../Dashboard/Dashboard';
import Persons from '../Persons/Persons';
import Person from '../Persons/Person';
import Forms from "../Forms/Forms";
import PersonForm from '../Forms/PersonForm';
import MovieForm from '../Forms/MovieForm';
import Error from '../error';
import NoPage from '../no_page';

// import operations
import { getMovies } from '../../ducks/Movies/operations';
import { getPersons } from '../../ducks/Persons/operations';

// import translation catalog
import resources_pl from '../../ducks/pl.json';
import resources_en from '../../ducks/en.json';


function App({movies, getMovies, persons, getPersons}) {

    // get data
    useEffect(() => { (async () => {
        if(persons.length === 0){
            await getPersons()
        }  
        if(movies.length === 0){
            await getMovies()
        }
    })()}, [persons, movies, getPersons, getMovies])

    console.log("movies", movies, "persons", persons)

    // language
    const [resources, setResources] = useState(resources_pl)
    const handleLanguage = (languale) => {
        if (languale==="resources_pl") { setResources(resources_pl)}
        else {setResources(resources_en)}
    }

    // links
    const links = [{path: "/", name: resources['App']['Navbar']['main']},
                    {path: "/add", name: resources['App']['Navbar']['form']},
                    {path: "/movies", name: resources['App']['Navbar']['movies']},
                    {path: "/persons", name: resources['App']['Navbar']['persons']},
                    // {path: "/actors", name: resources['App']['Navbar']['actors']}
                ]
    const location = useLocation();

    return (
        <div className="page">
            <div className="nav">
                <div className="links">
                    {links.map((link) => (
                        location.pathname===link.path ?
                        (<Link to={`${link.path}`} key={`${link.name}`}><div className="current_link">{link.name}</div></Link>):
                        (<Link to={`${link.path}`} key={`${link.name}`}><div>{link.name}</div></Link>)
                    ))}
                </div>
                <div className="language">
                    <div >{resources['App']['Navbar']['language']['language']}</div>
                        <select className="set_language" onChange={(e) => handleLanguage(e.target.value)}>
                            <option value='resources_pl'>{resources['App']['Navbar']['language']['polish']}</option>
                            <option value='resources_en'>{resources['App']['Navbar']['language']['english']}</option>
                        </select>
                </div>
            </div>
            <div className="switch">
                { movies.length>0 && persons.length>0 ? (
                <Routes>
                    <Route exact path="/" element={
                        <Dashboard  resources={resources}/>}
                    />
                    <Route exact path="/movies" element={
                        <Movies  resources={resources}/>}
                    />
                    <Route exact path="/persons" element={
                        <Persons  resources={resources}/>}
                    />
                    <Route exact path="/add" element={
                        <Forms  resources={resources}/>}
                    />
                    <Route exact path="/movie/:id" element={
                        <Movie  resources={resources}/>}
                    />
                    <Route exact path="/movie/:id/edit" element={
                        <MovieForm  resources={resources}/>}
                    />
                    <Route exact path="/person/:id" element={
                        <Person  resources={resources}/>}
                    />
                    <Route exact path="/person/:id/edit" element={
                        <PersonForm  resources={resources}/>}
                    />
                    <Route element={
                        <NoPage resources={resources}/>}
                    />
                </Routes>
                ):(
                    <Error resources={resources}/>
                )}
            </div>
            <footer className="foot"></footer>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        movies: state.movies,
        persons: state.persons
    }
}
  
const mapDispatchToProps = {
    getMovies,
    getPersons
}
  
export default connect(mapStateToProps, mapDispatchToProps)(App);
