$('<div></div>').load('q?url=reuters.com', function() {
  $(this).find('h2 a').each(function() {
    var link = $(this).attr('href');
    if (link.indexOf('reuters.com') == -1) {
      link = 'http://www.reuters.com' + $(this).attr('href');
    }
    buildHeadline($(this).text().trim(), link);
  });
});
