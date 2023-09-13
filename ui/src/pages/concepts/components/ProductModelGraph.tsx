import React, { useState, useCallback, Fragment, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {Product, ProductModel} from "../../../types/concept.ts";
import ReactECharts from 'echarts-for-react';



import {Box} from "@mui/system";
import {EChartsOption} from "echarts-for-react/src/types.ts";



interface ProductModelGraphProps {
  productModel: ProductModel;
}

function ProductModelGraph({
                             productModel
}: ProductModelGraphProps) {
  const ProductModelNetworkGraph = () => {
    const [chart, setChart] = useState(null);

    const chartRef = useRef(null);
    let nodesArray: string[] = [];

    function mapToLinks(productModel:ProductModel): any[] {
      const edgeArray = productModel.edges.map(function (edge) {
        const value = {
          source: nodesArray.indexOf(edge.source),
          target: nodesArray.indexOf(edge.target),
          label: {
            show: true,
            opacity: 1,
            formatter: function() {
              return edge.label;
            }

          }

        }
        return value;
      });
      return edgeArray;
    }
    function mapToNodes(nodes:Product[]): any[] {
      nodesArray = [];
      const nodeArray = nodes.map(function (item, index) {
        const value = {name: item.concept.fsn.term,
          value:index,category:item.label, conceptId:item.concept.conceptId};
        nodesArray.push(item.concept.conceptId);
        return value;
      });
      return nodeArray;
    }

    const webkitDep = {
      "type": "force",
      "categories": [
        {
          "name": "CTPP",
          "keyword": {},
          "base": "kjh"
        },
        {
          "name": "TP",
          "keyword": {},
          "base": "kjh"
        },
        {
          "name": "TPP",
          "keyword": {},
          "base": "kjh"
        },
        {
          "name": "TPUU",
          "keyword": {},
          "base": "kjh"
        },
        {
          "name": "MPP",
          "keyword": {},
          "base": "kjh"
        },
        {
          "name": "MPUU",
          "keyword": {},
          "base": "kjh"
        },
        {
          "name": "MP",
          "keyword": {},
          "base": "kjh"
        }
      ],


      "nodes": productModel ? mapToNodes(productModel.nodes): [],

      "links": productModel ? mapToLinks(productModel) : []
    };

    const options: EChartsOption = {
      legend: {
        data: ['MP','MPP','MPUU','TP','TPUU','TPP', 'CTPP']
      },
      tooltip: {
        formatter: function (params) {

          return `Concept ID: <b>${params.data.conceptId} </b><br />
              FSN:<b> ${params.name}</b><br />`;
        }
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          animation: false,
          //categories: graph.categories,
          label: {
            formatter: '{b}',
            show: true,
            //overflow: 'break',
            position: 'insideTopLeft',
            width: 350,
            ellipsis: '...',
            overflow: 'truncate'
          },
          itemStyle: {
            opacity: 1
          },
          draggable: true,
          zoom: 8,
          symbolSize: [100, 10],
          data: webkitDep.nodes.map(function (node, idx) {
            node.id = idx;
            return node;
          }),
          categories: webkitDep.categories,
          force: {
            //edgeLength: 5,
             repulsion: 100,
            //gravity: 0.2
          },
          scaleLimit: {
            min: 0.4,
            max: 5
          },

          //roam: true,
          edges: webkitDep.links,
          symbol: 'rectangle'
        }
      ]
    };

    return (
        <div className={"widgetContainer"} style={{padding: '9px',flexFlow: "1", display: "flex", alignItems: "center", height: "100%"}}>
          {options && (
              <>
                <ReactECharts
                    option={options}
                    style={{ height: '100%', width: '90%' }}
                    //onEvents={onEvents}
                />
              </>
          )}
        </div>
    );
  };
  return  (<Box style={{height:"1100px"}}><ProductModelNetworkGraph /> </Box>);
}



export default ProductModelGraph;