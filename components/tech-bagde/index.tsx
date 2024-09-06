type TechBagdeProps  = {
    name : string;
}


export const TechBagde = ({ name } : TechBagdeProps) => {
    return(
       
        <span className="text-emerald-400 bg-emerald-900/80 text-sm py-1 px-3 rounded-lg hover:text-white shadow-badge cursor-default">
            {name}
        </span>
    )

}