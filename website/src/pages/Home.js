import React from 'react'
import GenerativeArt from '../components/generativeart/GenerativeArt'
import logo from '../logo.svg'
import { toast } from 'react-hot-toast'
import { ERROR_TOAST_STYLES, SUCCESS_TOAST_STYLES } from '../util/config'

const HomePage = () => {
  return (
    <>
      {window.innerWidth >= 750 ? <GenerativeArt /> : <></>}
      <div className='m-0 h-full flex flex-col justify-center items-center md:ml-64'>
            <img src={logo} className="h-48 w-48 md:w-64 md:h-64" alt="logo" />
            <p className='bigText'>
                OneShip
            </p>
            <p style={{ padding: 4, textAlign: "center", paddingBottom: 0 }}>
                The official unofficial web app of the Palo Alto High School Vikings
            </p>
            <br />
            <div style={{
                width: "80%",
                border: "none",
                height: 1,
                backgroundColor: "grey",
                margin: 32,
                borderRadius: 1024,
            }} />
            <a href="https://discord.gg/nDDBXnyYw2" target="blank" className='btn'>
                Join our Discord!
            </a>
            <p style={{ marginTop: 24, marginBottom: 0 }}>
                
            </p>
            <button className='link' onClick={() => {
                window.open("https://github.com/Rand0mLetters/oneship");
            }}>
                View the code on GitHub
            </button>
      </div>
      <div className='absolute bottom-0 right-0 p-4'>
        <p>
          Copyright Boris Nezlobin 2022+
        </p>
      </div>
    </>
  )
}

export default HomePage