import spinner from "../loading.svg";

const LoadingSpinner = ({ styles }) => {
    return (
        <div className={"flex flex-col items-center justify-center w-256 " + styles}>
            <img
                src={spinner}
                alt="loading"
                className="h-16 w-16"
            />
        </div>
    );
}

export default LoadingSpinner;