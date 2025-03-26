import response
 from "./response.js";
export const verifyRole = (allowedRoles) => {
   return (req, res, next) => {
       if (!req.user || !allowedRoles.includes(req.user.role)) {
           return response.errorResponse(res, 'Access Denied: Unauthorized Role');
       }
       next();
   };
};
