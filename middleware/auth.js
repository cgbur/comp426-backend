export async function authorizeUser(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(401).send({error: 'Authorization header not sent.'})
    }

    req.user = {name: 'name', id: 0};
    next();
}
