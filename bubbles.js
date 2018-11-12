(function() {
    var width = 500,
    height = 500;

    var svg = d3.select("#chart")
        .append("svg")
        .attr("height",height)
        .attr("width",width)
        .append("g")
        .attr("transform", "translate(0,0)")

    var radiusScale = d3.scaleSqrt().domaine([1,300]).range([10,80])


    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", d3.forceCollide(function(d){
            return radiusScale(d.sales) +1;
        }))

        var data = [{
            x: 1,
            y: 1,
            r: 5,
            c: 'red'
        }, {
            x: 2,
            y: 3,
            r: 5,
            c: 'green'
        }, {
            x: 3,
            y: 2,
            r: 5,
            c: 'blue'
        }];

        var circles = svg.selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("r",function(d){
                return 10;
            })
            .attr("fill","lightblue")

        simulation.nodes(data)
            .on('tick', ticked)

        function ticked(){
            circles
                .attr("cv", function(d){
                    return d.x
                })
                .attr("cy", function(d){
                    return d.y
                })
        }

})();