$('<div></div>').load('q?url=www.washingtonpost.com', function() {
  $(this).find('.headline a').each(function() {
    buildHeadline($(this).text().trim(), $(this).attr('href'));
  });
});
