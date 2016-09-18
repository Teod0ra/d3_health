(function() {

  var registeredVehiclesUrl = 'json_db/roads_registered_vehicles.json';

  var notApplicable = '-';

  var regionsData = {};
  var year = "2013";

  d3.json(registeredVehiclesUrl, function(error, registeredCardsData) {
    var rData = registeredCardsData.fact;
    for (var i = 0; i < rData.length; i++) {
      if (rData[i].Value !== notApplicable && rData[i].dim.YEAR == year) {
        if (typeof regionsData[rData[i].dim.REGION] === 'undefined') {
          var countryData = [];
          countryData.push({year: parseInt(rData[i].dim.YEAR), value: parseInt(rData[i].Value.replace(/ */gi, ''))});
          regionsData[rData[i].dim.REGION] = countryData;
        } else {
          var countryData = regionsData[rData[i].dim.REGION];
          countryData.push({year: parseInt(rData[i].dim.YEAR), value: parseInt(rData[i].Value.replace(/ */gi, ''))});
          regionsData[rData[i].dim.REGION] = countryData;
        }
      }
    }
    var regions = [];
    for (var region in regionsData) {
      if (regionsData.hasOwnProperty(region)) {
        var value = 0;
        var countriesList = regionsData[region];
        for (var i = 0; i < countriesList.length; i++) {
          value += countriesList[i].value;
        }
        regions.push({region: region, value: value});
      }
    }

    regions.sort(regionComparator);
    drawPieChart(regions);
  });



  function drawPieChart(data) {
    var width = 960,
      height = 500,
      radius = Math.min(width, height) / 2;


    var color = d3.scale.ordinal()
      .range(["#87cefa", "#5f9ea0", "#6495ed", "#1e90ff", "#00008b", "#b0c4de"]);

    var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(0);

    var labelArc = d3.svg.arc()
      .outerRadius(radius - 70)
      .innerRadius(radius - 70);

    var pie = d3.layout.pie()
      .sort(regionComparator)
      .value(function(d) { return d.value; });

    var svg = d3.select(".vehiclesRegistered").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .attr("class", "arc");

      g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.region); });

      g.append("text")
        .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.data.region; });
  }

  function regionComparator(a, b) {
    var first = a.region;
    var second = b.region;
    return first.localeCompare(second);
  }

})();