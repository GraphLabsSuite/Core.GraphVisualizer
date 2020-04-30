import {IAppActions, ISetStatus} from "../../types/IAppActions";
import { SET_ACTION, SET_STATUS } from './actions';

export interface App {
  status: boolean;
  action: any;
}

const initialState = {
  status: false,
  action: {},
};

export default (state: App = initialState, action: IAppActions): App => {
  switch (action.type) {
    case SET_STATUS:
      return {
        status: (<ISetStatus> action).payload,
        ...state,
      };
    case SET_ACTION:
      return {
        ...state,
        action: action.payload,
      };
    default:
      return state;
  }
}
