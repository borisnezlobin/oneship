import React, { useRef, useState } from 'react'
import { DEFAULT_PAGE_STYLES } from '../util/config';
import Barcode from "react-barcode"

const BarcodePage = () => {
    const [studentId, setStudentId] = useState("95000000");
    const canvasRef = useRef();

    const saveBarcode = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = 'barcode.png';
        console.log(canvas.renderElementRef.current);
        link.href = canvas.renderElementRef.current.src;
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
                backgroundColor: "white"
            }}>
                <Barcode
                    value={studentId}
                    lineColor='black'
                    width={3}
                    format="CODE39"
                    font={"Montserrat Alternates"}
                    ref={canvasRef}
                    margin={24}
                />
            </div>
            <div className='flex'>
                <input
                    style={{
                        outline: "none",
                        border: "1px solid var(--green)",
                        color: "var(--green)",
                        height: 48,
                        padding: "8px 16px",
                        width: "300px",
                        backgroundColor: "var(--dark-blue)",
                        fontFamily: "'Montserrat Alternates', monospace",
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