import React, { useRef, useState } from 'react'
import CONFIG from '../util/config';
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
            className="flex default-page"
            style={{
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
                border: "1px solid grey",
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
                        border: "none",
                        borderBottom: "2px solid var(--green)",
                        color: "var(--text)",
                        padding: "4px 16px",
                        width: "400px",
                        backgroundColor: "var(--bg)",
                        fontFamily: "monospace",
                        fontWeight: "bold",
                        fontSize: "xx-large",
                        textAlign: "center",
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