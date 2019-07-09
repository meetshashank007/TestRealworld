import axios from "axios";
import setAuthToken from "../util/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER } from "./types";

//Register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login GET user token
export const loginUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //Save to loaclStoreage
      const { token } = res.data;

      //Set toke to localStorage
      localStorage.setItem("jwtToken", token);

      //Set token to auth Header
      setAuthToken(token);

      //Decode Token to get user data
      const decode = jwt_decode(token);

      //Set current user
      dispatch(setCurrentUser(decode));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Logout user
export const logoutUser = () => dispatch => {
  //Remove token from localStorage
  localStorage.removeItem("jwtToken");

  //Remove auth header from future request
  setAuthToken(false);

  //Set current user to {} so isAuthentication is set to false
  dispatch(setCurrentUser({}));
};

//Set logged in user
export const setCurrentUser = decode => {
  return {
    type: SET_CURRENT_USER,
    payload: decode
  };
};
