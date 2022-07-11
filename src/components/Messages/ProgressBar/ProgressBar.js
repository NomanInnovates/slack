import React from 'react'
import { Progress } from 'semantic-ui-react'

function ProgressBar({ percentUploaded, uploadState }) {
    return (
        uploadState === "uploading" && (
        <Progress
            className='progress__bar'
            percent={percentUploaded}
            indicating
            progress
            size='medium'
            inverted
        />)
    )
}

export default ProgressBar