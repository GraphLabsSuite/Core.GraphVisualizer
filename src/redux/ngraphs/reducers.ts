import {INGraphsView} from '../..';
import {FILL_NGRAPHS} from './actions';
import {INGraphsActionFill} from "../../types/INGraphsActionts";

const initialState: INGraphsView = [];

export default (state: INGraphsView = initialState, action: INGraphsActionFill): INGraphsView => {
    switch (action.type) {
        case FILL_NGRAPHS:
            return action.ngraphs;
        default:
            return state;
    }
};
