import { IGraphView } from '../..';
import {
    ADD_VERTEX,
    ADD_EDGE,
    REMOVE_VERTEX,
    REMOVE_EDGE
} from './actions';
import { IGraphAction, IGraphActionEdge, IGraphActionVertex } from '../../types/IGraphAction';

const initialState: IGraphView = {
    vertices: [],
    edges: []
};

export default (state: IGraphView = initialState, action: IGraphAction): IGraphView => {
    switch (action.type) {
        case ADD_VERTEX:
            return {
                vertices: [
                    ...state.vertices,
                    (<IGraphActionVertex> action).vertex
                ],
                edges: [
                    ...state.edges
                ]
            };
        case REMOVE_VERTEX:
            return {
                vertices: [
                    ...state.vertices
                        .filter(v => v.name !== (<IGraphActionVertex> action).vertex.name),
                ],
                edges: [
                    ...state.edges
                        .filter(e => e.vertexTwo !== (<IGraphActionVertex> action).vertex.name
                            && e.vertexOne !== (<IGraphActionVertex> action).vertex.name)
                ]
            };
        case ADD_EDGE:
            return {
                vertices: [
                    ...state.vertices
                ],
                edges: [
                    ...state.edges,
                    (<IGraphActionEdge> action).edge
                ],
            };
        case REMOVE_EDGE:
            return {
                vertices: [
                    ...state.vertices
                ],
                edges: [
                    ...state.edges
                        .filter(e => e.vertexOne !== (<IGraphActionEdge> action).edge.vertexOne
                            && e.vertexTwo !== (<IGraphActionEdge> action).edge.vertexTwo),
                ]
            };
        default:
            return state;
    }
};