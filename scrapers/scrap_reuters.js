var Module = function(){};
var url = 'reuters.com';

Module.prototype.search = function(cheerio, worker){
  worker.getContent(url, function contentRecieved(html) {
    $ = cheerio.load(html);
    var count = 0;
    $('h2 a').each(function() {
      var link = $(this).attr('href');
      if (link.indexOf(url) == -1) {
        link = 'http://www.' + url + $(this).attr('href');
      }
      worker.buildHeadline($(this).text().trim(), link);
      count++;
    });
    console.log("Finished scraping", url, count);

    // Alert main that we've finished
    var path = require('path');
    var scriptName = path.basename(__filename);
    worker.finishedScraping(scriptName, count);
  });
}

module.exports = Module;
