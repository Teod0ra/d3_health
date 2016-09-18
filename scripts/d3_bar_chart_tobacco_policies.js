(function() {
  var tobbaco_url = "json_db/tobacco_policies.json";

  var margin = {top: 20, right: 20, bottom: 70, left: 400},
    width = 700 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

  var y_use = d3.scale.ordinal().rangeRoundBands([0, height], 0.1);

  var x_use = d3.scale.linear().range([0, width]);
  var color = d3.scale.ordinal().range(["#6495ed", "#5f9ea0", "#87cefa", "#1e90ff"]);

  var xAxis_use = d3.svg.axis()
    .scale(x_use)
    .orient("bottom");
  var yAxis_use = d3.svg.axis()
    .scale(y_use)
    .orient("left");


  d3.json(tobbaco_url, function (error, tobaccoPolicies) {

    var data = tobaccoPolicies.fact;
    var notAplicable = ['Not applicable', 'Data not reported', 'None', 'Data not reported/not categorized'];

    var policies = {};

    for (var i = 0; i < data.length; i++) {
      var notAplicableForList = false;
      for (var n = 0; n < notAplicable.length; n++) {
        if (data[i].Value == notAplicable[n]) {
          notAplicableForList = true;
        }
      }
      if (notAplicableForList) {
        continue;
      }
      if (data[i].dim.REGION !== 'Europe') {
        continue;
      }
      if (typeof policies[data[i].Value] === 'undefined') {
        policies[data[i].Value] = 1;
      } else {
        policies[data[i].Value] = policies[data[i].Value] + 1;
      }
    }
    var listPolicies = [];
    for (var police in policies) {
      if (policies.hasOwnProperty(police)) {
        if (police.length < 60) {
          listPolicies.push({"police": police, "value": policies[police]});
        }
      }
    }
    drawHorizontalBarGraph(listPolicies)
  });

  function drawHorizontalBarGraph(data) {

    var svg = d3.select(".tobaccoPolicies").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");


    x_use.domain([0, d3.max(data, function (d) {
      return d.value;
    })]);
    y_use.domain(data.map(function (d) {
      return d.police;
    }));

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis_use)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis_use)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");

    svg.selectAll("bar")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", function(d, i) {
          return color(i);
        })
      .attr("y", function (d) {
        return y_use(d.police);
      })
      .attr("height", y_use.rangeBand())
      .attr("x", 0)
      .attr("width", function (d) {
        return x_use(d.value);
      })

  }
})();
