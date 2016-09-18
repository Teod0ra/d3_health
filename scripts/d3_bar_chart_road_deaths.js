(function() {

  roadDeathsUrl = 'json_db/roads_deaths.json';

  var margin = {top: 20, right: 20, bottom: 100, left: 40},
    width = 900 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangeRoundBands([0, width], .3);

  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10);

  d3.json(roadDeathsUrl, function(error, roadDethsData) {
    var deathsPerCountry = [];
    var year = '2013';
    var data = roadDethsData.fact;
    var gho = 'Estimated number of road traffic deaths';
    var region = 'Europe';

    for (var i = 0; i < data.length; i++) {
      if (data[i].dim.GHO == gho && data[i].dim.REGION == region && data[i].dim.YEAR == year) {
        deathsPerCountry.push({country : data[i].dim.COUNTRY, value : parseInt(data[i].Value.replace(/ \[.*\]/gi, ''))})
      }
    }
    deathsPerCountry.sort(sortByCountry);

    drawGraph(deathsPerCountry);
  });

  function drawGraph(data) {

    var svg = d3.select(".deathsPerCountry").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

    x.domain(data.map(function(d) { return d.country; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)" );

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

    svg.selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", "#00008b")
      .attr("x", function(d) { return x(d.country); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });
  }

  function sortByCountry(a,b) {
    return a.country.localeCompare(b.country);
  }

})();