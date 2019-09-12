import {parsePath} from "./parse_utils";

export function parseGet(req, res, next) {
    if (req.path === '/') {
        req.handleGet = (store) => {
            return Object.keys(store.data);
        };
        next();
        return;
    }

    let {path, isIndexRequest} = parsePath(req.path);

    req.handleGet = (store) => {
        try {
            const result = store.get(path);
            if (typeof result === 'undefined') {
                res.status(404).send({err: `Resource ${isIndexRequest ? 'index ' : ''}does not exist`});
                return undefined;
            }
            return isIndexRequest ? Object.keys(result) : result;
        } catch (e) {
            res.status(500).send({err: 'Error parsing request. Check that you have formed your path correctly.'});
            return undefined;
        }

    };

    next();
}
