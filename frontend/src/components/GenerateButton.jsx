import { generatePassword } from "../utils/passwordGenerator";
import toast from "react-hot-toast";
import bolt from "../assets/icons/bolt.svg"

/**
 * GenerateButton
 *
 * A small icon button that sits next to a password input.
 * One click generates a strong password and calls onGenerate(pw).
 *
 * Props:
 *   onGenerate(pw: string) — called with the new password
 *   className              — extra classes on the button
 */
const GenerateButton = ({ onGenerate, className = "" }) => {
    const handleClick = () => {
        const pw = generatePassword({
            length: 16,
            uppercase: true,
            lowercase: true,
            digits: true,
            symbols: true,
        });
        onGenerate(pw);
        toast.success("Strong password generated!", { duration: 1800 });
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            title="Generate strong password"
            className={`flex items-center justify-center w-8 h-8 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors ${className}`}
        >
            {/* Dice / shuffle icon */}
            <img src={bolt} alt="Generate Strong Password" className="w-5 theme-icon"/>
        </button>
    );
};

export default GenerateButton;
