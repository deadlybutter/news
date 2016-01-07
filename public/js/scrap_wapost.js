$('<div></div>').load('q?url=nytimes.com', function() {
  $(this).find('.story-heading a').each(function() {
    buildHeadline($(this).text().trim(), $(this).attr('href'));
  });
});
