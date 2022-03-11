import { useState, useEffect } from 'react';
import {Link } from 'react-router-dom';
import { connect } from 'react-redux'

// import operations
import { getMovies } from '../../ducks/Movies/selectors';
import { getPersons } from '../../ducks/Persons/selectors';


const Dashboard = ({resources, movies, persons}) => {

    const [anyMovies, setAnyMovies] = useState(false)

    useEffect(() => {
        if (movies){
            if(movies.length > 0){
                setAnyMovies(true)
            }
        }
    }, [movies, persons])

    console.log("movies", movies, "persons", persons);

    return (
        <div id="col" className="Dashboard">
            <div className="nag">{resources['Dashboard']['new_movies']}</div>
            {anyMovies &&
            <div className="content" id="row">
                {movies.sort((a,b) => b.id - a.id).slice(0, 3).map( movie => (
                    <Link to={`/movie/${movie.id}`} className="pod" id="col" key={`${movie.id}`}>
                        <img className="big_poster" src={movie.image_url} alt={movie.title}/>
                        <div className="title">{movie.title}</div>
                    </Link>
                ))}
            </div>}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        movies: getMovies(state),
        persons: getPersons(state)
    }
}

  
export default connect(mapStateToProps, null)(Dashboard);
