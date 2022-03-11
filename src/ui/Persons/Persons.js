import './Persons.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import {Formik, Form} from "formik";
import {DatePicker} from "react-formik-ui";

// import operations
import { getMovies } from '../../ducks/Movies/selectors';
import { getPersons } from '../../ducks/Persons/selectors';

const Persons = ({resources, movies, persons}) => {

    const [sortPersons, setsortPersons] = useState(persons);
    const [filterPersons, setfilterPersons] = useState(persons);

    const [currentPage, setCurrentPage] = useState(1);
    const [pages, setPages] = useState({
        personsOnPage: 0,
        number_of_page: [],
        max: 0
    })

    const [sortType, setSortType] = useState('id');
    useEffect(() => {
        const sortArray = type => {
            const types = {
                id: 'id',
                first_name: 'first_name',
                last_name: 'last_name',
                birth_date: 'birth_date',
                nationality: 'nationality'
            };
            const sortProperty = types[type];
            const sorted = [...persons].sort(function(a, b){
                if (sortProperty==="birth_date"){
                    return  new Date(a[sortProperty]) - new Date(b[sortProperty]);
                }
                else{
                    if(a[sortProperty] < b[sortProperty]) { return -1; }
                    if(a[sortProperty] > b[sortProperty]) { return 1; }
                    return 0}
                })
            console.log(sorted);
            setsortPersons(sorted);
        };
        if(movies){
            if(movies.length > 0){
                if(persons.length > 0){
                    setsortPersons(persons)
                    setfilterPersons(persons)
                    setPages({
                        personsOnPage: parseInt(6),
                        number_of_page: [...Array(Math.ceil(persons.length/parseInt(6))).keys()].map(el => el+1),
                        max: [...Array(Math.ceil(persons.length/6)).keys()][[...Array(Math.ceil(persons.length/6)).keys()].length-1]+1
                    })
                    sortArray(sortType);
                }
            }
        }
    }, [sortType, movies, persons]);

    // filtrowanie

    const [filrtNationality, setFilrtDNationality] = useState(false);
    const [filrtDirectedMovies, setFilrtDirectedMovies] = useState(false);
    const [filrtAge, setFilrtAge] = useState(false);

    const resetFilter = () => {
        setfilterPersons(sortPersons);
        setCurrentPage(1);
        setPages({
            personsOnPage: parseInt(pages.personsOnPage),
            number_of_page: [...Array(Math.ceil(sortPersons.length/parseInt(pages.personsOnPage))).keys()].map(el => el+1),
            max: [...Array(Math.ceil(sortPersons.length/pages.personsOnPage)).keys()][[...Array(Math.ceil(sortPersons.length/pages.personsOnPage)).keys()].length-1]+1
        });
    }

    const handleFilter = (values) => {

        const filter_by_nat = sortPersons.filter((person) => document.getElementById(`button_${person.nationality}`) ? document.getElementById(`button_${person.nationality}`).className === "checked" ? true : false : true)
        const filter_by_movies = sortPersons.filter(person => movies.filter(movie => movie.director_id===person.id).length!==0)
        .filter((person) => 
        filrtDirectedMovies ?
        document.getElementById(`button_${movies.reduce((a,b) => {
                if (a.filter(directed_movies => directed_movies[0]===b.director_id).length===0){
                    a.push([b.director_id, 1]);
                    return a;
                }else{
                    return a.filter(directed_movies => directed_movies[0]!==b.director_id)
                    .concat([[b.director_id, a.filter(directed_movies => directed_movies[0]===b.director_id)[0][1]+1]])
            }},[]).filter(directed_movies => directed_movies[0]===person.id)[0][1]}`).className === "checked" ? true : false : false
        )
        const filter_by_age = sortPersons.filter((person) => values.date_start!=="" ? new Date(person.birth_date) - values.date_start > 0 : true )
                                .filter((person) => values.date_end!=="" ? new Date(person.birth_date) - values.date_end < 0 : true )

        const temp_fiterPersons = (filter_by_nat.length === 0 ? sortPersons : filter_by_nat).filter((page_movie) => {
            return (filter_by_movies.length === 0 ? sortPersons : filter_by_movies).indexOf(page_movie) !== -1})
            .filter((page_movie) => {
            return filter_by_age.indexOf(page_movie) !== -1})
        setfilterPersons(temp_fiterPersons);
        setCurrentPage(1);
        setPages({
            personsOnPage: parseInt(pages.personsOnPage),
            number_of_page: [...Array(Math.ceil(temp_fiterPersons.length/parseInt(pages.personsOnPage))).keys()].map(el => el+1),
            max: [...Array(Math.ceil(temp_fiterPersons.length/pages.personsOnPage)).keys()][[...Array(Math.ceil(temp_fiterPersons.length/pages.personsOnPage)).keys()].length-1]+1
        });
    }

    return (
        <>
        {movies && persons &&
        <div className="Persons">
            <div className="addition" id="col">
            <div className="content_2">
                <div >{resources['Persons']['Sort']['sort']}</div>
                    <select  onChange={(e) => setSortType(e.target.value)}>
                        <option value='id'>{resources['Persons']['Sort']['default']}</option>
                        <option value='first_name'>{resources['Persons']['Sort']['first_name']}</option>
                        <option value='last_name'>{resources['Persons']['Sort']['last_name']}</option>
                        <option value='birth_date'>{resources['Persons']['Sort']['birth_date']}</option>
                        <option value='nationality'>{resources['Persons']['Sort']['nationality']}</option>
                    </select>
            </div>
            <div className="content_2">
                <div >{resources['Persons']['number_of_persons']}</div>
                    <select  onChange={(e) => {
                        setCurrentPage(1)
                        setPages({
                            personsOnPage: parseInt(e.target.value),
                            number_of_page: [...Array(Math.ceil(filterPersons.length/parseInt(e.target.value))).keys()].map(el => el+1),
                            max: [...Array(Math.ceil(filterPersons.length/e.target.value)).keys()][[...Array(Math.ceil(filterPersons.length/e.target.value)).keys()].length-1]+1
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
                        <button onClick={()=>setFilrtDNationality(!filrtNationality)} className="filtr_button">{resources['Persons']['Filtr']['nationality']}</button>
                        {filrtNationality && 
                            <div id="col">
                                {persons.reduce((a,b) => {if (a.filter(nationality => nationality===b.nationality).length===0){ a.push(b.nationality)} return a},[]).map(
                                    nationality => (
                                        <button className="unchecked" onClick={() => {
                                            document.getElementById(`button_${nationality}`).className = document.getElementById(`button_${nationality}`).className==="unchecked" ? "checked" : "unchecked";
                                        }} id={`button_${nationality}`} key={`dir_${nationality}`}>
                                            <div className="title">{nationality}</div>
                                        </button>
                                    )
                                )}
                            </div>
                        }
                        <button onClick={()=>setFilrtDirectedMovies(!filrtDirectedMovies)} className="filtr_button">{resources['Persons']['Filtr']['movies']}</button>
                        {filrtDirectedMovies && 
                            <div >
                                {movies.reduce((a,b) => {
                                    if (a.filter(directed_movies => directed_movies[0]===b.director_id).length===0){
                                        a.push([b.director_id, 1]);
                                        return a;
                                    }else{
                                        return a.filter(directed_movies => directed_movies[0]!==b.director_id)
                                        .concat([[b.director_id, a.filter(directed_movies => directed_movies[0]===b.director_id)[0][1]+1]])
                                    }},[]).map(directed_movies => directed_movies[1]).reduce((a,b) => { if (a.filter(a_val => a_val===b).length===0){a.push(b);} return a;},[])
                                .sort(function(a, b){if(a < b) { return -1; } return 1}).map(
                                    directed_movies => (
                                            <button className="unchecked" onClick={() => {
                                                document.getElementById(`button_${directed_movies}`).className = document.getElementById(`button_${directed_movies}`).className==="unchecked" ? "checked" : "unchecked";
                                            }} id={`button_${directed_movies}`}  key={`genre_${directed_movies}`}>
                                                <div className="title">{directed_movies}</div>
                                            </button>
                                    )
                                )}
                            </div>
                        }
                        <button onClick={()=>setFilrtAge(!filrtAge)} className="filtr_button">{resources['Persons']['Filtr']['birth_date']}</button>
                        <Formik
                        initialValues={{
                            date_start: "",
                            date_end: ""
                        }}
                        onSubmit={handleFilter}
                        enableReinitialize = {true}>
                        {({ errors, touched, isValidating }) => (
                        <Form className="Form" id="col">
                        {filrtAge &&
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
                        {(filrtNationality || filrtDirectedMovies || filrtAge) &&
                            <button type="submit" id="pole" className="filtr_button">
                                {resources['Form']['submit_filtr']}
                            </button>
                        }
                    </Form>)}
            </Formik>
            {(filrtNationality || filrtDirectedMovies || filrtAge) &&
                <button id="pole" className="filtr_button" onClick={() => resetFilter()}>
                    {resources['Form']['cancle_filtr']}
                </button>
            }                    
            </div>
            </div>
            <div className="content">
                <div id="grid">
                    {sortPersons.filter((movie) => {return filterPersons.indexOf(movie) !== -1}).length === 0 ? (
                            <div className="error">{resources['Persons']['no_persons']}</div>
                    ):(
                        sortPersons.filter((movie) => {return filterPersons.indexOf(movie) !== -1})
                        .slice((currentPage-1)*pages.personsOnPage, currentPage*pages.personsOnPage).map( person => (
                        <Link to={`/person/${person.id}`} className="pod" id="person_pod" key={`${person.id}`}>
                            <div id="row">
                            <img className="poster" src={person.image_url}/>
                                <div id="col" className="person_info">
                                    <div className="last_name">{person.last_name}</div>
                                    <div className="first_name">{person.first_name}</div>
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
                        (number===currentPage ? (<button onClick={()=>{setCurrentPage(number)}} id="pagenubmer" className="activepage" key={`${number}`}>{number}</button>
                        ):(<button onClick={()=>{setCurrentPage(number)}} id="pagenubmer" key={`${number}`}>{number}</button>))
                    )}
                    { currentPage<pages.max && (<button onClick={()=>{setCurrentPage(currentPage+1)}} id="pagenubmer"> &#8594; </button>)}
                    {Math.min(currentPage+2,pages.max)!==pages.max && (<div>...</div>)}
                    { currentPage<pages.max-1 && (<button onClick={()=>{setCurrentPage(pages.max)}} id="pagenubmer"> last </button>)}
                </div>
                )}
            </div>
        </div>
        }
        </>
    );
}

const mapStateToProps = state => {
    return {
      persons: getPersons(state),
      movies: getMovies(state)
    }
}
  
export default connect(mapStateToProps, null)(Persons);