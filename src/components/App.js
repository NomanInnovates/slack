import React from "react";
import { connect } from "react-redux";
import { Grid, GridColumn } from "semantic-ui-react";
import "./App.css";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";
import ColorPanel from "./ColorPanel/ColorPanel";

const App = ({currentUser, currentChannel}) =>
  <Grid columns="equal" className="app" style={{background:"#eee"}}>
    {/* <GridColumn> */}

    <ColorPanel />
    {/* </GridColumn> */}
    {/* <GridColumn> */}

    <SidePanel currentUser={currentUser} />
    {/* </GridColumn> */}
    <GridColumn style={{marginLeft:320}}>
    <Messages currentUser={currentUser} currentChannel={currentChannel} />
    </GridColumn>
    <GridColumn width={4}>
    <MetaPanel />
    </GridColumn>
  </Grid>

const mapStateToProps = (state) =>{
  console.log("State in map",state)
return {
  currentUser: state.user.currentUser,
  currentChannel: state.channel.currentChannel
}}
export default connect(mapStateToProps)(App)

