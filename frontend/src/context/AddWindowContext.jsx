import { createContext, useContext, useState } from 'react';

const AddWindowContext = createContext();

export const useAddWindow = () => useContext(AddWindowContext);

export const AddWindowProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openWindow = () => setIsOpen(true);
    const closeWindow = () => setIsOpen(false);

    return (
        <AddWindowContext.Provider value={{ isOpen, openWindow, closeWindow }}>
            {children}
        </AddWindowContext.Provider>
    );
};
