const response = {
   successResponse: (res, message, data = {}) => {
       const statusCode = 200; // Default status code for success
       return res.status(statusCode).json({
           success: true,
           message: message,
           data: data
       });
   },
   errorResponse: (res, message) => {
       if (!res || typeof res.status !== 'function') {
        //    console.error("Invalid response object passed:", res);
           throw new Error("Invalid response object in errorResponse");
       }
       const statusCode = 400;
       return res.status(statusCode).json({
           success: false,
           message: message
       });
   },
};

export default response;
