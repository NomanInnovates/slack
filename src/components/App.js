import React from "react";
import { connect } from "react-redux";
import { Grid, GridColumn } from "semantic-ui-react";
import "./App.css";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";
import ColorPanel from "./ColorPanel/ColorPanel";

const App = ({ currentUser, currentChannel, isPrivateChannel ,setUserPosts }) =>
  <Grid columns="equal" className="app" style={{ background: "#eee" }}>
    <ColorPanel />

    <SidePanel key={currentUser && currentUser.uid} currentUser={currentUser} />

    <GridColumn style={{ marginLeft: 320 }}>
      <Messages
        key={currentChannel && currentChannel.id}
        currentUser={currentUser}
        currentChannel={currentChannel}
        isPrivateChannel={isPrivateChannel}
      />
    </GridColumn>
    <GridColumn width={4}>
      <MetaPanel
       key={currentChannel && currentChannel.id}
       currentUser={currentUser}
       setUserPosts={setUserPosts}
       currentChannel={currentChannel}
       isPrivateChannel={isPrivateChannel}
        />
    </GridColumn>
  </Grid>

const mapStateToProps = (state) => {

  return {
    currentUser: state.user.currentUser,
    setUserPosts:state.channel.setUserPosts,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel,
  }
}
export default connect(mapStateToProps)(App)

