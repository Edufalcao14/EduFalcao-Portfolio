import { IoMdHeart } from "react-icons/io";

export const Footer = () => {
    return (
        <footer className="relative z-10 h-14 w-full flex items-center justify-center bg-gray-950 overflow-hidden">
            <span className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-gray-400">
                Made  with <IoMdHeart size={13} className="text-emerald-500" />
                by
                <strong className="font-medium">Eduardo Falcao</strong>
            </span>
        </footer>
    )
};