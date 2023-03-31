import { Link } from 'react-router-dom'
import React from 'react'
import CONFIG from '../util/config'
import { Anchor } from 'phosphor-react'
import { toast } from 'react-hot-toast'

const HomePage = () => {
  return (
    <div className='flex' style={{
      left: CONFIG.NAVBAR_WIDTH,
      backgroundColor: "var(--dark-blue)",
      top: 0,
      width: window.innerWidth - CONFIG.NAVBAR_WIDTH,
      height: window.innerHeight,
      position: "absolute",
      color: "white"
    }}>
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
          height: 0.5,
          backgroundColor: "grey",
          margin: 32,
          borderRadius: 1024,
        }} />
        <btn className='btn' onClick={() => {
            window.open("https://discord.gg/CVHr8mKJeC");
          }}>
            Like it? Join our Discord!
          </btn>
          <p style={{ marginTop: 24, marginBottom: 0 }}>
            OR
          </p>
          <p className='link' onClick={() => {
              navigator.clipboard.writeText("https://discord.gg/CVHr8mKJeC");
              toast("Link copied!", {
                  style: {
                      backgroundColor: "#1c8000",
                      fontWeight: "bold",
                      color: "white",
                  }
              });
          }}>
            Copy the invite link
          </p>
    </div>
  )
}

export default HomePage