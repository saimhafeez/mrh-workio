import React from 'react'

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts'

function AreaChartComponent({ data }) {
    return (
        <ResponsiveContainer width='100%' height={300}>
            <AreaChart
                data={data}
                margin={{
                    top: 50,
                }}
            >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area dataKey='count' fill='#5E6EC0' barSize={75} type='monotone' stroke='#475CB6' />
            </AreaChart>
        </ResponsiveContainer>
    )
}

export default AreaChartComponent