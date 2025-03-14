import React from 'react'
import { Link } from 'react-router-dom'

const Logo = () => {
    return (
        <Link to="/">
            <img
                src="./logo.svg"
                alt=""
                className="absolute top-5 left-5"
            />
        </Link>
    )
}

export default Logo
