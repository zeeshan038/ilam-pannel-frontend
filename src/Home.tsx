import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="flex items-center justify-center h-screen">

            <Link to="/login" className="text-3xl text-black font-bold">
                Login
            </Link>

        </div>
    );
};


export default Home