import * as React from 'react';
import {select, style} from 'd3-selection';
import * as d3 from 'd3';
import {Vertex, Edge, GraphSerializer, IEdge, IGraph, IVertex} from 'graphlabs.core.graphs';
import {CircleGraphVisualizer, GeometricEdge, GeometricVertex} from '..';
import { Component } from 'react';

import {svg} from "d3";
export interface RAProps {
    className?: string;
    graph: IGraph<IVertex, IEdge>;
}

export interface State {
    events: Event[];
}

export class ReadableAdapter extends Component<RAProps, State> {

    public ref!: SVGSVGElement;
    public graphVisualizer!: CircleGraphVisualizer;
    public vertexOne: IVertex;
    public vertexTwo: IVertex;

   // private _graph!: IGraphView;
   /* get graph(): IGraphView {
        const state: RootState = store.getState();
        store.subscribe(() => {
            if (this.graph !== store.getState().graph) {
                this._graph = store.getState().graph;
                this.forceUpdate();
            }
        });
        this._graph = {...state.graph};
        return this._graph;
    } */

   /* public clickVertex(elem: SVGCircleElement) {
        if (this.vertexOne == null){
            this.vertexOne = elem.getAttribute('label');
        }
        else {
            this.vertexTwo = elem.getAttribute('label');
        }
        let elemColour = select<SVGCircleElement, {}>(elem).style("fill");
        if (elemColour === 'rgb(255, 0, 0)'){
            select<SVGCircleElement, {}>(elem)
                .style('fill', '#eee');
        }
        else {
            select<SVGCircleElement, {}>(elem)
                .style('fill', '#ff0000');
        }
    }

    public clickEdge(elem: SVGLineElement) {
        this.vertexOne=elem.getAttribute('out');
        this.vertexTwo=elem.getAttribute('in');
        let elemColour = select<SVGLineElement, {}>(elem).style("fill");
        if (elemColour === 'rgb(255, 0, 0)'){
            select<SVGLineElement, {}>(elem)
                .style('fill', '#000');
        }
        else {
            select<SVGLineElement, {}>(elem)
                .style('fill', '#ff0000');
        }
    }
*/

   public  addVertex(){

   }

   public addEdge(){

   }

   public removeVertex(){

   }

   public removeEdge(){

   }

    renderSvg() {
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

    addEdgeToSVG(elem: GeometricEdge<Edge>){
        const data = [{x: elem.outPoint.X, y: elem.outPoint.Y}, {x: elem.inPoint.X, y: elem.inPoint.Y}];
        select<SVGSVGElement, IVertex[]>(this.ref)
            .append('line')
            .datum([this.vertexOne, this.vertexTwo])
            .attr('id', `edge_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
            .attr('out', elem.edge.vertexOne.name)
            .attr('in', elem.edge.vertexTwo.name)
            .attr('x1', data[0].x)
            .attr('x2', data[1].x)
            .attr('y1', data[0].y)
            .attr('y2', data[1].y)
            .style('stroke', 'black')
            .style('stroke-width', 5)
            .style('fill', 'none')
            .on('click', clickEdge);
        //let vertexOne = this.vertexOne;
        //let vertexTwo = this.vertexTwo;
        function clickEdge(this: SVGLineElement, vertArr: IVertex[]) {
            vertArr[0].rename(this.getAttribute('out'));
            vertArr[1].rename(this.getAttribute('in'));
            console.log(vertArr[0]);
            console.log(vertArr[1]);
            let elemColour = select<SVGLineElement, {}>(this).style("fill");
            if (elemColour === 'rgb(255, 0, 0)') {
                select<SVGLineElement, {}>(this)
                    .style('fill', '#000');
            }
            else {
                select<SVGLineElement, {}>(this)
                    .style('fill', '#ff0000');
            }
        }
    }

    addVertexToSVG(elem: GeometricVertex<Vertex>){
        select<SVGSVGElement, IVertex[]>(this.ref)
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
            .classed('dragging', true)
            .call(d3.drag<SVGCircleElement, IVertex[]>().on('start', startDrag))
            .on('click', clickVertex);
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
                        }
                        if (`vertex_${d3.select(this).attr('in')}` === name) {
                            select(this)
                                .attr('x2', d3.event.x)
                                .attr('y2', d3.event.y);
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
        //let vertexOne = this.vertexOne;
        //console.log("first"+this.vertexOne);
        //let vertexTwo = this.vertexTwo;
        function clickVertex(this: SVGCircleElement, vertexArr: IVertex[]) {
           if (vertexArr[0].name == '') {
                vertexArr[0].rename(this.getAttribute('label'));
            }
            else if (vertexArr[1].name == '')
            {
                vertexArr[1].rename(this.getAttribute('label'));
            }
            console.log(vertexArr[0]);
            console.log(vertexArr[1]);
            let elemColour = select<SVGCircleElement, {}>(this).style("fill");
            if (elemColour === 'rgb(255, 0, 0)'){
                select<SVGCircleElement, {}>(this)
                    .style('fill', '#eee');
            }
            else {
                select<SVGCircleElement, {}>(this)
                    .style('fill', '#ff0000');
            }
        }
    }

    removeVertexFromSVG(elem: GeometricVertex<Vertex>){
        select(`#vertex_${elem.label}`)
            .remove();
        select(`#label_${elem.label}`)
            .remove();
    }

    removeEdgeFromSVG(elem: GeometricEdge<Edge>){
       select(`#edge_${elem.edge.vertexOne.name}_${elem.edge.vertexTwo.name}`)
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
                .attr('fill', 'black')
                .attr('r', elem.radius);
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
        }
    }

    componentDidMount() {
       // const graphInString: string = graphSerializer(this.graph);
       // const graph: IGraph<IVertex, IEdge> = GraphSerializer.deserialize(graphInString);
        this.graphVisualizer = new CircleGraphVisualizer(this.props.graph);
        this.renderSvg();
        window.onresize = this.updateSvg.bind(this);
    }

    componentWillReceiveProps(nextProps: RAProps){
        if(nextProps.graph !== this.props.graph){
            this.graphVisualizer = new CircleGraphVisualizer(nextProps.graph);
            this.graphVisualizer.width = this.ref.getBoundingClientRect().width;
            this.graphVisualizer.height = this.ref.getBoundingClientRect().height;
            this.graphVisualizer.calculate();
        }
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
