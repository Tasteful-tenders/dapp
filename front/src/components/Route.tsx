import React, {useEffect, useState} from "react";

function Route({path, children}: {path: string, children: JSX.Element}) {
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    useEffect(() => {
        const onLocationChange = () => {
            setCurrentPath(window.location.pathname);
        }
        window.addEventListener('popstate', onLocationChange);
        return () => {
            window.removeEventListener('popstate', onLocationChange)
        };
    }, []);

    return currentPath === path ? children : null
}

export default Route;