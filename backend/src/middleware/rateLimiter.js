import rateLimit from "express-rate-limit"
// At this stage, Redis packages are not being used and will be considered in future development.

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message : {
        status: 429,
        massage : 'To many request'
    },
})

export default rateLimiter