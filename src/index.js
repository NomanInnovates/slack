import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { createStore } from "redux";
import "semantic-ui-css/semantic.min.css";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from 'redux-devtools-extension'
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom";
import Spinner from "./Spinner";
import { auth } from './firebase'
import rootReducer from "./reducers";
import Login from "./components/Auth/Login";
import { setUser, clearUser } from "./config/actions";
import Register from "./components/Auth/Register";
import registerServiceWorker from "./registerServiceWorker";

const store = createStore(rootReducer, composeWithDevTools())

class Root extends React.Component {
  componentDidMount() {
    auth.onAuthStateChanged(user => {
      if (user ) {
        this.props.setUser(user);
        this.props.history.push("/");
      }
      else {
        this.props.history.push("/login");
        // clear user
        this.props.clearUser()
      }
    })
  }
  render() {
    return this.props.isLoading ? <Spinner /> : (<Switch>
      <Route exact path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
    );
  }
}
const mapStateToProps = state => ({
  isLoading: state.user.isLoading
})
const RootWithAuth = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root))
ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>
  , document.getElementById("root"));
registerServiceWorker();
