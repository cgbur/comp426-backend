import {parsePath} from "./parse_utils";

export function parseGet(req, res, next) {
    let {path, isIndexRequest, isBaseRequest, userName, isUserRequest} = parsePath(req);

    if (isBaseRequest) {
        req.handleGet = (store) => {
            if (isUserRequest) {
                const result = store.get(userName);
                if (typeof result === 'undefined') {
                    return [];
                }
                return Object.keys(result);
            }
            return Object.keys(store.data);
        };
        next();
        return;
    }

    req.handleGet = (store) => {
        try {
            const result = store.get(path);
            if (typeof result === 'undefined') {
                res.status(404).send({err: `Resource ${isIndexRequest ? 'index ' : ''}does not exist`, path});
                return undefined;
            }
            return isIndexRequest ? Object.keys(result) : result;
        } catch (e) {
            res.status(500).send({err: 'Error parsing request. Check that you have formed your path correctly.', path});
            return undefined;
        }

    };

    next();
}
