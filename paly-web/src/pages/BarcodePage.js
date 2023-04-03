import React, { useRef, useState } from 'react'
import CONFIG, { DEFAULT_PAGE_STYLES } from '../util/config';
import Barcode from "react-barcode"

const BarcodePage = () => {
    const [studentId, setStudentId] = useState("");
    const canvasRef = useRef();

    const saveBarcode = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = 'barcode.png';
        console.log("link: " + canvas.renderElementRef.current.src.toString());
        link.href = canvas.renderElementRef.current.src.toString();
        link.click();
    }

    return (
        <div
            className="flex"
            style={{
                ...DEFAULT_PAGE_STYLES,
                textAlign: "center",
                justifyContent: "space-around"
            }}
        >
            <div>
                <p className='bigText'>
                    No ID card?
                </p>
                <p className='mediumText'>
                    You don't need it.
                </p>
            </div>
            <div className='flex' style={{
                borderRadius: 8,
                backgroundColor: "white",
                boxShadow: "0px 0px 5px grey",
                padding: 8
            }}>
                <Barcode
                    value={studentId.length === 0 ? "95042069" : studentId}
                    lineColor='black'
                    width={2}
                    format="CODE39"
                    font={"Montserrat Alternates"}
                    ref={canvasRef}
                    margin={window.innerWidth < CONFIG.NAVBAR_WIDTH + 500 ? 8 : 24}
                />
            </div>
            <div className='flex'>
                <input
                    style={{
                        outline: "none",
                        border: "1px solid var(--green)",
                        color: "var(--green)",
                        height: 48,
                        padding: "4px 16px",
                        width: "300px",
                        backgroundColor: "var(--bg)",
                        fontFamily: "Roboto, system-ui",
                        fontWeight: "bolder",
                        fontSize: "large",
                        textAlign: "center",
                        borderRadius: 8
                    }}
                    placeholder='Enter your student ID'
                    value={studentId}
                    maxLength={8}
                    onChange={(e) => setStudentId(e.target.value)}
                />
                <div style={{margin: 16}} />
                <div style={{ width: 200}} className='btn' onClick={saveBarcode}>
                    Download barcode
                </div>
            </div>
        </div>
    )
}

export default BarcodePage