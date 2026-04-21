import { createContext, useContext, useState } from "react";
import PasswordGeneratorModal from "../components/PasswordGeneratorModal";

const GeneratorModalContext = createContext(null);

export const GeneratorModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <GeneratorModalContext.Provider
            value={{ openGeneratorModal: () => setIsOpen(true) }}
        >
            {children}
            <PasswordGeneratorModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </GeneratorModalContext.Provider>
    );
};

export const useGeneratorModal = () => {
    const ctx = useContext(GeneratorModalContext);
    if (!ctx) throw new Error("useGeneratorModal must be used inside GeneratorModalProvider");
    return ctx;
};