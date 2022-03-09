import React from 'react'
import { Chart } from 'react-charts'
import classes from './graph.module.css'
const Graph = () => {
    const data = React.useMemo(
        () => [
            {
                label: 'Series 1',
                data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
            }
        ],
        []
    )

    const axes = React.useMemo(
        () => [
            { primary: true, type: 'linear', position: 'bottom' },
            { type: 'linear', position: 'left' }
        ],
        []
    )

    const lineChart = (
        <div
            className={classes.chart}
        >
            <Chart data={data} axes={axes} />
        </div>
    )

    return (lineChart)
}

export default Graph;