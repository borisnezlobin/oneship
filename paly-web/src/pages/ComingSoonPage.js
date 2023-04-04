import React from 'react'
import { Anchor } from "phosphor-react"
import { toast, Toaster } from 'react-hot-toast';
import { SUCCESS_TOAST_STYLES } from '../util/config';

const ComingSoonPage = () => {
    return (
        <div className='flex' style={{
          height: "100vh",
          backgroundColor: "var(--bg)",
          width: "100vw",
          color: "var(--text)"
        }}>
          <Toaster position='bottom-right' />
          <Anchor color="var(--green)" size={128} />
          <p className='bigText'>OneShip</p>
          <p style={{ margin: 0, fontSize: "x-large" }}>Coming soon!</p>
          <div style={{ margin: 8, height: 16 }} />
          <div className='btn' onClick={() => {
            window.open("https://discord.gg/CVHr8mKJeC");
          }}>
            Interested? Join our Discord!
          </div>
          <p style={{ marginTop: 16, marginBottom: 0 }}>
            OR
          </p>
          <p className='link' onClick={() => {
              navigator.clipboard.writeText("https://discord.gg/CVHr8mKJeC");
              toast("Link copied!", SUCCESS_TOAST_STYLES);
          }}>
            Copy the invite link
          </p>
        </div>
    );
}

export default ComingSoonPage