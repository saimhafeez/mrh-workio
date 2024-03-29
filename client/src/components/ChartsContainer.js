import React, { useState } from 'react'
import BarChartComponent from './BarChartComponent'
import AreaChartComponent from './AreaChartComponent'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/ChartsContainer'

function ChartsContainer() {

    const [barChart, setBarChart] = useState(true);
    const { monthlyApplications: data } = useAppContext();

    return (
        <Wrapper>
            <h4>Monthly Application</h4>

            <button type='button' onClick={() => setBarChart(!barChart)}>
                {barChart ? 'Area Chart' : 'Bar Chart'}
            </button>
            {
                barChart ?
                    <BarChartComponent data={data} /> :
                    <AreaChartComponent data={data} />
            }
        </Wrapper>
    )
}

export default ChartsContainer