// wtf is good naming??
// basically a true/false czechbox input

import Switch from "react-switch";

const TFInput = ({ value, cb, title, description, error="" }) => {
    const funy = (e, checked, id) => {
        var funyE = {
            preventDefault: () => {},
            target: {
                checked: !value
            }
        };

        cb(funyE);
    }

    return (
        <div className={
            "w-full m-2 p-4 flex flex-col md:flex-row justify-between items-center rounded " +
            (error ? "border border-red-900" : "border border-white")
        }>
                <div className="w-full md:w-2/3 flex flex-col justify-start items-start">
                    <p className="mediumText">
                        {title}
                    </p>
                    <p>
                        {description}
                    </p>
                </div>
                <div style={{
                    height: "100%",
                    width: "1px",
                    backgroundColor: "#e5e7eb",
                }} />
                <div className="w-full md:w-1/3 mt-2 md:m-0 flex justify-center items-center">
                    <Switch
                        onChange={funy}
                        checked={value}
                        onColor="#1c8000"
                        offColor="#888"
                        checkedIcon={false}
                        uncheckedIcon={false}
                    />
                </div>
            </div>
    );
}

export default TFInput;