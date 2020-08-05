// @TODO: YOUR CODE HERE!
//create an SVG AREA
// The code for the chart is wrapped inside a function that
// automatically resizes the chart
function makeResponsive() {

    // if the SVG area isn't empty when the browser loads,
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
  
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
  
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = window.innerWidth;
    var svgHeight = window.innerHeight;
  
    var margin = {
      top: 50,
      bottom: 100,
      right: 50,
      left: 100
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
  

    function createCircles(circlesGroup, newXScale, chosenXAxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]));
        
        return circlesGroup;
    }
    function newStates(stateLabels, newXScale, chosenXAxis, newYScale, chosenYAxis) {
        stateLabels.transition()
            .duration(1000)
            .attr("x", d => newXScale(d[chosenXAxis]))
            .attr("y", d => newYScale(d[chosenYAxis]));

        return stateLabels;
    };

    
    function xScale(censusData, chosenXAxis) {
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(censusData, d => d[chosenXAxis]) *0.85, d3.max(censusData, d=>[chosenXAxis]) *1.15])
            // .domain(d3.extent(censusData))
            .range([0, width]);

            return xLinearScale;
        
    };

    function yScale(censusData, chosenYAxis) {
        var yLinearScale = d3.scaleLinear()
            .domain([d3.min(censusData, d => d[chosenYAxis]) *0.85, d3.max(censusData, d=>[chosenYAxis]) *1.15])
            // .domain(d3.extent(extent(censusData)))
            .range([height, 0]);

            return yLinearScale;
        
    };
    var chosenXAxis = "income";
    var chosenYAxis = "obesity";
    var circlesGroup = toolTip(circlesGroup, chosenXAxis, chosenYAxis);
    // Read CSV
    // d3.csv("assets/data/data.csv").then(function(data) {
    //     console.log(data)
    //   // create date 
    
    d3.csv("assets/data/data.csv").then(function(censusData) {
        censusData.forEach(function(data) {
            // data.poverty = +data.poverty;
            // data.age = +data.age;
            data.income = +data.income;
            // data.healthcare = +data.healthcare;
            data.obesity = +data.obesity;
            // data.smokes = +data.smokes;
        });
      
    var chosenXAxis = "income";
    var chosenYAxis = "obesity";
    var chosenXAxisList = [];
    var chosenYAxisList = [];
    for (var i = 0; i < censusData.length; i++) {
        chosenXAxisList.push(parseInt(censusData[i][`${chosenXAxis}`]));
        chosenYAxisList.push(parseInt(censusData[i][`${chosenYAxis}`]));
    };
     
    xLinearScale = xScale(censusData, chosenXAxis);
    yLinearScale = xScale(censusData, chosenYAxis);
    var xLinearScale = xScale(censusData, chosenXAxis);

    var yLinearScale = yScale(censusData, chosenYAxis);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

        
    var circlesGroup = chartGroup.selectAll("circle")
            .data(censusData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", window.innerWidth * 0.015)
            .attr("opacity", 0.7)
            .classed("stateCircle", true);

    var stateLabels = chartGroup.selectAll(".stateText")
            .data(censusData)
            .enter()
            .append("text")
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]))
            .text(d => d.abbr)
            .classed("stateText", true)
            .attr("dy", 6);        

        var xLabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 30})`);

    

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text(`${chosenYAxis}`)

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 20})`)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", `${chosenYAxis}`)
        .text(`${chosenXAxis}`);

    

    

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append("g")
        .call(leftAxis);
});
  
     
        
  // .html(`${d.state}<br>${yLabel}: ${d[chosenYAxis]}%<br>${xLabel}: $${d[chosenXAxis]}`);

      
      // Step 1: Append tooltip div
      var toolTip = d3.select("body")
      .append("div")
      .classed("tooltip", true);

      circlesGroup.call(toolTip);

    // Step 2: Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d) {
      toolTip.style("display", "block")
          .html(
            `${d.state}<br>${yLabel}: ${d[chosenYAxis]}%<br>${xLabel}: $${d[chosenXAxis]}`);
          
    })
      // Step 3: Create "mouseout" event listener to hide tooltip
      .on("mouseout", function() {
        toolTip.style("display", "none");
      

  }).catch(function(error) {
    console.log(error);
  });
}
    //   // Step 2: Create "mouseover" event listener to display tooltip
    //   circlesGroup.on("mouseover", function(d) {
    //     toolTip.style("display", "block")
    //         .html(
    //           `<strong>${dateFormatter(d.date)}<strong><hr>${d.medals}
    //       medal(s) won`)
    //         .style("left", d3.event.pageX + "px")
    //         .style("top", d3.event.pageY + "px");
    //   })
    //     // Step 3: Create "mouseout" event listener to hide tooltip
    //     .on("mouseout", function() {
    //       toolTip.style("display", "none");
    //     });
  
//     }).catch(function(error) {
//       console.log(error);

//   });

// }
  
  // When the browser loads, makeResponsive() is called.
  makeResponsive();
  
  // When the browser window is resized, makeResponsive() is called.
  d3.select(window).on("resize", makeResponsive);
  



  