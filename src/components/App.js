import React from "react";
import { connect } from "react-redux";
import { Grid, GridColumn } from "semantic-ui-react";
import "./App.css";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";
import ColorPanel from "./ColorPanel/ColorPanel";

const App = ({currentUser}) =>
  <Grid columns="equal" className="app" style={{background:"#eee"}}>
    {/* <GridColumn> */}

    <ColorPanel />
    {/* </GridColumn> */}
    {/* <GridColumn> */}

    <SidePanel currentUser={currentUser} />
    {/* </GridColumn> */}
    <GridColumn style={{marginLeft:320}}>
    <Messages />
    </GridColumn>
    <GridColumn width={4}>
    <MetaPanel />
    </GridColumn>
  </Grid>

const mapStateToProps = (state) =>({
  currentUser:state.user.currentUser
})
export default connect(mapStateToProps)(App)

