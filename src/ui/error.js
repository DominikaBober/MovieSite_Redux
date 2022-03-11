const Error = ({resources}) => {
    return (
        <div className="content_2" id="error">
            <div className="text">
                {resources['Error']['500']}
            </div>
        </div>
    );
};

export default Error