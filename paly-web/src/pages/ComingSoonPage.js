import React from 'react'
import { Anchor } from "phosphor-react"
import { toast, Toaster } from 'react-hot-toast';

const ComingSoonPage = () => {
    return (
        <div className='flex' style={{
          height: "100vh",
          backgroundColor: "var(--dark-blue)",
          width: "100vw",
          color: "white"
        }}>
          <Toaster position='bottom-right' />
          <Anchor color="#1c8000" size={128} />
          <p className='bigText'>OneShip</p>
          <p style={{ margin: 0, fontSize: "x-large" }}>Coming soon!</p>
          <div style={{ margin: 8, height: 16 }} />
          <btn className='btn' onClick={() => {
            window.open("https://discord.gg/CVHr8mKJeC");
          }}>
            Interested? Join our Discord!
          </btn>
          <p style={{ marginTop: 16, marginBottom: 0 }}>
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
    );
}

export default ComingSoonPage