import {parsePath} from "./parse_utils";

export function parsePost(req, res, next) {
    if (typeof req.body.data === 'undefined') {
        res.status(400).send({err: 'Please provide a data object in your body.'});
        return undefined;
    }

    if (req.path === '/') {
        res.status(400).send({err: 'You are not allowed to directly post to the root. Specify at least one level of key names.'});
        return undefined;
    }

    let {path} = parsePath(req.path);

    req.handlePost = (store) => {
        try {
            store.set(path, req.body.data);
            return {posted: store.get(path), path};
        } catch (e) {
            res.status(500).send({err: 'Error parsing request. Check that you have formed your path correctly.'});
            return undefined;
        }

    };

    next();
}
