(function() {

  var tobbacoTaxesUrl = 'json_db/tobacco_taxes.json';

  var margin = {top: 30, right: 20, bottom: 40, left: 80},
    width = 800 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// Set the ranges
  var x = d3.scale.ordinal().rangePoints([0, width]);
  var y = d3.scale.linear().range([height, 0]);


// Define the axes
  var xAxis = d3.svg.axis().scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis().scale(y)
    .orient("left");

// Define the line
  var valueline = d3.svg.line()
    .x(function(d) {  console.log("x = " + x(d.country)); return x(d.country); })
    .y(function(d) { console.log("y = " + y(d.value)); return y(d.value); });

// Adds the svg canvas
  var svg = d3.select(".tobaccoAverageTaxes")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// Get the data
  d3.json(tobbacoTaxesUrl, function(error, tobbacoData) {
    var data = [];
    var notApplicable = 'Not available';
    var year = "2012";
    var countries = ['Macedonia', 'Serbia', 'Greece', 'Bulgaria','Germany','Albania','Bosnia and Herzegovina','France'];
    var insertedCountries = {};
    for (var i = 0; i < tobbacoData.fact.length; i++) {
      if (tobbacoData.fact[i].dim.REGION == 'Europe' && tobbacoData.fact[i].dim.YEAR == year && tobbacoData.fact[i].Value != notApplicable && tobbacoData.fact[i].Value != '0.00') {
        for (var n = 0; n < countries.length; n++) {
          if (tobbacoData.fact[i].dim.COUNTRY == countries[n] && typeof insertedCountries[tobbacoData.fact[i].dim.COUNTRY] === 'undefined') {
            data.push({"value" : parseFloat(tobbacoData.fact[i].Value), "country" : tobbacoData.fact[i].dim.COUNTRY});
            insertedCountries[tobbacoData.fact[i].dim.COUNTRY] = 'inserted';
            break;
          }
        }
      }
    }
    data.sort(comparator);

    console.log(data);

    // Scale the range of the data
    x.domain(data.map(function (d) {return  d.country}));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);
    //x.domain(d3.extent(data, function(d) { return d.country; }));
    //y.domain(d3.extent(data, function(d) { return d.value; }));

    // Add the valueline path.
    svg.append("path")
      .attr("class", "line")
      .attr("d", valueline(data));

    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function(d) { return x(d.country); })
        .attr("cy", function(d) { return y(d.value); })



    // Add the X Axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add the Y Axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  });

  function comparator(first, second) {
    return first.country.localeCompare(second.country);
  }


})();