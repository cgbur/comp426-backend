import escapeStringRegexp from "escape-string-regexp";

export function parsePath(req) {
    let path = escapeStringRegexp(req.path);

    path = path.split('/');
    const isIndexRequest = path[path.length - 1].length === 0;
    path = path.slice(1, path.length - (isIndexRequest ? 1 : 0)).join('.');

    path = decodeURIComponent(path);

    let isUserRequest = false;
    let userName = false;
    if (req.baseUrl === '/user' && req.user.name) {
        userName = req.user.name;
        isUserRequest = true;
        path = `${req.user.name}.${path}`;
    }
    return {path, isIndexRequest, isBaseRequest: req.path === '/', userName, isUserRequest};
}
