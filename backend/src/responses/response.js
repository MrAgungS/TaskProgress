const response = ( status, message, data,  res ) => {
    res.status(status).json({
        success: status >= 200 && status < 300,
        message,
        data,
    });
}


export default response