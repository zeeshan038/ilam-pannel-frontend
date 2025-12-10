
const GrossSalaryIcon = ({ width, height }: { width: number; height: number }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="14" rx="2" fill="black" />
            <rect x="5" y="7" width="14" height="8" rx="2" fill="white" />
            <circle cx="12" cy="11" r="3" fill="black" />
        </svg>

    );
};

const NetSalaryIcon = ({ width, height }: { width: number; height: number }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7C3 5.9 3.9 5 5 5H19C20.1 5 21 5.9 21 7V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V7Z" fill="black" />
            <circle cx="12" cy="12" r="4" fill="white" />
            <path d="M10.8 12.3L12 13.5L14 11.5" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>


    );
};


const DeductionIcon = ({ width, height }: { width: number; height: number }) => {
    return (

        <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="black" />
            <rect x="7" y="11" width="10" height="2" rx="1" fill="white" />
        </svg>



    );
};

const Bonuses = ({ width, height }: { width: number; height: number }) => {
    return (
        <svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.5 8H21L16 12L18 18L12 14.5L6 18L8 12L3 8H9.5L12 2Z" fill="black" />
        </svg>

    );
};


export { GrossSalaryIcon, NetSalaryIcon, DeductionIcon, Bonuses };