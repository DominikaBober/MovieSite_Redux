import './Movies.scss';
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import Popup from '../popup';
import NoPage from '../no_page';

import { getMovies } from '../../ducks/Movies/selectors';
import { getPersons } from '../../ducks/Persons/selectors';
import { deleteMovie } from '../../ducks/Movies/operations';

 function Movie({resources, movies, persons, deleteMovie}) {
    
    const {id: movieID} = useParams();
    const [movie, setMovie] = useState(movies.filter(movie => movie.id === parseInt(movieID)));
    const [director, setDirector] = useState(movie.length === 1 ? (persons.filter(person => person.id === movie[0].director_id)):(false));
    const [badId, setbadID] = useState(movie.length > 0 ? (false):(true));
    const [isOpen, setIsOpen] = useState(false);
    const [popupContext, setPopupContext] = useState("");
    const [HandleClose, setHandleClose] = useState(() => () => setIsOpen(false));
    const navigate = useNavigate();

    useEffect(() => {
        if(movies.length > 0){
            setMovie(movies.filter(movie => movie.id === parseInt(movieID)));
            setbadID(movies.filter(movie => movie.id === parseInt(movieID)).length > 0 ? (false):(true))
            if(persons.length > 0){
                setDirector(movies.filter(movie => movie.id === parseInt(movieID)).length === 1 ? (persons.filter(person => person.id === movies.filter(movie => movie.id === parseInt(movieID))[0].director_id)):(false))
            }
        }
    }, [movies, persons])

    const handleDelete = () => {
        deleteMovie(parseInt(movieID));
        navigate('/movies');
    }

    return (
        <div>
            {movies.length > 0 && persons.length > 0 && (
            <>
            { badId ? (
                <NoPage resources={resources}/>
            ) : (
                <div id="row">
                    <div id="col" className="movie">
                        <div className="nag"> {movie[0].title} </div>
                        <div className="content">
                            <div className="movie_pod" id="row">
                                <div id="col">
                                    {director.length === 1 && <Link to={`/person/${director[0].id}`} className="link"> {resources['Movies']['director']}: {director[0].first_name} {director[0].last_name} </Link>}
                                    <div id="dsc"> {resources['Movies']['release_date']}: {new Date(movie[0].release_date).toLocaleDateString('en-GB')} </div>
                                    <div id="dsc"> {resources['Movies']['genre']}: {resources['Form']['genres'][movie[0].genre]} </div>
                                    <div id="dsc"> {resources['Movies']['description']}: {movie[0].description} </div>
                                </div>
                                <img className="detail_poster" src={movie[0].image_url}/>
                            </div>
                        </div>
                        <div id="grid" className="buttons">
                            <Link className="nag" to={`/movie/${movieID}/edit`}>{ resources['Form']['edit']}</Link>
                            <button className="nag" onClick={async () => {
                                setPopupContext(resources["Movies"]["delete_movie"]);
                                setHandleClose(() => () => handleDelete());
                                setIsOpen(true)
                            }}>  {resources['Persons']['delete']}</button>
                        </div>
                    </div>
                </div>
            )}
            </>
            )}
            {isOpen && <Popup
                content={popupContext}
                handleClose={() => {HandleClose()}}
            />}
        </ div>
    )
}

const mapStateToProps = state => {
    return {
      persons: getPersons(state),
      movies: getMovies(state)
    }
}
  
const mapDispatchToProps = {
    deleteMovie,
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Movie);
