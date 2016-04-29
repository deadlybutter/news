function buildGraph(data) {
  var svg = dimple.newSvg("#graph", "100%", 600);
  var chart = new dimple.chart(svg, data);
  // chart.setBounds(60, 30, 505, 305);
  var x = chart.addCategoryAxis("x", "timestamp");
  x.addOrderRule("Date");
  chart.addMeasureAxis("y", "count");
  var s = chart.addSeries("candidate", dimple.plot.line);
  s.interpolation = "step";
  chart.addLegend(0, 10, 800, 20, "right");
  chart.draw();
}

$(document).on('ready', function() {
  var rawGraphData = $('#graph').data('candidates');
  var graphData = [];

  rawGraphData.forEach(function(candidates) {
    var meta = candidates.shift();
    var timestamp = meta.timestamp;

    candidates.forEach(function(c) {
      graphData.push({
        "timestamp": timestamp,
        "candidate": c.name,
        "count": c.count
      });
    });
  });

  console.log(graphData);
  buildGraph(graphData);
});
