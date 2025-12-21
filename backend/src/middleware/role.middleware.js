import response from '../responses/response.js'

const roleMiddleware = (roles = []) =>{
    return (req, res, next) =>{
        if (!roles.includes(req.user.role)) {
            return response(403,"Access Denied", null, res) 
        }
        next()
    }
}

export default roleMiddleware