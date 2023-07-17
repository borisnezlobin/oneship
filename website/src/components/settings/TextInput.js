const TextInput = ({ value, placeholder, cb, title, description, error="" }) => {
    return (
        <div className={
            "w-full m-2 p-4 pb-2 flex flex-col md:flex-row justify-between items-center rounded " +
            (error ? "border border-red-900" : "border border-white")
        }>
                <div className="w-full md:w-2/3 flex flex-col justify-start items-start">
                    <p className="mediumText">
                        {title}
                    </p>
                    <p>
                        {description}
                    </p>
                    <p className="text-red-900 text-sm">
                        {error ? error : <br />}
                    </p>
                </div>
                <div style={{
                    height: "100%",
                    width: "1px",
                    backgroundColor: "#e5e7eb",
                }} />
                <div className="w-full md:w-1/3 p-0 md:pl-8">
                    <input
                        type="text"
                        value={value}
                        onChange={cb}
                        placeholder={placeholder}
                        className="input"
                    />
                </div>
            </div>
    );
}

export default TextInput;