function getContent(url, callback) {
  $.get('q?url=' + url, function(data) {
    callback(data);
  });
}

function buildHeadline(text, link) {
  $('.headline-container').append('<a href="' + link + '">' + text + '</a>');
}
