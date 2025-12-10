
const FilterIcon = ({ width, height }: { width: number; height: number }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 5C4 4.4 4.4 4 5 4H19C19.6 4 20 4.4 20 5C20 5.3 19.9 5.6 19.7 5.8L14 13V20L10 18V13L4.3 5.8C4.1 5.6 4 5.3 4 5Z"
                fill="black"
            />
        </svg>

    );
};

export { FilterIcon };