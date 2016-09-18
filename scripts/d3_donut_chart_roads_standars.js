(function() {

  var roadsStandarsUrl = 'json_db/roads_vehicles_standars.json';

  d3.json(roadsStandarsUrl, function(error, roadStandarsData) {
    var data = roadStandarsData.fact;

    var numberOfStandars = {};
    var region = 'Europe';
    var value = "Yes";

    for (var i = 0; i < data.length; i++) {
      if (data[i].dim.REGION == region && data[i].Value == value) {
        if (typeof numberOfStandars[data[i].dim.VEHICLESTANDARD] === 'undefined') {
          numberOfStandars[data[i].dim.VEHICLESTANDARD] = 1;
        } else {
          numberOfStandars[data[i].dim.VEHICLESTANDARD] = numberOfStandars[data[i].dim.VEHICLESTANDARD] + 1;
        }
      }
    }

    var standards = [];

    for (var standard in numberOfStandars) {
      if (numberOfStandars.hasOwnProperty(standard)) {
        standards.push({standard: standard, value: numberOfStandars[standard]});
      }
    }

    console.log(standards);

    drawDonutChart(standards);

  });


  function drawDonutChart(data) {
    var width = 600,
      height = 500,
      radius = Math.min(width, height) / 2;


    var color = d3.scale.ordinal()
      .range(["#87cefa","8a2be2","#6495ed", "#1e90ff", "#00008b", "#b0c4de","483d8b"]);

    var arc = d3.svg.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 100);

    var labelArc = d3.svg.arc()
      .outerRadius(radius - 70)
      .innerRadius(radius - 40);

    var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.value; });

    var svg = d3.select(".standardsYes").append("svg")
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
      .style("fill", function(d) { return color(d.data.standard); });

    g.append("text")
      .attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.standard; });
  }

})();