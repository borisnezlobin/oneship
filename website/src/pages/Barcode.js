import { useContext, useRef } from "react";
import { UserDataContext } from "../util/contexts";
import Barcode from 'react-barcode';
import { ERROR_TOAST_STYLES } from "../util/config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BarcodePage = () => {
    const nav = useNavigate();
    const { userData } = useContext(UserDataContext);
    const barcodeRef = useRef(null);

    const getValue = () => {
        // reliable af
        return "950" + userData.data.email.split("@")[0].slice(2);
    }

    if(!userData){
        return (
            <div className="m-0 md:ml-64 flex flex-col px-4 justify-center items-center h-full">
                <h1 className="bigText text-center">Log in to generate your barcode</h1>
                <hr className="w-4/5 my-4" />
                <p className="text-center">
                    In order to prevent people generating other people's barcodes,
                    we require you to have an account.
                </p>
                <div className="h-8" />
                <button className="btn mt-8" onClick={(e) => {
                    e.preventDefault();
                    nav("/login?continue=/barcode");
                }}>
                    Log in
                </button>
            </div>
        )
    }

    return (
        <div className="m-0 md:ml-64 flex flex-col px-4 justify-center items-center h-full">
            <h1 className="bigText">Your Barcode</h1>
            <Barcode ref={barcodeRef} value={getValue()} width={2} text="Made with OneShip" format="CODE39" />
            <hr className="w-4/5 my-4 mb-8" />
            <button className="btn mt-8" onClick={(e) => {
                e.preventDefault();
                toast.error("Nope. We're working on this.", ERROR_TOAST_STYLES)
            }}>
                Download
            </button>
        </div>
    );
}

export default BarcodePage;