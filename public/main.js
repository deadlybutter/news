function setColors(chart) {
  chart.assignColor("Donald Trump", "#d65454");
  chart.assignColor("Ted Cruz", "#e7ba52");
  chart.assignColor("John Kasich", "#3ca0a0");
  chart.assignColor("Hillary Clinton", "#4a8fd3");
  chart.assignColor("Bernie Sanders", "#8ecc64");
}

function buildOverallGraph(data) {
  var svg = dimple.newSvg("#graph", "100%", 600);
  var chart = new dimple.chart(svg, data);
  // chart.setBounds(60, 30, 505, 305);
  var x = chart.addCategoryAxis("x", "timestamp");
  x.addOrderRule("Date");
  chart.addMeasureAxis("y", "count");
  var s = chart.addSeries("candidate", dimple.plot.line);
  s.interpolation = "step";
  chart.addLegend(150, 10, 700, 20, "left");
  setColors(chart);
  chart.draw();
}

function buildSiteGraph(data, site, id) {
  $('#subgraphs').append(`<div id=${id} class="chart"></div>`);
  var svg = dimple.newSvg(`#${id}`, 800, 400);
  data = dimple.filterData(data, "site", site);
  var chart = new dimple.chart(svg, data);
  var x = chart.addCategoryAxis("x", "timestamp");
  x.addOrderRule("Date");
  chart.addMeasureAxis("y", "total");
  var s = chart.addSeries("candidate", dimple.plot.line);
  s.interpolation = "step";
  // chart.addLegend(50, 10, 700, 20, "left");
  setColors(chart);
  chart.draw();
  $(`#${id}`).prepend(`<h3 style="text-align">${site}</h3>`);
}

$(document).on('ready', function() {
  var rawGraphData = $('#graph').data('candidates');
  var graphData = [];
  var siteSpecificData = [];

  rawGraphData.forEach(function(candidates) {
    var meta = candidates.shift();
    var timestamp = meta.timestamp;

    candidates.forEach(function(c) {
      graphData.push({
        "timestamp": timestamp,
        "candidate": c.name,
        "count": c.count
      });

      if (c.siteCounts) {
        c.siteCounts.forEach(function(s) {
          s.candidate = c.name;
          s.timestamp = timestamp;
          siteSpecificData.push(s);
        });
      }
    });
  });

  buildOverallGraph(graphData);
  buildSiteGraph(siteSpecificData, "http://www.nytimes.com", "nytimes");
  buildSiteGraph(siteSpecificData, "http://www.cnn.com", "cnn");
  buildSiteGraph(siteSpecificData, "http://www.washingtonpost.com", "washingtonpost");
  buildSiteGraph(siteSpecificData, "http://www.politico.com/", "politico");
});
