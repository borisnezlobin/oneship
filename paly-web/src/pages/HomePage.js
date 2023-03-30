import { Link } from 'react-router-dom'
import React from 'react'

const HomePage = () => {
  return (
    <div className='App App-header'>
        <p className='bigText'>
            Home
        </p>
        <Link to={"/schedule"} className='link'>
            Go to schedule
        </Link>
    </div>
  )
}

export default HomePage