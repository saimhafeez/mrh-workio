import React from 'react'

import { useEffect } from 'react'
import { useAppContext } from '../../context/appContext'
import { StatsContainer, ChartsContainer } from '../../components'

function Stats() {

    const { showStats, isLoading, monthlyApplications } = useAppContext();

    useEffect(() => {
        showStats()
        // eslint-disable-next-line
    }, [])

    if (isLoading) {
        return < center />
    }

    return (
        <>
            <StatsContainer />
            {monthlyApplications.length > 0 && <ChartsContainer />}
        </>
    )
}

export default Stats