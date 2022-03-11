const NoPage = ({resources}) => {
    return (
        <div className="content_2" id="error">
            <div className="text">
                {resources['Error']['404']}
            </div>
        </div>
    );
};

export default NoPage