const canvas = d3.select('.canva');

var width = 600;
var height = 600;
//larger
const api_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"
//smaller
// const api_url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson'
const svg = canvas.append('svg')
                    .attr('width', width)
                    .attr('height', height);


//Define a div for the tool tip
var div = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

function timeStamptoDate(mTime) {
        var mDate = new Date(mTime)

        return mDate.toLocaleDateString('en-US');
} 
//Parse Json
d3.json(api_url)
    .then(data => {
        ///here we have our data to create our project
        // console.log(data);
        const circle = svg.selectAll('circle')
                            .data(data.features);
        ///(d, i) => ====callback function to pass data
        circle.attr('cx', (d, i) => d.properties.mag)
                .attr('cy', (d, i) => Math.floor(Math.random() * 100 + d.properties.mag))
                .attr('r', (d, i) => d.properties.mag * 2)
                .attr('fill', (d, i) => d.properties.aler);
        //apend enter selection to add new circles
        circle.enter()
                .append('circle')
                .attr('cx', (d, i) => d.properties.mag * 45)
                .attr('cy', (d, i) => Math.floor(Math.random() * 100 + d.properties.mag))
                .attr('r', (d, i) => d.properties.mag * 2)
                .on("mouseover", function(d, i, n) {
                    d3.select(n[i])
                    .transition()
                    .duration(100)
                    .style('opacity', 0.7)

                    div.transition()
                        .duration(200)
                        .style('opacity', 0.9);
                    
                    div.html('<p>'+ 'Mag:' + d.properties.mag +'<p>'
                    + '<p>' + 'Time:' + timeStamptoDate(d.properties.time) + '<p>'
                    + '<p>' + 'Place:' + d.properties.place.split(',')[1] + '<p>')
                        .style('left', (d3.event.pageX) + 'px')
                        .style('top', (d3.event.pageY -28 ) + 'px')
                })
                .on("mouseout", function(d, i, n) {
                    d3.select(n[i])
                    .transition()
                    .duration(100)
                    .style('opacity', 1)

                    div.transition()
                        .duration(500)
                        .style('opacity', 0)
                })
                .attr('fill', (d, i) => d.properties.alert);
    })