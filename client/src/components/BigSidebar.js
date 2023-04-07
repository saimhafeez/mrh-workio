import React from 'react'
import Wrapper from '../assets/wrappers/BigSidebar'
import Logo from '../components/Logo'
import NavLinks from './NavLinks'
import { useAppContext } from '../context/appContext'

function BigSidebar() {

    const { showSidebar } = useAppContext();

    return (
        <Wrapper>
            <div
                className={showSidebar ? 'sidebar-container' : 'sidebar-container show-sidebar'}
            >
                <div className='content'>
                    <header>
                        <Logo />
                    </header>
                    <NavLinks />
                </div>
            </div>
        </Wrapper>
    )
}

export default BigSidebar