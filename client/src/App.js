import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Footer from "./components/layout/Footer";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import "./App.css";
import setAuthToken from "./util/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authAction";

//Check for token
if (localStorage.jwtToken) {
  //Set auth token header auth
  setAuthToken(localStorage.jwtToken);

  //Decode the token and get user info and exp
  const decode = jwt_decode(localStorage.jwtToken);

  //Set user is Authenticated
  store.dispatch(setCurrentUser(decode));

  //Check fro expired token
  const currentTime = Date.now() / 1000;

  if (decode.exp < currentTime) {
    //Logout user
    store.dispatch(logoutUser());

    //TODO : Clear current Profile

    //Redirect to login
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="conatiner">
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
