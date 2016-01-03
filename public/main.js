function getContent(url, callback) {
  $.get('q?url=' + url, function(data) {
    callback(data);
  });
}

function buildTile(title, link, photo) {
  console.log(title);
  var $tile = $('<div class="tile" style="background-image: url(' + photo + ')"></div>');
  var $anchor = $('<a></a>').attr('href', link);
  $tile.append($anchor);
  var $title = $('<h1></h1>').text(title);
  $anchor.append($title);
  $('.tile_container').append($tile);
}
