export function parsePath(rawPath) {
    let path = rawPath.split('/');
    const isIndexRequest = path[path.length - 1].length === 0;
    path = path.slice(1, path.length - (isIndexRequest ? 1 : 0)).join('.');

    return {path, isIndexRequest};
}
