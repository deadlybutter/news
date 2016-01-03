var $container = $('<div></div>');
$container.load('q?url=nytimes.com', function() {
  var photo = $container.find('.photo-spot-region img').attr('src');
  console.log(photo);
  var $anchor = $container.find('.photo-spot-region .story-heading a');
  var title = $anchor.text();
  var link = $anchor.attr('href');
  buildTile(title, link, photo);
});
