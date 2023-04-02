import { AppStoreLogo, GooglePlayLogo } from 'phosphor-react'
import React from 'react'
import { DEFAULT_PAGE_STYLES } from '../util/config'

const DownloadPage = () => {
    return (
        <div className='flex' style={DEFAULT_PAGE_STYLES}>
            <div className='flex' style={{
                flexDirection: "row",
                gap: 16,
            }}>
                <AppStoreLogo color='var(--green)' size={128} weight="thin" />
                <GooglePlayLogo color='var(--green)' size={128} weight="thin" />
            </div>
            <p className='bigText' style={{ fontWeight: "lighter" }}>
                There's going to be a mobile app!?
            </p>
        </div>
    )
}

export default DownloadPage