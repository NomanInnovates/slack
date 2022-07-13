import React from "react";
import { Header, Segment, Input, Icon } from "semantic-ui-react";

class MessagesHeader extends React.Component {
  render() {
    const { channelName, numUniqueUsers, handleSearchChange, privateChannel, handleStar, isChannelStarred } = this.props
    return (
      <Segment clearing>
        {/* Channel Title */}
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {channelName}
            {!privateChannel && (
              <Icon
                color={isChannelStarred ? "yellow" : "black"}
                onClick={handleStar}
                name={isChannelStarred ? "star" : "star outline"}
              />)}
          </span>
          <Header.Subheader>{numUniqueUsers} </Header.Subheader>
        </Header>

        {/* Channel Search Input */}
        <Header floated="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
            onChange={handleSearchChange}
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
