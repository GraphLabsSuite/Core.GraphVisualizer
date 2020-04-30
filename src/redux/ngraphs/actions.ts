import {INGraphsView} from "../../models";
import {INGraphsActionFill} from "../../types/INGraphsActionts";

export const FILL_NGRAPHS: string = 'ngraphs/FILL_NGRAPHS';

export const nGraphsActionCreators = {
  fillnGraphs(ngraphs: INGraphsView): INGraphsActionFill {
    return {
      type: FILL_NGRAPHS,
      ngraphs,
    };
  },
};