import { useContext } from "react";
import { AddSiteModalContext } from "../context/AddSiteModalContext";

export const useAddSiteModal = () => {
    const context = useContext(AddSiteModalContext)
    if (!context) {
        throw new Error('useAddSiteModal must be used withing AddSiteModalProvider')
    }
    return context;
}