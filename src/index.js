import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { createStore } from "redux";
import { Provider ,connect} from "react-redux";
import "semantic-ui-css/semantic.min.css";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import registerServiceWorker from "./registerServiceWorker";
import {composeWithDevTools} from 'redux-devtools-extension'
import { auth } from './firebase'
import rootReducer from "./reducers";
import { setUser } from "./actions";
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom";
import Spinner from "./Spinner";

const store = createStore(rootReducer,composeWithDevTools())

class Root extends React.Component {
  componentDidMount() {console.log(this.props)
    auth.onAuthStateChanged(user => {
      if (user) {
        console.log({user})
        this.props.setUser(user);
        this.props.history.push("/");
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
  isLoading:state.user.isLoading
})
const RootWithAuth = withRouter(connect(mapStateToProps,{setUser})(Root))
ReactDOM.render(
<Provider store={store}>
<Router>
  <RootWithAuth /> 
</Router>
</Provider>
  , document.getElementById("root"));
registerServiceWorker();
