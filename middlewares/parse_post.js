import {parsePath} from "./parse_utils";

export function parsePost(req, res, next) {
    if (typeof req.body.data === 'undefined') {
        res.status(400).send({err: 'Please provide a data object in your body.'});
        return undefined;
    }

    let method = req.body.type === 'merge' ? 'union' : 'set';


    let {path, isBaseRequest} = parsePath(req);

    if (isBaseRequest) {
        res.status(400).send({err: 'You are not allowed to directly post to the root. Specify at least one level of key names.'});
        return undefined;
    }


    req.handlePost = (store) => {
        try {
            store[method](path, req.body.data);
            return {posted: store.get(path), path};
        } catch (e) {
            res.status(500).send({err: 'Error parsing request. Check that you have formed your path correctly.', path});
            return undefined;
        }
    };

    next();
}
