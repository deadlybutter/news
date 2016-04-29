var sanitizeHtml = require('sanitize-html');
var request = require('superagent');
var moment = require('moment');
var CronJob = require('cron').CronJob;

var Firebase = require("firebase");
var rootRef = new Firebase(process.env.FIREBASE_URL);

var websites = process.env.WEBSITES ? JSON.stringify(process.env.WEBSITES) : ['http://www.nytimes.com', 'http://www.cnn.com'];

var crawl = [];

function getTrump(text) {
  return (text.match(/trump/g) || []).length;
}

function getCruz(text) {
  return (text.match(/cruz/g) || []).length;
}

function getKasich(text) {
  return (text.match(/kasich/g) || []).length;
}

function getSanders(text) {
  return (text.match(/sanders/g) || []).length + (text.match(/bernie/g) || []).length;
}

function getClinton(text) {
  return (text.match(/clinton/g) || []).length + (text.match(/hillary/g) || []).length;
}

function scrapWebsites(candidate, getCount, websiteIndex, done) {
  var url = websites[websiteIndex];
  request
    .get(url)
    .end(function(req, res) {
      var raw = res.text;
      var clean = sanitizeHtml(raw);
      var count = getCount(clean);
      candidate.count += count;

      websiteIndex++;
      if (websiteIndex >= websites.length) {
        done(candidate);
        return;
      }
      scrapWebsites(candidate, getCount, websiteIndex, done);
    });
}

function doCrawl() {
  crawl.push({meta: true, timestamp: moment().format()});
  scrapWebsites({name: "Donald Trump", count: 0}, getTrump, 0, function(candidate) {
    crawl.push(candidate);
    scrapWebsites({name: "Ted Cruz", count: 0}, getCruz, 0, function(candidate) {
      crawl.push(candidate);
      scrapWebsites({name: "John Kasich", count: 0}, getKasich, 0, function(candidate) {
        crawl.push(candidate);
        scrapWebsites({name: "Bernie Sanders", count: 0}, getSanders, 0, function(candidate) {
          crawl.push(candidate);
          scrapWebsites({name: "Hillary Clinton", count: 0}, getClinton, 0, function(candidate) {
            crawl.push(candidate);

            rootRef.once("value", function(snapshot) {
              if (snapshot.val() == null) {
                crawls = [];
              }
              else {
                crawls = snapshot.val().crawls;

                if (!crawls) {
                  crawls = [];
                }
              }

              if (crawls.length >= 48) {
                crawls.shift();
              }

              crawls.push(crawl);
              rootRef.set({'crawls': crawls});
              crawl = [];
            });

          });
        });
      });
    });
  });
}

if (process.env.MODE == "DEV") {
  new CronJob('*/10 * * * * *', function() {
    doCrawl();
  }, null, true, 'America/New_York');
}
else if (process.env.MODE == "PROD") {
  new CronJob('0 */30 * * * *', function() {
    doCrawl();
  }, null, true, 'America/New_York');
}
