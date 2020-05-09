import * as React from 'react';
import {select, style} from 'd3-selection';
import * as d3 from 'd3';
import {Vertex, Edge, IEdge, IGraph, IVertex} from 'graphlabs.core.graphs';
import {CircleGraphVisualizer, GeometricEdge, GeometricVertex} from '..';
import {Component} from 'react';

import {svg} from "d3";

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

export interface RAProps {
    className?: string;
    graph: IGraph<IVertex, IEdge>;
    namedEdges?: boolean;
    vertexNaming?: boolean;
    withoutDragging?: boolean;
    edgeNaming?: boolean;
}

export interface State {
    events: Event[];
}

export class ReadableAdapter extends Component<RAProps, State> {

    public ref!: SVGSVGElement;
    public graphVisualizer!: CircleGraphVisualizer;
    public vertexOne: IVertex;
    public vertexTwo: IVertex;

    public addVertex() {

    }

    public addEdge() {

    }

    public removeVertex() {

    }

    public removeEdge() {

    }

    renderSvg() {
        console.log(this.graphVisualizer);
        this.graphVisualizer.width = this.ref.getBoundingClientRect().width;
        this.graphVisualizer.height = this.ref.getBoundingClientRect().height;
        this.graphVisualizer.calculate();
        for (const elem of this.graphVisualizer.geometric.edges) {
            this.addEdgeToSVG(elem);
        }
        for (const elem of this.graphVisualizer.geometric.vertices) {
            this.addVertexToSVG(elem);
        }
    }

    addEdgeToSVG(elem: GeometricEdge<Edge>) {
        console.log(this.graphVisualizer);
        const data = [{x: elem.outPoint.X, y: elem.outPoint.Y}, {x: elem.inPoint.X, y: elem.inPoint.Y}];
        select<SVGSVGElement, IEdge[]>(this.ref)
            .append('line')
            .datum([this.vertexOne, this.vertexTwo])
            .attr('id', `edge_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
            .attr('out', elem.edge.vertexOne.name)
            .attr('in', elem.edge.vertexTwo.name)
            .attr('label', elem.label)
            .attr('x1', data[0].x)
            .attr('x2', data[1].x)
            .attr('y1', data[0].y)
            .attr('y2', data[1].y)
            .style('stroke', 'black')
            .style('stroke-width', 5)
            .style('fill', 'none')
            .on('click', clickEdge);
        if (this.props.namedEdges == true) {
            select(this.ref)
                .append('text')
                .attr('id', `label2_${elem.label}`)
                .attr('x', (data[0].x + data[1].x) / 2)
                .attr('y', ((data[0].y + data[1].y) / 2) + 15)
                .text(elem.label)
                .style('fill', '#000')
                .style('font-size', '14px')
                .style('font-family', 'sans-serif')
                .style('text-anchor', 'middle');
        }

        function clickEdge(this: SVGLineElement, vertArr: IVertex[]) {
            const action = {
                type: 'edge',
                out: this.getAttribute('out'),
                in: this.getAttribute('in'),
            };
            appActionCreators.setAction(action);
            let elemColour = select<SVGLineElement, {}>(this).style("stroke");
            if (elemColour === 'black') {
                select<SVGLineElement, {}>(this)
                    .style('stroke', 'green');
            } else {
                select<SVGLineElement, {}>(this)
                    .style('stroke', 'black');
            }
        }
    }

    addVertexToSVG(elem: GeometricVertex<Vertex>) {
        console.log(this.graphVisualizer);
        let createVertex =  select<SVGSVGElement, IVertex[]>(this.ref)
            .append('circle')
            .datum([this.vertexOne, this.vertexTwo])
            .attr('id', `vertex_${elem.label}`)
            .attr('cx', elem.center.X)
            .attr('cy', elem.center.Y)
            .attr('label', elem.label)
            .attr('r', elem.radius)
            .style('fill', '#eee')
            .style('stroke', '#000')
            .style('stroke-width', 5)
            .on('click', clickVertex);
        if (this.props.withoutDragging !== true){
            createVertex
                .classed('dragging', true)
                .call(d3.drag<SVGCircleElement, IVertex[]>().on('start', startDrag));
        }
        select(this.ref)
            .append('text')
            .attr('id', `label_${elem.label}`)
            .attr('x', elem.center.X)
            .attr('y', elem.center.Y + elem.radius / 4)
            .attr('font-size', elem.radius)
            .text(elem.label)
            .style('fill', '#000')
            .style('font-family', 'sans-serif')
            .style('text-anchor', 'middle')
            .style('padding-top', '50%')
            .style('user-select', 'none')
            .style('pointer-events', 'none');
        const referrer = this.ref;
        const isNamedEdges = this.props.namedEdges;

        function startDrag(this: SVGCircleElement) {
            const circle = d3.select(this).classed('dragging', true);
            d3.event.on('drag', dragged).on('end', ended);
            const radius = parseFloat(circle.attr('r'));

            function dragged(d: any) {
                if (d3.event.x < referrer.getBoundingClientRect().width - radius
                    && d3.event.x > radius
                    && d3.event.y < referrer.getBoundingClientRect().height - radius
                    && d3.event.y > radius) {
                    circle.raise().attr('cx', d3.event.x).attr('cy', d3.event.y);
                    const name = circle.attr('id');
                    const _id = name.substring(7);
                    select(`#label_${_id}`)
                        .raise()
                        .attr('x', d3.event.x)
                        .attr('y', d3.event.y + +circle.attr('r') / 4);
                    d3.selectAll('line').each(function (l: any, li: any) {
                        if (`vertex_${d3.select(this).attr('out')}` === name) {
                            select(this)
                                .attr('x1', d3.event.x)
                                .attr('y1', d3.event.y);
                            if (isNamedEdges == true) {
                                select(`#label2_${d3.select(this).attr('label')}`)
                                    .attr('x', (d3.event.x + Number(d3.select(this).attr('x2'))) / 2)
                                    .attr('y', ((d3.event.y + Number(d3.select(this).attr('y2'))) / 2) + 15);
                            }
                        }
                        if (`vertex_${d3.select(this).attr('in')}` === name) {
                            select(this)
                                .attr('x2', d3.event.x)
                                .attr('y2', d3.event.y);
                            if (isNamedEdges == true) {
                                select(`#label2_${d3.select(this).attr('label')}`)
                                    .attr('x', (d3.event.x + Number(d3.select(this).attr('x1'))) / 2)
                                    .attr('y', ((d3.event.y + Number(d3.select(this).attr('y1'))) / 2) + 15);
                            }
                        }
                    });
                }
                //     console.log("ATTENTION!!!");
                // }
            }

            function ended() {
                circle.classed('dragging', false);
            }
        }

        function clickVertex(this: SVGCircleElement, vertexArr: IVertex[]) {
            let elemColour = select<SVGCircleElement, {}>(this).style("fill");
            if (elemColour === 'rgb(255, 0, 0)') {
                select<SVGCircleElement, {}>(this)
                    .style('fill', '#eee');
                if (this.getAttribute('label') == vertexArr[0].name) {
                    vertexArr[0].rename('');
                } else if (this.getAttribute('label') == vertexArr[1].name) {
                    vertexArr[1].rename('');
                }
            } else {
                select<SVGCircleElement, {}>(this)
                    .style('fill', '#ff0000');
                if (vertexArr[0].name == '') {
                    vertexArr[0].rename(this.getAttribute('label'));
                } else if (vertexArr[1].name == '') {
                    vertexArr[1].rename(this.getAttribute('label'));
                } else if (vertexArr[0].name !== '' && vertexArr[1].name !== '') {
                    vertexArr[1].rename('');
                    vertexArr[0].rename(this.getAttribute('label'));
                }
            }
        }
    }

    removeVertexFromSVG(elem: GeometricVertex<Vertex>) {
        console.log(this.graphVisualizer);
        select(`#vertex_${elem.label}`)
            .remove();
        select(`#label_${elem.label}`)
            .remove();
    }

    removeEdgeFromSVG(elem: GeometricEdge<Edge>) {
        console.log(this.graphVisualizer);
        select(`#edge_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
            .remove();
        select(`#label2_${elem.label}`)
            .remove();
    }

    updateSvg() {
        console.log(this.vertexOne);
        console.log(this.vertexTwo);
        this.graphVisualizer.width = this.ref.getBoundingClientRect().width;
        this.graphVisualizer.height = this.ref.getBoundingClientRect().height;
        this.graphVisualizer.calculate();
        for (const elem of this.graphVisualizer.geometric.vertices) {
            select(`#vertex_${elem.label}`)
                .attr('cx', elem.center.X)
                .attr('cy', elem.center.Y)
                .attr('r', elem.radius)
                .style('fill', '#eee');
            select(`#label_${elem.label}`)
                .attr('x', elem.center.X)
                .attr('y', elem.center.Y + elem.radius / 4)
                .attr('font-size', elem.radius);
        }
        for (const elem of this.graphVisualizer.geometric.edges) {
            select(`#edge_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
                .attr('x1', elem.outPoint.X)
                .attr('x2', elem.inPoint.X)
                .attr('y1', elem.outPoint.Y)
                .attr('y2', elem.inPoint.Y);
            if (this.props.namedEdges == true) {
                select(`#label2_${elem.label}`)
                    .attr('x', (elem.outPoint.X + elem.inPoint.X) / 2)
                    .attr('y', ((elem.outPoint.Y + elem.inPoint.Y) / 2) + 15);
            }
        }
    }

    componentDidMount() {
        this.graphVisualizer = new CircleGraphVisualizer(this.props.graph);
        this.renderSvg();
        window.onresize = this.updateSvg.bind(this);
    }

    constructor(props: RAProps) {
        super(props);
        this.state = {
            events: []
        };
        this.updateGraph = this.updateGraph.bind(this);
        this.vertexOne = new Vertex('');
        this.vertexTwo = new Vertex('');
    }

    updateGraph() {
        // tslint:disable-next-line no-console
        console.log('Here I am!');
    }

    render() {
        return (
            <svg
                style={{width: '100%', height: '100%'}}
                ref={(ref: SVGSVGElement) => this.ref = ref}
            />);
    }
}
