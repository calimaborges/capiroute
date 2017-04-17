import React from 'react';
import { string, object, bool } from 'prop-types';
import { router } from './';

const handleLink = (to, queryTo, onClick, keepQuery) => event => {
    event.preventDefault();
    if (onClick) {
        onClick(event);
    }

    if (to)
        router.goto(to, keepQuery);

    if (queryTo)
        router.setQueryString(queryTo);
};

const Link = ({ to, onClick, keepQuery, queryTo, children, ...props}) => (
    <a href={to || "/"}
        onClick={handleLink(to, queryTo, onClick, keepQuery)}
       {...props}>
        {children}
    </a>
);

Link.propTypes = {
    to: string,
    queryTo: object,
    keepQuery: bool
};

export default Link;