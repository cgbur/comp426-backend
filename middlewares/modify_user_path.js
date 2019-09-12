export function modifyUserPath(req, res, next) {
    req.requestPath = `${req.user.name}/${req.requestPath}`;
    next();
}
