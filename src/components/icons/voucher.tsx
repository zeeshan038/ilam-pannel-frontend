
const Voucher = ({ width, height }: { width: number; height: number }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M6 2L7.5 3.5L9 2L10.5 3.5L12 2L13.5 3.5L15 2L16.5 3.5L18 2V22L16.5 20.5L15 22L13.5 20.5L12 22L10.5 20.5L9 22L7.5 20.5L6 22V2Z"
                fill="black"
            />

            <rect x="8" y="7" width="8" height="2" rx="1" fill="white" />
            <rect x="8" y="11" width="8" height="2" rx="1" fill="white" />
            <rect x="8" y="15" width="8" height="2" rx="1" fill="white" />
        </svg>


    );
};


const BulkVoucher = ({ width, height }: { width: number; height: number }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect x="3" y="4" width="18" height="17" rx="2" fill="black" />
            <rect x="3" y="4" width="18" height="4" fill="white" />
            <rect x="7" y="3" width="2" height="3" fill="black" />
            <rect x="15" y="3" width="2" height="3" fill="black" />
            <path
                d="M8 10L9 11L10 10L11 11L12 10L13 11L14 10L15 11L16 10V17L15 16L14 17L13 16L12 17L11 16L10 17L9 16L8 17V10Z"
                fill="white"
            />
            <rect x="10" y="12" width="4" height="1.4" rx="0.7" fill="black" />
            <rect x="10" y="14.5" width="4" height="1.4" rx="0.7" fill="black" />
        </svg>


    );
};



export { Voucher, BulkVoucher };