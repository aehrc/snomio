import React, { useState, useCallback, Fragment, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {ProductModel} from "../../../types/concept.ts";
import * as Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import HighchartsExporting from 'highcharts/modules/exporting'
import networkgraph from "highcharts/modules/networkgraph";

import {mapToNodes, mapToEdges, getColorForModel} from "../../../utils/helpers/conceptUtils.ts";
import {Box} from "@mui/system";


if (typeof Highcharts === "object") {
  networkgraph(Highcharts);
  HighchartsExporting(Highcharts)
}

interface ProductModelGraphProps {
  productModel: ProductModel;
}

function ProductModelGraph({
                             productModel
}: ProductModelGraphProps) {
  const ProductModelNetworkGraph = (props: HighchartsReact.Props) => {
    const [chart, setChart] = useState(null);

    const chartRef = useRef(null);

    // const callback = useCallback(
    //     (HighchartsChart: React.SetStateAction<null>) => {
    //       setChart(HighchartsChart);
    //     },
    //     []
    // );

    if(!productModel){
      return (<Fragment></Fragment>);
    }

    const seriesOptions: 	any ={
      showInLegend: true,
      accessibility: {
        enabled: false
      },


      dataLabels: {
        enabled: true,
        linkFormat: '{point.relation}',
       // nodeFormat: '{point.name} <br> <b>{point.id}</b> <br> <b>{point.key} </b>',
        formatter: function() {
          let color = this.point.color;


          return '<div style="margin-top: -15.5px; text-align:center; background-color:'+color+'; width:10px;"><span style="background-color:'+ color +';font-size:12px;color:' +
              color + '">' + this.point.name + '</span> <br/>' +
              '<span style="background-color:'+ color +';font-size:12px;color:' +
              color + '">' + this.point.id + '</span><br/>' +
              '<span style="background-color:'+ color +';font-size:12px;color:' +
              color + '">' + this.point.key + '</span><br/>'+
              '</div>'
        },
        //align:'right',
        //overflow:"false",
        //crop:"true",
        borderRadius: 5,
        //width:10,
       // backgroundColor: this.point.color,
        borderWidth: 1,
        borderColor: '#AAA',
        y: -6,

        allowOverlap: false,
        style: {
          textOutline: false,
          fontSize: '0.9em',
          fontWeight: 'normal',
          textOverflow: 'ellipsis',
          width:180,
        }
      },

      data:productModel ? mapToEdges(productModel.edges) : [],
     nodes:productModel ? mapToNodes(productModel.nodes) : []
    };

    const options: Highcharts.Options = {
      chart: {
        type: 'networkgraph',
        marginTop: 80,
        height:1200
      },
      title: {
        text: `Product Model Graph for ${productModel.subject.fsn.term}[ ${productModel.subject.conceptId}]`
      },
      tooltip: {
        formatter: function () {
          return 'Name: <b>' + this.point.name + '</b><br>Concept ID: ' + '<b>'+this.point.id+'</b> <br>'+ 'Model: <b>' + this.point.key + '</b>'
        }
      },
      legend: {
        enabled: true
      },

      plotOptions: {
        networkgraph: {
          keys: ['from', 'to','relation','color'],
          layoutAlgorithm: {
            enableSimulation: true,
            integration: 'verlet',
            linkLength: 250
          },

        }
      },


      series: [seriesOptions],
    };

    return (
        <Fragment>
          {options && (
              <>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options}
                    //callback={callback}
                    ref={chartRef}
                    allowChartUpdate={true}
                    immutable={true}
                    {...props}
                />
              </>
          )}
        </Fragment>
    );
  };
  return  (<Box ><ProductModelNetworkGraph /> </Box>);
}



export default ProductModelGraph;