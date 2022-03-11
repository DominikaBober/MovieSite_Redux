import './Forms.scss';
import {Formik, Form, Field} from "formik";
import {DatePicker} from "react-formik-ui";
import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux'

import Popup from "../popup.js"
import NoPage from '../no_page';

import { getMovies } from '../../ducks/Movies/selectors';
import { getPersons } from '../../ducks/Persons/selectors';
import { updateMovie} from '../../ducks/Movies/operations';
import { addMovie} from '../../ducks/Movies/operations';
import { checkConnetion } from '../../ducks/Movies/operations';

function MovieForm({resources, addMovie, updateMovie, checkConnetion, movies, persons}) {

    const {id: movieID} = useParams();
    const [movie, setMovie] = useState([]);
    const [badId, setbadID] = useState(movie.length > 0 ? (false):(true));
    const [popupContext, setPopupContext] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [initialvalues, setInitialvalues] = useState({
        title: '',
        genre: '',
        release_date: '',
        description: '',
        image_url: '',
        director_id: ''
    });
    const Validate = (value) => {if (!value) return resources['Form']['validate']}

    useEffect(() => {
        setbadID(true);
        if(movies){
            if(movies.length > 0){
                if(persons.length > 0){
                    setMovie(movies.filter(movie => movie.id === parseInt(movieID)));
                    if (movies.filter(movie => movie.id === parseInt(movieID)).length===1){
                        setInitialvalues({
                            title: movies.filter(movie => movie.id === parseInt(movieID))[0].title,
                            genre: movies.filter(movie => movie.id === parseInt(movieID))[0].genre,
                            release_date: movies.filter(movie => movie.id === parseInt(movieID))[0].release_date,
                            description: movies.filter(movie => movie.id === parseInt(movieID))[0].description,
                            image_url: movies.filter(movie => movie.id === parseInt(movieID))[0].image_url,
                            director_id: movies.filter(movie => movie.id === parseInt(movieID))[0].director_id
                        });
                        setbadID(false);
                    }
                    else{

                    }
                }
            }
        }
    }, [movies, persons])

    const handleSubmit = async (values,actions) => {
        values.director_id = parseInt(values.director_id)
        if (movieID){
            const put_values = values.director_id !== "" ? {
                id: parseInt(movieID),
                title: values.title,
                genre: values.genre,
                release_date: values.release_date,
                description: values.description,
                image_url: values.image_url,
                director_id: values.director_id} : {
                    id: parseInt(movieID),
                    title: values.title,
                    genre: values.genre,
                    release_date: values.release_date,
                    description: values.description,
                    image_url: values.image_url
                }
            const isConected = await checkConnetion();
            if (isConected==="OK"){
                const isOk =  await  updateMovie(put_values);
                if (isOk==="OK"){setPopupContext(resources['Form']['thanks_update_movie']);}
                else{setPopupContext(resources['Form']['error']);}
                setIsOpen(true);
                setInitialvalues({
                    title: put_values.title,
                    genre: put_values.genre,
                    release_date: put_values.release_date,
                    description: put_values.description,
                    image_url: put_values.image_url,
                    director_id: put_values.director_id
                })
            } else {
                setPopupContext(resources['Error']['500']);
                setIsOpen(true);
            }
        }
        else{
            const isConected = await checkConnetion();
            if (isConected==="OK"){
                const isOk =  await addMovie(values);
                if (isOk==="OK"){
                setPopupContext(resources['Form']['thanks_add_movie']);
                actions.resetForm({
                    title: '',
                    genre: '',
                    release_date: '',
                    description: '',
                    image_url: '',
                    director_id: ''});}
                else{setPopupContext(resources['Form']['error']);}
            } else {
                setPopupContext(resources['Error']['500']);
            }
            setIsOpen(true);
        }
    }

    return (
        <>
        { (persons.length>0 && (!badId || (badId && !movieID))) ? (
        <>
        <div id="col" className="form">
            <div className="nag">
            { movieID  ? (
                resources['Form']['edit_movie']
            ):(
                resources['Form']['add_movie']
            )}
            </div>
        <div className="content">
            <Formik
                initialValues={initialvalues}
                onSubmit={(values,actions) => handleSubmit(values,actions)}
                enableReinitialize = {true}>
                {({ errors, touched }) => (
                    <Form className="Form" id="col">
                        {resources['Form']['title']}
                        <Field type="text" name="title" id="pole" validate={Validate}/>
                        {errors.title && touched.title && <div className="valid_error">{errors.title}</div>}
                        {resources['Form']['genre']}
                        <Field component="select" name="genre" id="pole" placeholder="" validate={Validate}>
                            <option value="" id="pole"></option>
                            {Object.keys(resources['Form']['genres']).map(genre => [genre, resources['Form']['genres'][genre]])
                            .sort(function(a, b){if(a[1] < b[1]) { return -1; } if(a[1] > b[1]) { return 1; } return 0}).map( genre => (
                                <option value={genre[0]} id="pole">{genre[1]}</option>
                            ))}
                        </Field>
                        {errors.genre && touched.genre && <div className="valid_error">{errors.genre}</div>}
                        {resources['Form']['release_date']}
                        <DatePicker
                            name='release_date'
                            id="pole"
                            dateFormat='dd.MM.yyyy'
                            placeholder='dd.mm.yyyy'
                            className="date_picker"
                            required
                            validate={Validate}
                        />
                        {errors.release_date && touched.release_date && <div className="valid_error">{errors.release_date}</div>}
                        {resources['Form']['description']}
                        <Field as="textarea" name="description" id="pole" validate={Validate}/>
                        {errors.description && touched.description && <div className="valid_error">{errors.description}</div>}
                        {resources['Form']['movie_image_url']}
                        <Field type="text" name="image_url" id="pole"/>
                        {resources['Form']['director_id']}
                        <Field component="select" name="director_id" id="pole" placeholder="">
                            <option value="" id="pole"></option>
                            {persons.map((person => (
                                <option value={person.id} id="pole">{person.first_name} {person.last_name}</option>
                            )))}
                        </Field>
                        <div id="row">
                            { movieID  && 
                                <button id="pole">
                                    <Link to={`/movie/${movieID}`} className="cancle"> &#8617; {resources['Form']['cancle']}</Link>
                                </button>}
                            <button type="submit" id="pole">
                                {resources['Form']['submit']}
                            </button>
                        </div>
                    </Form>)}
            </Formik>
        </div>
            {isOpen && <Popup
                content={popupContext}
                handleClose={() => {setIsOpen(false)}}
            />}
        </div>
        </>
        ):(
            <NoPage resources={resources}/>
        )}
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
    addMovie,
    updateMovie,
    checkConnetion
}
  
export default connect(mapStateToProps, mapDispatchToProps)(MovieForm);