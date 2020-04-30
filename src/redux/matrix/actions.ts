import {IMatrixView} from "../../models";
import {IMatrixActionFill} from "../../types/IMatrixAction";

export const FILL_MATRIX: string = 'matrix/FILL_MATRIX';

export const matrixActionCreators = {
  fillMatrix(matrix: IMatrixView): IMatrixActionFill {
    return {
      type: FILL_MATRIX,
      matrix,
    };
  },
};
