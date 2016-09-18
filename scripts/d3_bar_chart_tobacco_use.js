(function () {
    var tobbaco_url = "json_db/tobacco_use.json";

    var margin = {top: 20, right: 20, bottom: 70, left: 40},
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(10);

    var europeData = [];


    d3.json(tobbaco_url, function (error, tobbacoData) {

        var data = tobbacoData.fact;
        var macedonia = "Macedonia";
        var filteredData = [];

        var allCountries = [];
        var countriesMap = {};

        for (var i = 0; i < data.length; i++) {
            if (data[i].dim.REGION === 'Europe' && data[i].dim.SEX == "Male") {
                europeData.push(data[i]);
                if (typeof countriesMap[data[i].dim.COUNTRY] === 'undefined') {
                    allCountries.push(data[i].dim.COUNTRY);
                    countriesMap[data[i].dim.COUNTRY] = 'inserted';
                }
                if (data[i].dim.COUNTRY == macedonia) {
                    filteredData.push(data[i]);
                }
            }
        }
        countriesMap = {};
        allCountries.sort();
        addCountriesToDropdown(allCountries);
        filteredData.sort(compareYears);
        drawGraph(filteredData);
    });

    function addCountriesToDropdown(countries) {
        var dropDown = $('#addCountry');
        for (var i = 0; i < countries.length; i++) {
            dropDown.append('<li class="dropdown-item"><a onclick="clickDropDown(\'' + countries[i] + '\')">' + countries[i] + '</a></li>')
        }
    }



    window.clickDropDown = function (country) {
        var filteredData = [];
        $('#tobacoCountryName').text(country);
        for (var i = 0; i < europeData.length; i++) {
            if (europeData[i].dim.COUNTRY == country) {
                filteredData.push(europeData[i]);
            }
        }
        filteredData.sort(compareYears);
        d3.select("svg").remove();
        drawGraph(filteredData);

    }

    function drawGraph(data) {

        var svg = d3.select(".tobbacoGraph").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        data.forEach(function (d) {
            d.graphYear = d.dim.YEAR;
            d.graphValue = d.Value.replace(/ \[.*\]/gi, '');
        });

        x.domain(data.map(function (d) {
            return d.graphYear;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.graphValue;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)");

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
            .style("fill", "lightsteelblue")
            .attr("x", function (d) {
                return x(d.graphYear);
            })
            .attr("width", x.rangeBand())
            .attr("y", function (d) {
                return y(d.graphValue);
            })
            .attr("height", function (d) {
                return height - y(d.graphValue);
            })



    }


    function compareYears(a, b) {
        var first = parseInt(a.dim.YEAR);
        var second = parseInt(b.dim.YEAR);
        if (first < second) {
            return -1
        }
        if (first > second) {
            return 1;
        }
        return 0;
    }

})();