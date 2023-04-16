import React from 'react'
import CONFIG from '../util/config'
import qrCode from "./AndroidOneShip.svg";
import { DownloadSimple } from 'phosphor-react';

const DownloadPage = () => {
    return (
        <div className='flex default-page'>
            <img
                alt="QR Code"
                src={qrCode}
                width={256}
                height={256}
            />
            <div style={{margin: 16}} />
            <a
                className='btn flex'
                href={CONFIG.SERVER_URL + "/assets/internal/PalyOneShip.apk"}
                download="OneShip.apk"
                style={{ flexDirection: "row", gap: 16 }}
            >
                <DownloadSimple color='white' size={32} style={{ flexShrink: 0 }} />
                <p>
                    Download a preview
                </p>
            </a>
            <p className='mediumText' style={{ padding: 32 }}>
                Currently only available for Android, the OneShip app is constantly evolving.
                <br />
                Try it out!
            </p>
        </div>
    )
}

export default DownloadPage