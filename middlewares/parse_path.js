export function parsePath(req, res, next) {
    if (req.path === '/') {
        req.storeMutate = (store) => {
            return Object.keys(store.data);
        };
        next();
        return;
    }

    let path = req.path.split('/');

    try {
        const isIndexRequest = path[path.length - 1].length === 0;
        path = path.slice(1, path.length - (isIndexRequest ? 1 : 0)).join('.');

        req.storeMutate = isIndexRequest ?
            (store) => {
                return Object.keys(store.get(path));
            }
            :
            (store) => {
                return store.get(path);
            };
        next();
    } catch (e) {
        res.status(500).send({err: 'Something went wrong when trying to parse the url.'})
    }

}
