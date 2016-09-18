(function() {

  var hepatitisUrl = 'json_db/immunization_hepatitis.json';
  var measlesUrl = 'json_db/immunization_measles.json';
  var toxidUrl = 'json_db/immunization_toxid.json';

  var year = "2013";
  var region = "Europe";
// Mike Bostock "margin conventions"
  var margin = {top: 20, right: 20, bottom: 30, left: 140},
    width = 800 - margin.left - margin.right,
    height = 1500 - margin.top - margin.bottom;

// D3 scales = just math
// x is a function that transforms from "domain" (data) into "range" (usual pixels)
// domain gets set after the data loads
  var y = d3.scale.ordinal()
    .rangeRoundBands([0, height], .3);

  var x = d3.scale.linear()
    .range([0, width]);

// D3 Axis - renders a d3 scale in SVG
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(10);

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


// create an SVG element (appended to body)
// set size
// add a "g" element (think "group")
// annoying d3 gotcha - the 'svg' variable here is a 'g' element
// the final line sets the transform on <g>, not on <svg>
  var svg = d3.select(".immunizationGraph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

  svg.append("g")
    .attr("class", "y axis")
    .append("text") // just for the title (ticks are automatic)
    .attr("transform", "rotate(-90)") // rotate the text!
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");

  window.showHepatitis = function() {
    $('#hepatitisBtn').addClass("active");
    $('#measlesBtn').removeClass("active");
    $('#toxidBtn').removeClass("active");
    setGraphData(hepatitisUrl);
  };
  window.showMeasles = function() {
    $('#measlesBtn').addClass("active");
    $('#hepatitisBtn').removeClass("active");
    $('#toxidBtn').removeClass("active");
    setGraphData(measlesUrl);
  };
  window.showToxid = function() {
    $('#toxidBtn').addClass("active");
    $('#measlesBtn').removeClass("active");
    $('#hepatitisBtn').removeClass("active");
    setGraphData(toxidUrl);
  };

  function setGraphData(url) {
    d3.json(url, function(error, hepatitis) {
      var data = hepatitis.fact;
      var hepatitisData = [];
      for (var i = 0; i < data.length; i++) {
        if (data[i].dim.REGION == region && data[i].dim.YEAR == year) {
          hepatitisData.push({country: data[i].dim.COUNTRY, value : parseInt(data[i].Value)});
        }
      }
      hepatitisData.sort(comparatorCountries);
      draw(hepatitisData);
    })
  }


  function draw(data) {
    // measure the domain (for x, unique letters) (for y [0,maxFrequency])
    // now the scales are finished and usable
    x.domain([0, d3.max(data, function(d) { return d.value; })]);
    y.domain(data.map(function(d) { return d.country; }));

    // another g element, this time to move the origin to the bottom of the svg element
    // someSelection.call(thing) is roughly equivalent to thing(someSelection[i])
    //   for everything in the selection\
    // the end result is g populated with text and lines!
    svg.select('.x.axis').transition().duration(300).call(xAxis);

    // same for yAxis but with more transform and a title
    svg.select(".y.axis").transition().duration(300).call(yAxis);

    // THIS IS THE ACTUAL WORK!
    var bars = svg.selectAll(".bar").data(data, function(d) { return d.country; }) // (data) is an array/iterable thing, second argument is an ID generator function

    bars.exit()
      .transition()
      .duration(300)
      .attr("x", x(0))
      .attr("width", x(width))
      .style('fill-opacity', 1e-6)
      .remove();

    // data that needs DOM = enter() (a set/selection, not an event!)
    bars.enter().append("rect")
      .attr("class", "bar")
      .attr("x", x(0))
      .attr("width", x(width));

    // the "UPDATE" set:
    bars.transition().duration(300).attr("y", function(d) { return y(d.country); }) // (d) is one item from the data array, x is the scale object from above
      .attr("height", y.rangeBand()) // constant, so no callback function(d) here
      .attr("x", 0)
      .attr("width", function(d) { return x(d.value); }); // flip the height, because y's domain is bottom up, but SVG renders top down

  }


  function comparatorCountries(a, b) {
    return a.country.localeCompare(b.country);
  }

  showHepatitis();
})();