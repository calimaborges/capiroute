import React from 'react';
import router from './';

const handleLink = (to, queryTo, onClick, keepQuery) => event => {
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

const Link = ({ to, onClick, keepQuery, queryTo, children, ...props}) => (
<a href={to || "/"}
onClick={handleLink(to, queryTo, onClick, keepQuery)}
{...props}>
{children}
</a>
);

Link.propTypes = {
    to: React.PropTypes.string,
    keepQuery: React.PropTypes.any
};

export default Link;