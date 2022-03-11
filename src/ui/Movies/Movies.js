import './Movies.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import {Formik, Form} from "formik";
import {DatePicker} from "react-formik-ui";

// import operations
import { getMovies } from '../../ducks/Movies/selectors';
import { getPersons } from '../../ducks/Persons/selectors';

const Movies = ({resources, movies, persons}) => {

    const [pagePersons, setPersons] = useState(persons);
    const [sortMovies, setsortMovies] = useState(movies);
    const [filterMovies, setfilterMovies] = useState(movies);

    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState({
        moviesOnPage: 0,
        number_of_page: [],
        max: 0
    })
    const [sortType, setSortType] = useState('id');
    useEffect(() => {
        const sortArray = type => {
            const types = {
                id: 'id',
                release_date: 'release_date',
                title: 'title',
                // director_id: 'director',
                genre: 'genre'
            };
            const sortProperty = types[type];
            const sorted = [...movies].sort(function(a, b){
                if(sortProperty==='release_date'){
                    return  new Date(a[sortProperty]) - new Date(b[sortProperty]);
                }
                if(a[sortProperty] < b[sortProperty]) { return -1; }
                if(a[sortProperty] > b[sortProperty]) { return 1; }
                return 0})
            // console.log(sorted);
            setsortMovies(sorted);
        };
        // sortArray(sortType);
        if(movies){
            if(movies.length > 0){
                if(persons.length > 0){
                    setPersons(persons);
                    setsortMovies(movies);
                    setfilterMovies(movies);
                    setPages({
                        moviesOnPage: 6,
                        number_of_page: [...Array(Math.ceil(movies.length/6)).keys()].map(el => el+1),
                        max: [...Array(Math.ceil(movies.length/6)).keys()][[...Array(Math.ceil(movies.length/6)).keys()].length-1]+1
                    });
                }
                
            }
            sortArray(sortType);
        }
    }, [sortType, movies, persons]);


    // filtrowanie
    const [filrtDirector, setFilrtDirector] = useState(false);
    const [filrtGenre, setFilrtGenre] = useState(false);
    const [filrtDate, setFilrtDate] = useState(false);

    const resetFilter = () => {
        setfilterMovies(sortMovies);
        setCurrentPage(1);
        setPages({
            moviesOnPage: parseInt(pages.moviesOnPage),
            number_of_page: [...Array(Math.ceil(sortMovies.length/parseInt(pages.moviesOnPage))).keys()].map(el => el+1),
            max: [...Array(Math.ceil(sortMovies.length/pages.moviesOnPage)).keys()][[...Array(Math.ceil(sortMovies.length/pages.moviesOnPage)).keys()].length-1]+1
        });
    }

    const handleFilter = (values) => {

        const filter_by_dir = sortMovies.filter((movie) => document.getElementById(`button_${movie.director_id}`) ? document.getElementById(`button_${movie.director_id}`).className === "checked" ? true : false : true)
        const filter_by_genre = sortMovies.filter((movie) => document.getElementById(`button_${movie.genre}`) ? document.getElementById(`button_${movie.genre}`).className === "checked" ? true : false : true)
        const filter_by_date = sortMovies.filter((movie) => values.date_start!=="" ? new Date(movie.release_date) - values.date_start > 0 : true )
                                .filter((movie) => values.date_end!=="" ? new Date(movie.release_date) - values.date_end < 0 : true )

        const temp_fiterMovies = (filter_by_dir.length === 0 ? sortMovies : filter_by_dir).filter((page_movie) => {
            return (filter_by_genre.length === 0 ? sortMovies : filter_by_genre).indexOf(page_movie) !== -1})
            .filter((page_movie) => {
            return filter_by_date.indexOf(page_movie) !== -1})                        
        setfilterMovies(temp_fiterMovies)
        setCurrentPage(1)
        setPages({
            moviesOnPage: parseInt(pages.moviesOnPage),
            number_of_page: [...Array(Math.ceil(temp_fiterMovies.length/parseInt(pages.moviesOnPage))).keys()].map(el => el+1),
            max: [...Array(Math.ceil(temp_fiterMovies.length/pages.moviesOnPage)).keys()][[...Array(Math.ceil(temp_fiterMovies.length/pages.moviesOnPage)).keys()].length-1]+1
        })
    }


    return (
        <>
        {(movies && persons) &&
        <div className="Movies">
            <div className="addition" id="col">
            <div className="content_2">
                <div >{resources['Movies']['Sort']['sort']}</div>
                    <select  onChange={(e) => setSortType(e.target.value)}>
                        <option value='id'>{resources['Movies']['Sort']['default']}</option>
                        <option value='release_date'>{resources['Movies']['Sort']['release_date']}</option>
                        <option value='title'>{resources['Movies']['Sort']['title']}</option>
                        {/* <option value='director_id'>{resources['Movies']['Sort']['director']}</option> */}
                        <option value='genre'>{resources['Movies']['Sort']['genre']}</option>
                    </select>
            </div>
            <div className="content_2">
                <div >{resources['Movies']['number_of_movies']}</div>
                    <select  onChange={(e) => {
                        setCurrentPage(1)
                        setPages({
                            moviesOnPage: parseInt(e.target.value),
                            number_of_page: [...Array(Math.ceil(filterMovies.length/parseInt(e.target.value))).keys()].map(el => el+1),
                            max: [...Array(Math.ceil(filterMovies.length/e.target.value)).keys()][[...Array(Math.ceil(filterMovies.length/e.target.value)).keys()].length-1]+1
                        })
                        }}>
                        <option value='6'>6</option>
                        <option value='10'>10</option>
                        <option value='16'>16</option>
                        <option value='26'>26</option>
                    </select>
            </div>
            <div className="content_2" id="col">
                <div>{resources['Movies']['Filtr']['filtr']}</div>

                        <button onClick={()=>setFilrtDirector(!filrtDirector)} className="filtr_button">{resources['Movies']['Filtr']['director']}</button>
                        {filrtDirector && 
                            <div id="col">
                                {persons.filter(person => movies.filter(movie => movie.director_id===person.id).length>0).map(
                                    person => (
                                        <button className="unchecked" onClick={() => {
                                            document.getElementById(`button_${person.id}`).className = document.getElementById(`button_${person.id}`).className==="unchecked" ? "checked" : "unchecked";
                                        }} id={`button_${person.id}`} key={`dir_${person.id}`}>
                                            <div className="title">{person.first_name.slice(0,1)}. {person.last_name}</div>
                                        </button>
                                    )
                                )}
                            </div>
                        }
                        <button onClick={()=>setFilrtGenre(!filrtGenre)} className="filtr_button">{resources['Movies']['Filtr']['genre']}</button>
                        {filrtGenre && 
                            <div id="grid">
                                {movies.map(movie => [movie.genre, resources['Form']['genres'][movie.genre]])
                                .reduce((a,b) => {if (a.filter(genre => genre[0]===b[0]).length===0){ a.push(b)} return a},[])
                                .sort(function(a, b){if(a[1] < b[1]) { return -1; } if(a[1] > b[1]) { return 1; } return 0}).map(
                                        genre => (
                                            <button className="unchecked" onClick={() => {
                                                document.getElementById(`button_${genre[0]}`).className = document.getElementById(`button_${genre[0]}`).className==="unchecked" ? "checked" : "unchecked";
                                            }} id={`button_${genre[0]}`}  key={`genre_${genre}`}>
                                                <div className="title">{genre[1]}</div>
                                            </button>
                                    )
                                )}
                            </div>
                        }
                        <button onClick={()=>setFilrtDate(!filrtDate)} className="filtr_button">{resources['Movies']['Filtr']['data']}</button>
                        <Formik
                        initialValues={{
                            date_start: "",
                            date_end: ""
                        }}
                        onSubmit={handleFilter}
                        enableReinitialize = {true}>
                        {({ errors, touched, isValidating }) => (
                        <Form className="Form" id="col">
                        {filrtDate &&
                        <div id="col">
                            <div id="lil_text">{resources['Movies']['Filtr']['from']}</div>
                            <DatePicker
                                name='date_start'
                                id="pole"
                                dateFormat='dd.MM.yyyy'
                                placeholder='dd.mm.yyyy'
                                className="date_picker"
                                required
                            />
                            <div id="lil_text">{resources['Movies']['Filtr']['to']}</div>
                            <DatePicker
                                name='date_end'
                                id="pole"
                                dateFormat='dd.MM.yyyy'
                                placeholder='dd.mm.yyyy'
                                className="date_picker"
                                required
                            />
                        </div>}
                        {(filrtDirector || filrtGenre || filrtDate) &&
                            <button type="submit" id="pole" className="filtr_button">
                                {resources['Form']['submit_filtr']}
                            </button>
                        }
                    </Form>)}
            </Formik>
            {(filrtDirector || filrtGenre || filrtDate) &&
                <button id="pole" className="filtr_button" onClick={() => resetFilter()}>
                    {resources['Form']['cancle_filtr']}
                </button>
            }                    
            </div>
            </div>
            <div className="content">
                <div id="grid">
                {sortMovies.filter((movie) => {return filterMovies.indexOf(movie) !== -1}).length === 0 ? (
                        <div className="error">{resources['Movies']['no_movies']}</div>
                ):(
                sortMovies.filter((movie) => {return filterMovies.indexOf(movie) !== -1})
                .slice((currentPage-1)*pages.moviesOnPage, currentPage*pages.moviesOnPage).map( movie => (
                        <Link to={`/movie/${movie.id}`} className="pod" id="movie_pod" key={`${movie.id}`}>
                            <div id="row">
                            <img className="poster" src={movie.image_url}/>
                                <div id="col" className="movie_info">
                                    <div className="title">{movie.title}</div>
                                    {movie.director_id && <div id="director">
                                        {pagePersons.filter(person => person.id === movie.director_id)[0].last_name}
                                    </div>}
                                </div>
                            </div>
                        </Link>                
                    )))}
                </div>
                {pages.number_of_page.length>1 && (
                    <div className="pagenubmer" id="row">
                    { currentPage>2 && (<button onClick={()=>{setCurrentPage(1)}} id="pagenubmer"> first </button>)}
                    {Math.max(0,currentPage-3)!==0 && (<div>...</div>)}
                    { currentPage>1 && (<button onClick={()=>{setCurrentPage(currentPage-1)}} id="pagenubmer"> &#8592; </button>)}
                    {pages.number_of_page.slice(Math.max(0,currentPage-3), Math.min(currentPage+2, pages.max)).map((number) => 
                        (number===currentPage ? (<button onClick={()=>{setCurrentPage(number)}} id="pagenubmer" className="activepage" key={`pagenubmer${number}`}>{number}</button>
                        ):(<button onClick={()=>{setCurrentPage(number)}} id="pagenubmer">{number}</button>))
                    )}
                    { currentPage<pages.max && (<button onClick={()=>{setCurrentPage(currentPage+1)}} id="pagenubmer"> &#8594; </button>)}
                    {Math.min(currentPage+2,pages.max)!==pages.max && (<div>...</div>)}
                    { currentPage<pages.max-1 && (<button onClick={()=>{setCurrentPage(pages.max)}} id="pagenubmer"> last </button>)}
                </div>
                )}
            </div>
        </div>}
        </>
    );
}

const mapStateToProps = state => {
    return {
      persons: getPersons(state),
      movies: getMovies(state)
    }
}
  
const mapDispatchToProps = {
    getPersons,
    getMovies
}
  
export default connect(mapStateToProps, null)(Movies);
