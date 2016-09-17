/**
 * Created by Teodora on 13.05.2016.
 */

var data = [4, 8, 15, 16, 23, 42];

var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 420]);

d3.select(".chart")
    .selectAll("div")
    .data(data)
    .enter().append("div")
    .style("width", function(d)
    { return x(d) + "px"; })
    .style("background-color","blue")
    .text(function(d) { return d; });


var url = '../json_db/tobacco_use.json';
d3.json(url, function(error, data) {
    console.log(error);
    console.log(data);
});