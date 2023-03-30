import React from 'react'
import '../styles/App.css';
import { Anchor } from "phosphor-react"
import { toast } from 'react-hot-toast';

const ComingSoonPage = () => {
    return (
        <div className="App App-header">
          <Anchor color="#1c8000" size={128} />
          <p className='bigText'>OneShip</p>
          <p style={{ margin: 0 }}>Coming soon!</p>
          <div style={{ margin: 8, height: 32 }} />
          <btn className='btn' onClick={() => {
            window.open("https://discord.gg/CVHr8mKJeC");
          }}>
            Interested? Join our Discord!
          </btn>
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
            Using a Chromebook? Copy the invite link!
          </p>
        </div>
    );
}

export default ComingSoonPage