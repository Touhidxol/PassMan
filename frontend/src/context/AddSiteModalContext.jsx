import { createContext, useContext, useState } from 'react';

export const AddSiteModalContext = createContext();

export const AddSiteModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openWindow = () => setIsOpen(true);
    const closeWindow = () => setIsOpen(false);

    return (
        <AddSiteModalContext.Provider value={{ isOpen, openWindow, closeWindow }}>
            {children}
        </AddSiteModalContext.Provider>
    );
};
