import { Link } from 'react-router-dom'
import React from 'react'

const SchedulePage = () => {
  return (
    <div className='App App-header'>
        <p className='bigText'>
            Schedule for today
        </p>
        <Link to="/" className='link'>
            Go home
        </Link>
    </div>
  )
}

export default SchedulePage