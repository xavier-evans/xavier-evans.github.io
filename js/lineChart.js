class LineChart {

    constructor(_parentElement, _data) {

        this.parentElement = _parentElement;
        this.data = _data;
        this.displayData = [];

        let parseTime = d3.timeParse("%B %d, %Y");

        this.initVis();

    }

    initVis() {

        let vis = this;

        vis.margin = {top: 20, right: 50, bottom: 70, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 500 - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Clip path
        vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // Add title
        vis.svg.append('g')
            .attr('class', 'title')
            .append('text')
            .text('Practice Hours Over the Semester')
            .attr('transform', `translate(${vis.width / 2}, 20)`)
            .attr('text-anchor', 'middle');

        // Initialize scales
        vis.x = d3.scaleTime().range([0, vis.width]);
        vis.y = d3.scaleLinear().range([vis.height, 0]);

        // Path
        vis.path = vis.svg.append("path")
            .attr("class", "line");

        // Line generator
        vis.lineGenerator = d3.line()
            .x(d => vis.x(d.date))
            .y(d => vis.y(d.hours));

        // Initialize axes
        vis.xAxis = d3.axisBottom()
            .ticks(4);
        vis.yAxis = d3.axisLeft();

        // Axis groups
        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + vis.height + ")")
        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "axis y-axis");

        // Axis label
        vis.svg.append("text")
            .attr("class", "axis-title")
            .attr("text-anchor", "middle")
            .attr("x", -vis.height / 2)
            .attr("y", -20)
            .attr("transform", "rotate(-90)")
            .text("Hours");

        vis.wrangleData();

    }

    wrangleData() {

        let vis = this;

        vis.displayData = vis.data;

        vis.updateVis();

    }

    updateVis() {

        let vis = this;

        vis.x.domain([
            d3.min(vis.displayData, d => d.date),
            d3.max(vis.displayData, d => d.date)
        ]);
        vis.y.domain([
            d3.min(vis.displayData, d => d.hours),
            d3.max(vis.displayData, d => d.hours)
        ]);

        vis.path
            .transition()
            .duration(800)
            .attr('d', vis.lineGenerator(vis.displayData));

        vis.circles = vis.svg.selectAll(".edition-circle")
            .data(vis.displayData);

        vis.circles.exit().remove();

        vis.circles.enter().append("circle")
            .attr("class", "edition-circle")
            .merge(vis.circles)
            .transition()
            .duration(800)
            .attr("cx", d => vis.x(d.date))
            .attr("cy", d => vis.y(d.hours))
            .attr("r", 5);

        // Scale axes
        vis.xAxis.scale(vis.x);
        vis.yAxis.scale(vis.y);

        // Grab group, call xAxis
        vis.xAxisGroup
            .transition()
            .duration(800)
            .call(vis.xAxis)
            .selectAll("text")
            .attr("transform", "rotate(45)")
            .style("text-anchor", "start");;
        vis.yAxisGroup
            .transition()
            .duration(800)
            .call(vis.yAxis);

        vis.svg.selectAll("circle")
            .on("mouseover", (_, d) => {
                vis.svg.append("text")
                    .attr("class", "hour-tooltip")
                    .attr("id", `tooltip-${formatTime(d.date)}`)
                    .attr("x", vis.x(d.date) + 10)
                    .attr("y", vis.y(d.hours) + 5)
                    .text(d.hours);
            })
            .on("mouseout", (_, d) => {
                vis.svg.select(`#tooltip-${formatTime(d.date)}`)
                    .remove();
            });
    }
}
