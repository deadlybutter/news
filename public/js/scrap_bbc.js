$('<div></div>').load('q?url=bbc.com', function() {
  $(this).find('.media__link').each(function() {
    var link = $(this).attr('href');
    if (link.indexOf('bbc.com') == -1) {
      link = 'http://www.bbc.com' + $(this).attr('href');
    }
    buildHeadline($(this).text().trim(), link);
  });
});
