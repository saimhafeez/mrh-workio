import React from 'react'
import { NavLink } from 'react-router-dom'
import links from '../utils/links'

function NavLinks({ toggleSidebar }) {
    return (
        <div className='nav-links'>
            {links.map((link) => {
                const { text, path, id, icon } = link
                // isActive is provided by the libaray i.e provided within NavLink
                return (
                    <NavLink
                        to={path}
                        className='nav-link'
                        key={id}
                        onClick={toggleSidebar}
                    >
                        <span className='icon'>{icon}</span>
                        {text}
                    </NavLink>
                )
            })

            }
        </div>
    )
}

export default NavLinks