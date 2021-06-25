import React from "react";

const Link = ({ className, href, children }: {className: string, href: string, children: any}) => {
    const onClick = (event: any) => {
        event.preventDefault();
        window.history.pushState({}, "", href);
        const navEvent = new PopStateEvent('popstate');
        window.dispatchEvent(navEvent);
    };

    return (
        <a className={className} href={href} onClick={onClick}>
            {children}
        </a>
    );
};

export default Link;