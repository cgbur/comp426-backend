import {parsePath} from "./parse_utils";

export function parseDelete(req, res, next) {
    if (req.path === '/') {
        res.status(400).send({err: 'You are not allowed to directly delete to the root. Specify at least one level of key names.'});
        return undefined;
    }


    let {path} = parsePath(req.path);

    req.handleDelete = (store) => {
        try {
            store.del(path);
            return {path, status: 'delete successful'};
        } catch (e) {
            res.status(500).send({err: 'Error parsing request. Check that you have formed your path correctly.'});
            return undefined;
        }

    };

    next();
}
