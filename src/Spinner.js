import React from 'react'
import { Dimmer, Loader } from 'semantic-ui-react'
function Spinner() {
    return (
        <Dimmer  active>

        <Loader size="huge" content={"Preparing chat"}
        />
        </Dimmer>
    )
}

export default Spinner