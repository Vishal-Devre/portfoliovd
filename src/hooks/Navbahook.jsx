import { useState, useEffect } from 'react';
const useNavbar = (initialState = true) => {
    const [navbarVisible, setNavbarVisible] = useState(initialState);
    const [formFocused, setFormFocused] = useState(false);
    useEffect(() => {
        if (formFocused) {
            setNavbarVisible(false);
        } else {
            setNavbarVisible(true);
        }
    }, [formFocused]);

    return { navbarVisible, setFormFocused };
};

export default useNavbar;