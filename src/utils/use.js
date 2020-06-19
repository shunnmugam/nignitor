var nameSpaces = {
    use: use
};
function use(namespace , value) {
    if(value !== undefined) {
        bindNameSpace(namespace, value)
    }
    if(nameSpaces[namespace]) {
        return nameSpaces[namespace];
    } 
    return null;

}

const bindNameSpace = function(namespace, value) {
    if(nameSpaces[namespace]) {
        throw Error('namespace already avialble');
    } else {
        nameSpaces[namespace] = value;
    }
}

global.use = use;