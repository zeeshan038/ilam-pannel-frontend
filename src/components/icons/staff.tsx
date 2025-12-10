

const StaffIcon = ({width , height} : {width : number , height : number}) => {
    console.log(width , height)
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="32" cy="20" r="12" fill="black" />

            <circle cx="16" cy="24" r="10" fill="black" />

            <circle cx="48" cy="24" r="10" fill="black" />
            <path
                d="M18 56C18 44.954 24.268 36 32 36C39.732 36 46 44.954 46 56V60H18V56Z"
                fill="black"
            />
            <path
                d="M4 56C4 47 9.373 40 17 40H20C24.971 40 29 44.029 29 49V60H4V56Z"
                fill="black"
            />
            <path
                d="M60 56C60 47 54.627 40 47 40H44C39.029 40 35 44.029 35 49V60H60V56Z"
                fill="black"
            />
        </svg>

    );
};

export default StaffIcon;