import './Forms.scss';

import MovieForm from './MovieForm';
import PersonForm from './PersonForm';
// import ActorForm from './ActorForm';

const Forms = ({store, resources}) => {

    return (
        <div className="forms">
            {/* <ActorForm store={store} resources={resources} ActorSubmit='ADD'/> */}
            <MovieForm store={store} resources={resources}/>
            <div id="col" className="form">
                <PersonForm store={store} resources={resources}/>
                <div className="nag" id="add_director">{resources['Form']['add_director']}</div>
            </div>
        </div>
    )

}

export default Forms;