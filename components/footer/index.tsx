import { IoMdHeart } from "react-icons/io";

export const Footer = () => {
    <footer className="h-14 w-full flex items-center bg-gray-950">
        <span className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-gray-400">
            Made by 
            <strong className="font-medium"> 
            Eduardo falcao
            </strong>  
            With <IoMdHeart size={13} className="text-emerald-500" />
        </span>
    </footer>
};