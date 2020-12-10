
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // SVG wrapper dimensions are determined by the current width and
    // height below.

    var svgWidth = 800;
    var svgHeight = 500;

    var margin = {
        top: 50,
        bottom: 50,
        right: 50,
        left: 50
    };
    var height = svgHeight - margin.top - margin.bottom;
    var width = svgWidth - margin.left - margin.right;

    // Append SVG element
    var svg = d3
        .select("#scatter")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    // Append group element
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Read CSV
    //d3.csv("../assets/data/data.csv").then(function (dataC) {
    //  console.log(dataC)

    // Import Data
    d3.csv("..assets/data/data.csv").then(function (dataC) {

        // Step 1: Parse Data/Cast as numbers
        // ==============================
        dataC.forEach(function (data) {
            data.poverty = +data.poverty;
            data.healthcare = +data.healthcare;
        });

        // Step 2: Create scale functions
        // ==============================
        var xLinearScale = d3.scaleLinear()
            .domain([20, d3.max(dataC, d => d.poverty)])
            .range([0, width]);

        var yLinearScale = d3.scaleLinear()
            .domain([0, d3.max(dataC, d => d.healthcare)])
            .range([height, 0]);


        // Step 3: Create axis functions
        // ==============================
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // Step 4: Append Axes to the chart
        // ==============================
        chartGroup.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        chartGroup.append("g")
            .call(leftAxis);


        // Step 5: Create Circles
        // ==============================
        var circlesGroup = chartGroup.selectAll("circle")
            .data(dataC)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r", (d) => d.healthcare)
            .attr("fill", "blue")
            .attr("opacity", ".5");
        chartGroup
            .selectAll(null)
            .data(dataC)
            .enter()
            .append("text")
            .text((d) => d.abbr)
            .attr("x", function (d) {
                return xLinearScale(d.poverty);
            })
            .attr("y", function (d) {
                return yLinearScale(d.healthcare);
            })
            .attr("text-anchor", "middle")
            .attr("fill", "black")
            .attr("font-size", "11px")
            .attr("font-weight", "bold");

        //initializing tool tip 
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .style("font-size","11px")
            .offset([80,-60])
            .html(function (d) {
                return`<strong>${d.state}<strong><hr>${d.poverty}`;
            });

        //creating tooltip in chartGroup
        chartGroup.call(toolTip);
        
        //mouseover event listner 
        circlesGroup
            .on("mouseover", function (d) {
                toolTip.show(d, this);
            })

        //mouseout event listner 
            .on("mouseout", function (d, index) {
                toolTip.hide(d);
            });


        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Healthcare Provider");

        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
            .attr("class", "axisText")
            .text("Poverty Cases");
    }).catch(function(error) {
        console.log(error);
    });
        

}
makeResponsive();
