import React from "react";
import { connect } from "react-redux";
import { Grid, GridColumn } from "semantic-ui-react";
import "./App.css";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import SidePanel from "./SidePanel/SidePanel";
import ColorPanel from "./ColorPanel/ColorPanel";

const App = ({ currentUser, currentChannel, isPrivateChannel, userPosts }) => {
  return (
    <Grid columns="equal" className="app" style={{ background: "#eee" }}>
      <ColorPanel currentUser={currentUser} />

      <SidePanel
        key={currentUser && currentUser.uid}
        currentUser={currentUser}
      />

      <GridColumn style={{ marginLeft: 320 }}>
        <Messages
          currentUser={currentUser}
          currentChannel={currentChannel}
          isPrivateChannel={isPrivateChannel}
          key={currentChannel && currentChannel.id}
        />
      </GridColumn>
      <GridColumn width={4}>
        <MetaPanel
          userPosts={userPosts}
          currentChannel={currentChannel}
          isPrivateChannel={isPrivateChannel}
          key={currentChannel && currentChannel.id}
        />
      </GridColumn>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    userPosts: state.channel.userPosts,
    currentUser: state.user.currentUser,
    currentChannel: state.channel.currentChannel,
    isPrivateChannel: state.channel.isPrivateChannel,
  };
};
export default connect(mapStateToProps)(App);
