import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import APP_RESOURCES from '@salesforce/resourceUrl/ps2D3OrgChart';

export default class Ps2D3OrgChart extends LightningElement {
    chartInitialized = false;

    async renderedCallback() {
        if (this.chartInitialized) {
            return;
        }


        try {
            await Promise.all([
                loadScript(this, APP_RESOURCES + '/d3.v7.min.js'),
                loadScript(this, APP_RESOURCES + '/d3-org-chart@2.js'),
                loadScript(this, APP_RESOURCES + '/d3-flextree.js')
            ]);

            this.chartInitialized = true;
            this.initializeChart();
        }
        catch (error) {
            console.error('Error loading d3-org-chart', error);
        }
    }

    initializeChart() {

        const chartContainer = this.template.querySelector('.chart-container');

         var chart;

        // --- Embedded CSV Data ---
        const orgCsvData = [{"name":"Connie Marigold","imageUrl":"https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg","area":"Immediate Family","positionName":"Child","id":"O-1","parentId":""},{"name":"Gladys Marigold","imageUrl":"https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg","area":"Immediate Family","positionName":"Mother","id":"O-2","parentId":"O-1"},{"name":"Michael Childers","imageUrl":"https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg","area":"Other","positionName":"Caretaker","id":"O-3","parentId":"O-1"},{"name":"Sarah Childers","imageUrl":"https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg","area":"Other","positionName":"Caretaker","id":"O-4","parentId":"O-1"},{"name":"Dwight Eisenhower","imageUrl":"https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg","area":"Other","positionName":"Boyfriend","id":"O-5","parentId":"O-1"},{"name":"Martha Stephens","imageUrl":"https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg","area":"Other","positionName":"Child Protective Investigator","id":"O-6","parentId":"O-1"},{"name":"Glenda West","imageUrl":"https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg","area":"Extended Family","positionName":"3rd Party Observer","id":"O-7","parentId":"O-1"}];
        // --- End Embedded CSV Data ---


        const dataFlattened = orgCsvData; // Use the embedded data

        // Define a color mapping for each area with updated colors
        const areaColors = {
            "Immediate Family": { red: 76, green: 175, blue: 80, alpha: 1 }, // Green (unchanged)
            "Extended Family": { red: 255, green: 255, blue: 224, alpha: 1 },    // Pale Yellow (unchanged)
            "Other": { red: 200, green: 200, blue: 200, alpha: 1 }          // Lighter Grey
        };


        const mappedData = dataFlattened.map((d) => {
            const width = Math.round(Math.random() * 50 + 300);
            const height = Math.round(Math.random() * 20 + 130);
            const cornerShape = ['ORIGINAL', 'ROUNDED', 'CIRCLE'][
                Math.round(Math.random() * 2)
            ];
            const nodeImageWidth = 100;
            const nodeImageHeight = 100;
            const centerTopDistance = 0;
            const centerLeftDistance = 0;
            const expanded = false;

            const titleMarginLeft = nodeImageWidth / 2 + 20 + centerLeftDistance;
            const contentMarginLeft = width / 2 + 25;

            // Get the background color based on the area
            const nodeBackgroundColor = areaColors[d.area] || areaColors["Other"]; // Default to 'Other' if area is not found


            return {
                nodeId: d.id,
                parentNodeId: d.parentId,
                width: width,
                height: height,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: {
                    red: 15,
                    green: 140,
                    blue: 121,
                    alpha: 1,
                },
                // Use the determined background color
                backgroundColor: nodeBackgroundColor,
                nodeImage: {
                    url: d.imageUrl,
                    width: nodeImageWidth,
                    height: nodeImageHeight,
                    centerTopDistance: centerTopDistance,
                    centerLeftDistance: centerLeftDistance,
                    cornerShape: cornerShape,
                    shadow: false,
                    borderWidth: 0,
                    borderColor: {
                        red: 19,
                        green: 123,
                        blue: 128,
                        alpha: 1,
                    },
                },
                nodeIcon: {
                    icon: 'https://to.ly/1yZnX',
                    size: 30,
                },
                template: `<div>
                            <div style="margin-left:${titleMarginLeft}px;
                                        margin-top:10px;
                                        font-size:15px;
                                        font-weight:bold;
                                        color: ${d.area === 'Extended Family' ? 'black' : 'inherit'};
                                    ">${d.name} </div>
                           <div style="margin-left:${titleMarginLeft}px;
                                        margin-top:3px;
                                        font-size:13px;
                                        color: ${d.area === 'Extended Family' ? 'black' : 'inherit'};
                                    ">${d.positionName} </div>



                           <div style="margin-left:${contentMarginLeft}px;
                                        margin-top:15px;
                                        font-size:12px;
                                        position:absolute;
                                        bottom:5px;
                                        color: ${d.area === 'Extended Family' ? 'black' : 'inherit'};
                                    ">

                               <div style="font-size:12px;margin-top:5px; color: ${d.area === 'Extended Family' ? 'black' : 'inherit'};">${d.area}</div>
                           </div>
                        </div>`,
                connectorLineColor: {
                    red: 220,
                    green: 189,
                    blue: 207,
                    alpha: 1,
                },
                connectorLineWidth: 5,
                dashArray: '',
                expanded: expanded,
            };
        });

        chart = new d3.OrgChart()
            .container(chartContainer)
            .data(mappedData)
            .nodeWidth((n) => 250)
            .nodeHeight((n) => 120)
            .compactMarginBetween((d) => 50)
            .siblingsMargin((d) => 100)
            .nodeContent((d) => {
                const bgColor = d.data.backgroundColor;
                 const bgColorRGBA = `rgba(${bgColor.red}, ${bgColor.green}, ${bgColor.blue}, ${bgColor.alpha})`;

                // Determine text color based on area
                const textColor = d.data.area === 'Extended Family' ? 'black' : 'white';


                return `
                    <div class="outer-wrapper" style="padding-left:70px;padding-top:0px;background-color:none;width:${
                      d.width - 70
                    }px;height:${d.height}px">
                        <img style="border-radius:5px;margin-left:-100px;margin-top:-20px" width=60 height=60 src="${
                          d.data.nodeImage.url
                        }"/>

                        <div  style="margin-left:-70px;margin-top:-40px;border-radius:5px;color:white;background-color:${bgColorRGBA};width:${
                          d.width
                        }px;  height:${d.height}px">
                           <div style="margin-left:-30px;padding-top:2px">${
                             d.data.template
                           }</div>

                        </div>

                        <div style="color:${textColor};margin-top:-37px;margin-left:-65px"> ${
                          d.data._totalSubordinates
                        } Subordinates <br/> ${d.data._directSubordinates} Direct</div>
                    </div>
                    `;
            })
            .render();

        // Collapse all nodes after initial render
        chart.collapseAll();
        
        /*
        const data = [
            { id: 1, name: 'CEO', parentId: null },
            { id: 2, name: 'VP Marketing', parentId: 1 },
            { id: 3, name: 'VP Sales', parentId: 1 },
            { id: 4, name: 'Marketing Manager', parentId: 2 },
            { id: 5, name: 'Sales Manager', parentId: 3 }
        ];

        const chartContainer = this.template.querySelector('.chart-container');

        const chart = new d3.OrgChart()
            .container(chartContainer)
            .data(data)
            .nodeWidth(() => 200)
            .nodeHeight(() => 100)
            .childrenMargin(() => 40)
            .compact(false)
            .nodeContent((d) => `
        <div style="padding:10px; border:1px solid #ccc; border-radius:8px; background:#f9f9f9;">
          <div style="font-weight:bold;">${d.data.name}</div>
        </div>
      `)
            .render();
            */

            
    }
}