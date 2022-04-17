import './Persons.scss';
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux'

import Popup from '../popup';
import NoPage from '../no_page';

import { getMovies } from '../../ducks/Movies/selectors';
import { getPersons } from '../../ducks/Persons/selectors';
import { deletePerson } from '../../ducks/Persons/operations';
import { updateMovie } from '../../ducks/Movies/operations';

const Person = ({resources, movies, persons, deletePerson, updateMovie}) => {

    const {id: personID} = useParams();
    const [person, setPerson] = useState(persons.filter(person => person.id === parseInt(personID)));
    const [badId, setbadID] = useState(person.length > 0 ? (false):(true));
    const [directedMovies, setDirectedMovies] = useState([])
    const [showDirectedMovies, setShowDirectedMovies] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [popupContext, setPopupContext] = useState("");
    const [HandleClose, setHandleClose] = useState(() => () => setIsOpen(false));
    const navigate = useNavigate();

    useEffect(() => {
        if(movies.length > 0){
            if(persons.length > 0){
                setPerson(persons.filter(person => person.id === parseInt(personID)));
                setbadID(persons.filter(person => person.id === parseInt(personID)).length > 0 ? (false):(true))
                setDirectedMovies(! badId && movies.filter(movie => movie.director_id === person[0].id))
            }
        }
    }, [movies, persons, badId])

    const handleDelete = () => {
        directedMovies.length > 0 && directedMovies.forEach(movie => {
            updateMovie({
                id: parseInt(movie.id),
                title: movie.title,
                genre: movie.genre,
                release_date: movie.release_date,
                description: movie.description,
                image_url: movie.image_url
            })
        });
        deletePerson(parseInt(personID));
        navigate('/persons');
    }

    return (
        <div>
            { badId ? (
                <NoPage resources={resources}/>
            ) : (
                <div id="col" className="person">
                    <div id="col" className="movie">
                        <div className="nag"> {person[0].first_name} {person[0].last_name} </div>
                        <div className="content">
                            <div id="row">
                                <div id="col">
                                    <div> {resources['Persons']['birth_date']}: {new Date(person[0].birth_date).toLocaleDateString('en-GB')} </div>
                                    <div> {resources['Persons']['nationality']}: {person[0].nationality} </div>
                                </div>
                                <img className="detail_poster" src={person[0].image_url} alt={person[0].last_name}/>
                            </div>
                        </div>
                        <div id="grid" className="buttons">
                            <Link className="nag" to={`/person/${personID}/edit`}>{ resources['Form']['edit']}</Link>
                            <button className="nag" onClick={async () => {
                                setPopupContext(resources["Persons"]["delete_person"]);
                                setHandleClose(() => () => handleDelete())
                                setIsOpen(true)
                            }}>  {resources['Persons']['delete']}</button>
                        </div>
                    </div>
                    { directedMovies.length > 0 &&
                        <div className="movies" id="col">
                            <button className="nag" onClick={() => setShowDirectedMovies(!showDirectedMovies)}>  {resources['Persons']['directed_movies']}</button>
                            { showDirectedMovies &&
                            <div className="scroll">
                            { directedMovies.length > 3 ? (
                                <div className="scroll_h">
                                    {directedMovies.map(movie => (
                                        <Link to={`/movie/${movie.id}`} className="pod" id="col" key={`${movie.id}`}>
                                            <img src={movie.image_url} alt={movie.title} />
                                            <div className="title">{movie.title}</div>
                                        </Link>
                                    ))}
                                </div>
                            ):(
                                directedMovies.map(movie => (
                                    <Link to={`/movie/${movie.id}`} className="pod" id="col" key={`${movie.id}`}>
                                        <img  src={movie.image_url} alt={movie.title} />
                                        <div className="title">{movie.title}</div>
                                    </Link>
                                ))
                            )}
                            </div>
                            }
                        </div>
                    }
                </div>
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
    deletePerson,
    updateMovie
}
  
export default connect(mapStateToProps, mapDispatchToProps)(Person);