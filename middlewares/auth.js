import * as jwt from "jsonwebtoken";

export async function authenticateUser(req, res, next) {
    if (!req.token) {
        return res.status(401).send({
            error: 'Authorization header not sent. This route requires the user to authenticate.' +
                ' If you passed a jwt token, make sure it is a \'Bearer\' token.',
            example: 'inside authorization header: Bearer jws.token.here'
        })
    }

    try {
        req.user = jwt.verify(req.token, process.env.SECRET_KEY);
        next();
    } catch (e) {
        res.status(401).send({err: 'Invalid or expired jwt token.'})
    }
}
