import React from 'react'
import CONFIG, { SUCCESS_TOAST_STYLES } from '../util/config'
import { Anchor } from 'phosphor-react'
import { toast } from 'react-hot-toast'
import GenerativeArt from '../components/codethaticopied/GenerativeArt'

const HomePage = () => {
  return (
    <>
      {window.innerWidth >= 750 ? <GenerativeArt /> : <></>}
      <div className='flex default-page'>
          <Anchor color="var(--green)" size={128} />
          <p className='bigText'>
              OneShip
          </p>
          <p>
            The official unofficial web app of the Palo Alto High School Vikings
          </p>
          <br />
          <div style={{
            width: window.innerWidth - CONFIG.NAVBAR_WIDTH - 100,
            border: "none",
            height: 1,
            backgroundColor: "grey",
            margin: 32,
            borderRadius: 1024,
          }} />
          <div className='btn' onClick={() => {
            window.open("https://discord.gg/CVHr8mKJeC");
          }}>
            Like it? Join our Discord!
          </div>
          <p style={{ marginTop: 24, marginBottom: 0 }}>
            Or
          </p>
          <p className='link' onClick={() => {
              navigator.clipboard.writeText("https://discord.gg/CVHr8mKJeC");
              toast("Link copied!", SUCCESS_TOAST_STYLES);
          }}>
            Copy the invite link
          </p>
      </div>
    </>
  )
}

export default HomePage