const response = ( statusCode, message, data,  res ) => {
    res.status(statusCode).json({
        success: statusCode < 400,
        message,
        data,
    });
}


export default response