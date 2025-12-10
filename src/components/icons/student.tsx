
const StudentIcon = ({width, height}: {width: number; height: number}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="12" cy="7" r="5" fill="black" />
            <path
                d="M4 22C4 16.48 7.58 13 12 13C16.42 13 20 16.48 20 22H4Z"
                fill="black"
            />
        </svg>

    );
};

const ViewStudentIcon = () => {
    return (
        <StudentIcon width={20} height={20} />
    );
};

const AddStudentIcon = () => {
    return (
        <StudentIcon width={20} height={20} />
    );
};


export {
    StudentIcon,
    ViewStudentIcon,
    AddStudentIcon
}