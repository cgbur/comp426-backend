export function userFilter(user, {blacklist = ['passwordHash']} = {}) {
    let {...copy} = user;
    blacklist.forEach(key => {
        delete copy[key];
    });
    return copy;
}
