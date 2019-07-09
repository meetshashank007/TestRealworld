import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorRedurec from "./errorReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorRedurec
});
