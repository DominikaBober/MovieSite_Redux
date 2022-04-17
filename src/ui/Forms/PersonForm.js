import './Forms.scss';
import {Formik, Form, Field} from "formik";
import { useEffect, useState } from "react";
import {DatePicker} from "react-formik-ui";
import { useParams, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Popup from "../popup.js";
import NoPage from '../no_page';


import { getMovies } from '../../ducks/Movies/selectors';
import { getPersons } from '../../ducks/Persons/selectors';
import { updatePerson } from '../../ducks/Persons/operations';
import { addPerson } from '../../ducks/Persons/operations';

function PersonForm ({resources, addPerson, updatePerson, movies, persons}) {

    const {id: personID} = useParams();
    const [person, setPerson] = useState([]);
    const [badId, setbadID] = useState(person.length > 0 ? (false):(true));
    const [popupContext, setPopupContext] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [initialvalues, setInitialvalues] = useState({
        first_name: '',
        last_name: '',
        birth_date: '',
        image_url: '',
        nationality: ''
    });
    const Validate = (value) => {if (!value) return resources['Form']['validate']}
    

    useEffect(() => {
        setbadID(true);
        if(movies){
            if(movies.length > 0){
                if(persons.length > 0){
                    setPerson(persons.filter(person => person.id === parseInt(personID)));
                    if (persons.filter(person => person.id === parseInt(personID)).length===1){
                        setInitialvalues({
                            first_name: persons.filter(person => person.id === parseInt(personID))[0].first_name ,
                            last_name: persons.filter(person => person.id === parseInt(personID))[0].last_name,
                            birth_date: persons.filter(person => person.id === parseInt(personID))[0].birth_date,
                            image_url: persons.filter(person => person.id === parseInt(personID))[0].image_url,
                            nationality: persons.filter(person => person.id === parseInt(personID))[0].nationality
                        });
                        setbadID(false);
                    }
                }
            }
        }
    }, [movies, persons])

    const handleSubmit = async (values,actions) => {
        if (personID){
            const put_values = {
                id: parseInt(personID),
                first_name: values.first_name,
                last_name: values.last_name,
                birth_date: values.birth_date,
                image_url: values.image_url,
                nationality: values.nationality};
            await updatePerson(put_values);
            setPopupContext(resources['Form']['thanks_update_person']);
            setIsOpen(true);
            setInitialvalues({
                first_name: put_values.first_name,
                last_name: put_values.last_name,
                birth_date: put_values.birth_date,
                image_url: put_values.image_url,
                nationality: put_values.nationality})
        }
        else{
            const new_id = persons.sort(function(a, b){if(a.id < b.id) { return 1; } else return -1})[0].id + 1;
            const put_values = {
                id: new_id,
                first_name: values.first_name,
                last_name: values.last_name,
                birth_date: values.birth_date,
                image_url: values.image_url,
                nationality: values.nationality};
            await addPerson(put_values);
            setPopupContext(resources['Form']['thanks_add_person']);
            actions.resetForm({
                first_name: '',
                last_name: '',
                birth_date: '',
                image_url: '',
                nationality: ''});
            setIsOpen(true);
        }
    }

    return (
        <>
        { ((!personID || (!badId && personID))) ? (
        <>
        <div id="col" className="form">
            <div className="nag">
                {person.length === 1 ? (resources['Form']['edit_person']):(resources['Form']['add_person'])}
            </div>
        <div className="content">
            <Formik
                initialValues={initialvalues}
                onSubmit={(values,actions) => handleSubmit(values,actions)}
                enableReinitialize = {true}>
                {({ errors, touched, isValidating }) => (
                    <Form className="Form" id="col">
                        {resources['Form']['first_name']}
                        <Field name="first_name" id="pole" validate={Validate}/>
                        {errors.first_name && touched.first_name && <div className="valid_error">{errors.first_name}</div>}
                        {resources['Form']['last_name']}
                        <Field name="last_name" id="pole" validate={Validate}/>
                        {errors.last_name && touched.last_name && <div className="valid_error">{errors.last_name}</div>}
                        {resources['Form']['birth_date']}
                        <DatePicker
                            name='birth_date'
                            id="pole"
                            dateFormat='dd.MM.yyyy'
                            placeholder='dd.mm.yyyy'
                            className="date_picker"
                            required
                            validate={Validate}
                        />
                        {errors.birth_date && touched.birth_date && <div className="valid_error">{errors.birth_date}</div>}
                        {resources['Form']['person_image_url']}
                        <Field name="image_url" id="pole"/>
                        {resources['Form']['nationality']}
                        <Field name="nationality" id="pole" validate={Validate}/>
                        {errors.nationality && touched.nationality && <div className="valid_error">{errors.nationality}</div>}
                        <div id="row">
                            { person.length === 1 && 
                                <button id="pole">
                                    <Link to={`/person/${personID}`} className="cancle">&#8617; {resources['Form']['cancle']}</Link>
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

const mapDispatchToProps = ({
    addPerson,
    updatePerson
});


export default connect(mapStateToProps, mapDispatchToProps)(PersonForm);
