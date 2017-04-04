import qs from 'qs';
import normalize from 'normalize-path';

const createRouter = () => {

    let listeners = [];
    let params = null;
    let query = null;

    // returns unsubscribe function
    const subscribe = (listener) => {
        listeners.push(listener);

        return () => {
            listeners = listeners.filter(l => l !== listener);
        }
    };

    const goto = (route, keepQuery = true) => {
        if (keepQuery) {
            route = `${route}${window.location.search}`;
        }

        window.history.pushState(null, "", route);
        window.onpopstate();
    };

    const back = () => {
        window.history.back();
    };

    const getCurrentRoute = () => normalize(window.location.pathname);

    const match = (route) => {
        params = getCurrentRoute().match(route);
        return !!params;
    };

    const isRoot = () => match(/^\/$/);

    const matchedParams = () => {
        return params;
    };

    const queryString = () => {
        return qs.parse(window.location.search.substr(1));
    };

    const hasQuery = () => {
        return Object.keys(queryString()).length > 0;
    };

    const setQueryString = (obj) => {
        query = { ...query, ...obj };
        let route = `${getCurrentRoute()}?${qs.stringify(query)}`;
        goto(route, false);
    };

    const dispatch = () => {
        window.onpopstate();
    };

    window.onpopstate = () => {
        listeners.forEach(listener => listener(window.location));
    };

    return { subscribe, goto, back, match, matchedParams, queryString, hasQuery, setQueryString, dispatch, isRoot, getCurrentRoute };
};

export default createRouter();