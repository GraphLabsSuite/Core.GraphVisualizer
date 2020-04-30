import { IEdgeView, IVertexView } from '../../models/graph';
import { IGraphActionEdge, IGraphActionVertex } from '../../types/IGraphAction';
export const ADD_VERTEX: string = 'graph/ADD_VERTEX';
export const REMOVE_VERTEX: string = 'graph/REMOVE_VERTEX';
export const ADD_EDGE: string = 'graph/ADD_EDGE';
export const REMOVE_EDGE: string = 'graph/REMOVE_EDGE';

import {graphModel} from "../../models/graphModel";

// export type Actions = {
//   ADD_VERTEX: {
//     type: typeof ADD_VERTEX,
//     vertice: IVertexView
//   },
//   REMOVE_VERTEX: {
//     type: typeof REMOVE_VERTEX,
//     vertice: IVertexView
//   },
//   ADD_EDGE: {
//     type: typeof ADD_EDGE,
//     edge: IEdgeView
//   },
//   REMOVE_EDGE: {
//     type: typeof REMOVE_EDGE,
//     edge: IEdgeView
//   },
// };

export const graphActionCreators = {
  addVertex(name: string): IGraphActionVertex {
    return {
      type: ADD_VERTEX,
      vertex: { name } as IVertexView
    };
  },
  removeVertex(name: string): IGraphActionVertex {
    return {
      type: REMOVE_VERTEX,
      vertex: { name } as IVertexView
    };
  },
  addEdge(vertexOne: string, vertexTwo: string): IGraphActionEdge {
    return {
      type: ADD_EDGE,
      edge: { vertexOne, vertexTwo } as IEdgeView
    };
  },
  removeEdge(vertexOne: string, vertexTwo: string): IGraphActionEdge {
    return {
      type: REMOVE_EDGE,
      edge: { vertexOne, vertexTwo } as IEdgeView
    };
  }
};