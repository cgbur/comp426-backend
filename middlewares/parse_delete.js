import {parsePath} from "./parse_utils";

export function parseDelete(req, res, next) {
    let {path, isBaseRequest, isUserRequest, userName} = parsePath(req);

    if (isBaseRequest) {
        req.handleDelete = (store) => {
            if (isUserRequest) {
                const result = store.del(userName);
                return {status: 'Successfully deleted user store.'};
            }
            store.clear();
            return {status: 'Successfully deleted entire store.'};
        };
        next();
        return;
    }

    req.handleDelete = (store) => {
        try {
            if (typeof store.get(path) === 'undefined') {
                res.status(400).send({err: `Resource doesn't exist`, path});
                return undefined;
            }
            store.del(path);
            return {path, status: 'delete successful'};
        } catch (e) {
            res.status(500).send({err: 'Error parsing request. Check that you have formed your path correctly.', path});
            return undefined;
        }

    };

    next();
}
