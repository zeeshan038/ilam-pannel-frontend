
const Fees = ({ width, height }: { width: number; height: number }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >

            <rect x="2" y="6" width="20" height="12" rx="2" fill="black" />

            <circle cx="8" cy="12" r="3" fill="white" />
            <path
                d="M7.1 12.1L8 13L9.6 11.4"
                stroke="black"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
            />

            <rect x="14" y="10" width="2" height="6" rx="0.5" fill="white" />
            <rect x="17" y="8" width="2" height="8" rx="0.5" fill="white" />
        </svg>

    );
};

const FeeUnfilled = ({ width, height }: { width: number; height: number }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="black"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >

            <rect x="2" y="6" width="20" height="12" rx="2" />

            <circle cx="8" cy="12" r="3" />

            <path d="M7 12.2L8 13.2L9.5 11.5" />

            <rect x="14" y="10" width="2" height="6" rx="1" stroke="black" fill="none" />
            <rect x="17" y="8" width="2" height="8" rx="1" stroke="black" fill="none" />
        </svg>


    );
};

const Overdue = ({ width, height }: { width: number; height: number }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 2L3 7V12C3 17 7 21.5 12 22C17 21.5 21 17 21 12V7L12 2Z"
                fill="black"
            />

            <rect x="11" y="8" width="2" height="7" fill="white" />
            <circle cx="12" cy="17" r="1.3" fill="white" />
        </svg>

    );
};

const PaidFees = ({ width, height }: { width: number; height: number }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="2" y="6" width="20" height="12" rx="2" fill="black" />
            <circle cx="12" cy="12" r="4" fill="white" />
            <path
                d="M10.8 12.2L12 13.4L14 11.4"
                stroke="black"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>


    );
};

const Balance = ({ width, height }: { width: number; height: number }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3 7C3 5.9 3.9 5 5 5H19C20.1 5 21 5.9 21 7V17C21 18.1 20.1 19 19 19H5C3.9 19 3 18.1 3 17V7Z"
                fill="black"
            />
            <circle cx="12" cy="12" r="4" fill="white" />
            <text
                x="12"
                y="13.5"
                font-size="3.4"
                font-family="Arial, sans-serif"
                font-weight="bold"
                text-anchor="middle"
                fill="black"
            >
                PKR
            </text>
        </svg>


    );
};
export { Fees, FeeUnfilled, Overdue, PaidFees, Balance };




