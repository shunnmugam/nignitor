function env(name, value) {
    if(value) {
        process.env[name] = value;
    }

    return process.env[name];
}

module.exports = env;