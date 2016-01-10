function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getContrast50(hexcolor){
  return (parseInt(hexcolor, 16) > 0xffffff/2) ? 'black':'white';
}

function getRandomColor() {
  var color = Math.floor(Math.random() * 16777215).toString(16);
  var contrast = getContrast50(color);
  return {
    color: '#' + color,
    contrast: contrast
  }
}

function adjustColors(colors, ctx, $element) {
  var color = colors.color;
  var contrast = colors.contrast;
  var $h1 = $element.find('h1');
  $h1.css('color', color);
  $h1.css('background-color', contrast);
  ctx.strokeStyle = color;
}

function getGraphData($element) {
  return JSON.parse($element.attr('data'));
}

function setupGraphCanvas($element) {
  var $canvas = $element.find('canvas');
  var ctx = $canvas.get(0).getContext("2d");

  var parentWidth = $element.width();
  var height = $(window).height() / 2;

  $canvas.attr('width', parentWidth);
  $canvas.attr('height', height);

  return {"ctx": ctx, "canvas": $canvas};
}

function drawGraph(data, ctx, $canvas) {
  var width = $canvas.width();
  var height = $canvas.height();

  var sizeOrder = data.slice().sort(function(a,b){return b-a;});
  var uniqueValues = data.slice().filter(function(item, pos) {
    return data.slice().indexOf(item) == pos;
  });

  var yPadding = 4;

  for (var i = 0; i < yPadding; i++) {
    var lastEntry = uniqueValues[uniqueValues.length - 1];
    uniqueValues.push(lastEntry++);
  }

  for (var i = 0; i < yPadding; i++) {
    var firstEntry = uniqueValues[0];
    uniqueValues.unshift(lastEntry--);
  }

  var xCol = data.length;
  var yCol = uniqueValues.length;

  var xSpacing = width / (xCol / 2);
  var ySpacing = height / (yCol / 2);

  var points = [];

  //Construct points
  data.forEach(function(element, index) {
    var point = {
      x: xSpacing * index,
      y: uniqueValues.indexOf(element) * ySpacing
    };
    points.push(point);
  });

  // Draw points
  ctx.lineWidth = 10;
  for (var i = 0; i < points.length; i++) {
    ctx.beginPath();
    var point1 = points[i];
    var point2 = points[i + 1];
    if (point2 == undefined) {
      break;
    }
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.stroke();
  }
}

function addGif($element, word) {
  $.get('http://api.giphy.com/v1/gifs/search?q=' + word + '&limit=1&rating=pg&api_key=dc6zaTOxFJmzC', function(data) {
    if (data.data[0] == undefined) {
      return;
    }
    var gifUrl = data.data[0].images.original.url;
    $element.css('background-image', 'url(' + gifUrl + ')');
  });
}

$(document).on('ready', function() {

  $('.graph').each(function() {
    var graphData = getGraphData($(this));
    var canvasSetup = setupGraphCanvas($(this));
    var ctx = canvasSetup.ctx;
    var $canvas = canvasSetup.canvas;
    var colors = getRandomColor();
    adjustColors(colors, ctx, $(this));
    drawGraph(graphData.value, ctx, $canvas);
    addGif($(this), graphData.key);
  });

});

// function getChartData() {
//   console.log("Loading....");
//   $.get('/data', function(res) {
//     console.log("Data recieved");
//     // Get Data from server
//     // var existingData = res;
//     var existingData = res.slice(-1 * 1);
//
//     // Format it for chartjs
//     var dataSets = [];
//     console.log("Formatting data");
//     existingData.forEach(function(element) {
//       var values = element.value;
//       if (element.value.length != 50) {
//         var toAdd = 50 - element.value.length;
//         for(var index = 0; index < toAdd; index++) {
//           values.unshift(0);
//         }
//       }
//       var r = getRandomInt(0, 255);
//       var g = getRandomInt(0, 255);
//       var b = getRandomInt(0, 255);
//       dataSets.push({
//         label: element.key,
//         fillColor: "rgba(rr,gg,bb,0.1)".replace("rr", r).replace("gg", g).replace("bb", b),
//         strokeColor: "rgba(rr,gg,bb,1)".replace("rr", r).replace("gg", g).replace("bb", b),
//         pointColor: "rgba(rr,gg,bb,1)".replace("rr", r).replace("gg", g).replace("bb", b),
//         pointStrokeColor: "#fff",
//         pointHighlightFill: "#fff",
//         pointHighlightStroke: "rgba(220,220,220,1)",
//         data: values
//       });
//     });
//     console.log("Data formatted");
//
//     var labels = [];
//     for (var index = 100; index > 0; index -= 2) {
//       labels.push("-" + index + "m");
//     }
//     console.log("Labels created")
//     var data = {
//       labels: labels,
//       datasets: dataSets
//     };
//     initChart(data);
//   });
// }
//
// function initChart(data) {
//   console.log("Building chart...");
//
//   // Build Chart
//   var $chart = $('<canvas id="tracker" width="400" height="400"></canvas>');
//   $('body').append($chart);
//
//   var ctx = $chart.get(0).getContext("2d");
//   var lineChart = new Chart(ctx).Line(data, {});
// }

//----------
