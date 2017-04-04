import React from 'react';

const handleLink = (router) => (to, queryTo, onClick, keepQuery) => event => {
    event.preventDefault();
    if (onClick) {
        onClick(event);
    }

    if (to) {
        router.goto(to, keepQuery);
    }

    if (queryTo) {
        router.setQuery(queryTo);
    }
};

const Link = ({ to, onClick, keepQuery, queryTo, children, router, ...props}) => (
    <a href={to || "/"}
        onClick={handleLink(router)(to, queryTo, onClick, keepQuery)}
        {...props}>
        {children}
    </a>
);

Link.propTypes = {
    to: React.PropTypes.string,
    keepQuery: React.PropTypes.any
};
