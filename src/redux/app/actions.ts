export const SET_STATUS: string = 'APP_SET_STATUS';
export const SET_ACTION: string = 'APP_SET_ACTION';

export const appActionCreators = {
  setStatus(payload: boolean) {
    return {
      type: SET_STATUS,
      payload,
    };
  },
  setAction(payload: any) {
    return {
      type: SET_ACTION,
      payload,
    };
  }
};
