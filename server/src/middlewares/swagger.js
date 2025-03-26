export const swaggerOptions = {   
   definition: {
       openapi: '3.0.0',
       info: {
           title: 'API of LawyerAppointment',
           version: '1.0.0',
           description: 'API documentation for the application of Lawyer Appointment',
       },
       servers: [
           {
              url: 'http://localhost:5000',
           },
       ],
       components: {
           securitySchemes: {
               BearerAuth: {
                   type: 'http',
                   scheme: 'bearer',
                   bearerFormat: 'JWT',
               },
           },
       },
       security: [
           {
               BearerAuth: [],
           },
       ],
   },
   apis: [
       './src/controllers/appointment/lawyer/appointmentController.js',
       './src/controllers/appointment/user/appointmentController.js',
       './src/controllers/lawyer/lawyerController.js',
       './src/controllers/login/loginController.js',
       './src/controllers/user/userController.js',
   ],
};
