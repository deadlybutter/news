$('<div></div>').load('q?url=http://www.theguardian.com/', function() {
  $(this).find('.fc-item__title a').each(function() {
    buildHeadline($(this).text().trim(), $(this).attr('href'));
  });
});
