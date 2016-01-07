$('<div></div>').load('q?url=bbc.com', function() {
  $(this).find('.media__link').each(function() {
    buildHeadline($(this).text().trim(), $(this).attr('href'));
  });
});
