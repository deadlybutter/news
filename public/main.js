function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getChartData() {
  console.log("Loading....");
  $.get('/data', function(res) {
    console.log("Data recieved");
    // Get Data from server
    // var existingData = res;
    var existingData = res.slice(-1 * 1);

    // Format it for chartjs
    var dataSets = [];
    console.log("Formatting data");
    existingData.forEach(function(element) {
      var values = element.value;
      if (element.value.length != 50) {
        var toAdd = 50 - element.value.length;
        for(var index = 0; index < toAdd; index++) {
          values.unshift(0);
        }
      }
      var r = getRandomInt(0, 255);
      var g = getRandomInt(0, 255);
      var b = getRandomInt(0, 255);
      dataSets.push({
        label: element.key,
        fillColor: "rgba(rr,gg,bb,0.1)".replace("rr", r).replace("gg", g).replace("bb", b),
        strokeColor: "rgba(rr,gg,bb,1)".replace("rr", r).replace("gg", g).replace("bb", b),
        pointColor: "rgba(rr,gg,bb,1)".replace("rr", r).replace("gg", g).replace("bb", b),
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: values
      });
    });
    console.log("Data formatted");

    var labels = [];
    for (var index = 100; index > 0; index -= 2) {
      labels.push("-" + index + "m");
    }
    console.log("Labels created")
    var data = {
      labels: labels,
      datasets: dataSets
    };
    initChart(data);
  });
}

function initChart(data) {
  console.log("Building chart...");

  // Build Chart
  var $chart = $('<canvas id="tracker" width="400" height="400"></canvas>');
  $('body').append($chart);

  var ctx = $chart.get(0).getContext("2d");
  var lineChart = new Chart(ctx).Line(data, {});
}

$(document).on('ready', function() {
  getChartData();
});
