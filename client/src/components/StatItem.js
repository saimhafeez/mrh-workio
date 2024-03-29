import React from 'react'
import Wrapper from '../assets/wrappers/StatItem'

function StatItem({ color, title, icon, count, bcg }) {

    return (
        <Wrapper color={color} bcg={bcg}>
            <header>
                <span className='count'>
                    {count}
                </span>
                <div className="icon">
                    {icon}
                </div>
            </header>
            <h5 className='title'>{title}</h5>
        </Wrapper>
    )
}

export default StatItem