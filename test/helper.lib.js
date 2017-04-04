export const setCurrentUrl = (url) => {
    let parser = document.createElement('a');
    parser.href = url;

    ['protocol', 'hostname', 'port', 'pathname', 'search', 'hash', 'host'].forEach( (prop) => {
        Object.defineProperty(window.location, prop, {
            writable: true,
            value: parser[prop]
        });
    });
};