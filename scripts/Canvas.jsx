import React, {Component} from 'react';
import {render} from 'react-dom';

import go from 'gojs';

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      schema: props.schema
    };
    this.renderDiagram.bind(this);
    this.getTableDataArray.bind(this);
    this.getLinkDataArray.bind(this);
  }

  componentDidMount(){
    this.renderDiagram();
  }

  renderDiagram() {
    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, "canvas", {
      initialContentAlignment: go.Spot.Center,
      allowDelete: false,
      allowCopy: false,
      layout: $(go.ForceDirectedLayout),
      'undoManager.isEnabled': true
    });
    const lightgrad = $(go.Brush, "Linear", { 1: "#E6E6FA", 0: "#FFFAF0" });

    const template =
      $(go.Panel, "Horizontal",
        $(go.Shape,
          {desiredSize: new go.Size(10, 10)},
          new go.Binding("figure", "figure"),
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          {
            stroke: "#333333",
            font: "bold 14px sans-serif"
          },
          new go.Binding("text", "name"))
      );


    diagram.nodeTemplate = $(go.Node, "Auto",  // the whole node panel
      {
        selectionAdorned: true,
        resizable: true,
        layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
        fromSpot: go.Spot.AllSides,
        toSpot: go.Spot.AllSides,
        isShadowed: true,
        shadowColor: "#C5C1AA"
      },
      new go.Binding("location", "location").makeTwoWay(),
      // define the node's outer shape, which will surround the Table
      $(go.Shape, "Rectangle",
        {fill: lightgrad, stroke: "#756875", strokeWidth: 3}),
      $(go.Panel, "Table",
        {margin: 8, stretch: go.GraphObject.Fill},
        $(go.RowColumnDefinition, {row: 0, sizing: go.RowColumnDefinition.None}),
        // the table header
        $(go.TextBlock,
          {
            row: 0, alignment: go.Spot.Center,
            margin: new go.Margin(0, 14, 0, 2),  // leave room for Button
            font: "bold 16px sans-serif"
          },
          new go.Binding("text", "key")),
        // the collapse/expand button
        $("PanelExpanderButton", "LIST",  // the name of the element whose visibility this button toggles
          {row: 0, alignment: go.Spot.TopRight}),
        // the list of Panels, each showing an attribute
        $(go.Panel, "Vertical",
          {
            name: "LIST",
            row: 1,
            padding: 3,
            alignment: go.Spot.TopLeft,
            defaultAlignment: go.Spot.Left,
            stretch: go.GraphObject.Horizontal,
            itemTemplate: template
          },
          new go.Binding("itemArray", "items"))
      )  // end Table Panel
    );  // end Node


    diagram.linkTemplate = $(go.Link, "Link", // the whole link panel
        {
          selectionAdorned: true,
          layerName: "Foreground",
          reshapable: true,
          routing: go.Link.AvoidsNodes,
          corner: 5,
          curve: go.Link.JumpOver
        },
        $(go.Shape,  // the link shape
          { stroke: "#303B45", strokeWidth: 2.5 }),
        $(go.TextBlock,  // the "from" label
          {
            textAlign: "center",
            font: "bold 14px sans-serif",
            stroke: "#1967B3",
            segmentIndex: 0,
            segmentOffset: new go.Point(NaN, NaN),
            segmentOrientation: go.Link.OrientUpright
          },
          new go.Binding("text", "text")),
        $(go.TextBlock,  // the "to" label
          {
            textAlign: "center",
            font: "bold 14px sans-serif",
            stroke: "#1967B3",
            segmentIndex: -1,
            segmentOffset: new go.Point(NaN, NaN),
            segmentOrientation: go.Link.OrientUpright
          },
          new go.Binding("text", "toText"))
      );

    let data = this.getTableDataArray();
    let links = this.getLinkDataArray();

    diagram.model = new go.GraphLinksModel(data, links);
  }

    getTableDataArray() {
    const $ = go.GraphObject.make;
    const bluegrad = $(go.Brush, "Linear", { 0: "rgb(150, 150, 250)", 0.5: "rgb(86, 86, 186)", 1: "rgb(86, 86, 186)" });
    const greengrad = $(go.Brush, "Linear", { 0: "rgb(158, 209, 159)", 1: "rgb(67, 101, 56)" });
    const redgrad = $(go.Brush, "Linear", { 0: "rgb(206, 106, 100)", 1: "rgb(180, 56, 50)" });
    const yellowgrad = $(go.Brush, "Linear", { 0: "rgb(254, 221, 50)", 1: "rgb(254, 182, 50)" });
    return [
      { key: "Products",
        items: [ { name: "ProductID", iskey: true, figure: "Decision", color: yellowgrad },
                 { name: "ProductName", iskey: false, figure: "Cube1", color: bluegrad },
                 { name: "SupplierID", iskey: false, figure: "Decision", color: "purple" },
                 { name: "CategoryID", iskey: false, figure: "Decision", color: "purple" } ] },
      { key: "Suppliers",
        items: [ { name: "SupplierID", iskey: true, figure: "Decision", color: yellowgrad },
                 { name: "CompanyName", iskey: false, figure: "Cube1", color: bluegrad },
                 { name: "ContactName", iskey: false, figure: "Cube1", color: bluegrad },
                 { name: "Address", iskey: false, figure: "Cube1", color: bluegrad } ] },
      { key: "Categories",
        items: [ { name: "CategoryID", iskey: true, figure: "Decision", color: yellowgrad },
                 { name: "CategoryName", iskey: false, figure: "Cube1", color: bluegrad },
                 { name: "Description", iskey: false, figure: "Cube1", color: bluegrad },
                 { name: "Picture", iskey: false, figure: "TriangleUp", color: redgrad } ] },
      { key: "Order Details",
        items: [ { name: "OrderID", iskey: true, figure: "Decision", color: yellowgrad },
                 { name: "ProductID", iskey: true, figure: "Decision", color: yellowgrad },
                 { name: "UnitPrice", iskey: false, figure: "MagneticData", color: greengrad },
                 { name: "Quantity", iskey: false, figure: "MagneticData", color: greengrad },
                 { name: "Discount", iskey: false, figure: "MagneticData", color: greengrad } ] },
    ];
  }

  getLinkDataArray(){
    return [
      { from: "Products", to: "Suppliers", text: "0..N", toText: "1" },
      { from: "Products", to: "Categories", text: "0..N", toText: "1" },
      { from: "Order Details", to: "Products", text: "0..N", toText: "1" }
    ];
  }

  render(){
    return (
      <div id="canvas" className="goJS-canvas"></div>
    )
  }
}
