import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import registerServiceWorker from "./registerServiceWorker";
import { auth } from './firebase'
import "semantic-ui-css/semantic.min.css";
import { Provider } from "react-redux";
import { createStore } from "redux";
import {composeWithDevTools} from 'redux-devtools-extension'
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom";
import rootReducer from "./reducers";
const store = createStore(rootReducer,composeWithDevTools())

class Root extends React.Component {
  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user) {
        this.props.history.push("/")
      }
    })
  }
  render() {
    return (<Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
    );
  }
}

const RootWithAuth = withRouter(Root)
ReactDOM.render(
<Provider store={store}>
<Router>
  <RootWithAuth /> 
</Router>
</Provider>
  , document.getElementById("root"));
registerServiceWorker();
