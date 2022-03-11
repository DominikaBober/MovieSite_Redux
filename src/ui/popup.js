const Popup = props => {
    return (
        <div className="popup-box">
            <div className="box">
                <span className="close-icon" onClick={props.handleClose}>&#10006;</span>
                {props.content}
            </div>
        </div>
    );
};

export default Popup