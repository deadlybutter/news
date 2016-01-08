var cheerio = require('cheerio');
var request = require('superagent');

if (process.env.FIREBASE_URL) {
  var Firebase = require("firebase");
  var rootRef = new Firebase(process.env.FIREBASE_URL);
}

var wordCount = {};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sortObject(obj) {
  var arr = [];
  var prop;
  for (prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      arr.push({
        'key': prop,
        'value': [obj[prop]]
      });
    }
  }
  arr.sort(function(a, b) {
    return a.value - b.value;
  });
  return arr;
}

function removeStopWords(sentence) {
  var common = ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
  // adding words in addition to the default list i copied from the internets
  common.push.apply(common, ["re", "see", "s", "t", "again", "more", "less", "now", "don", "new", "review", "day", "two", "time", "wrong", "over", "play", "editorial", "anger", "during", "pictures", "one", "long", "out", "really", "turns", "regrets", "being"]);
  var wordArr = sentence.match(/\w+/g),
      commonObj = {},
      uncommonArr = [],
      word, i;

  for (i = 0; i < common.length; i++) {
    commonObj[ common[i].trim() ] = true;
  }

  if (wordArr == undefined) {
    return uncommonArr;
  }
  for (i = 0; i < wordArr.length; i++) {
    word = wordArr[i].trim().toLowerCase();
    if (!commonObj[word]) {
      uncommonArr.push(word);
    }
  }
  return uncommonArr;
}

this.getContent = function(url, callback) {
  request
    .get(url)
    .end(function(err, webpageData) {
      if (err) {
        callback("");
        return;
      }
      callback(webpageData.text);
    });
}

this.buildHeadline = function(text) {
  words = removeStopWords(text);
  words.forEach(function(element) {
    if (wordCount[element] == undefined) {
      wordCount[element] = 1;
    }
    else {
      wordCount[element]++;
    }
  });
}

function calculateStats() {
  var sorted = sortObject(wordCount);
  var existingData = process.env['data'];
  if (existingData != undefined) {
    try {
      existingData = JSON.parse(process.env['data']);
    }
    catch (e) {
      existingData = undefined;
    }
  }
  var tracking = [];
  sorted.forEach(function(element, index) {

    if (element.value[0] < 3) {
      return;
    }

    if (existingData != undefined) {
      existingData.forEach(function(existingElement) {
        if (existingElement.key == element.key) {
          existingElement.value.push(element.value[0]);
          if (existingElement.value.length > 50) {
            existingElement.value.shift();
          }
          element.value = existingElement.value;
        }
      });
    }

    tracking.push(element);
  });
  process.env['data'] = JSON.stringify(tracking);
  if (process.env.FIREBASE_URL) {
    myRootRef.set('data', process.env['data']);
  }
}

// LOAD SCRAPERS
var worker = this;
var fs = require('fs');
var scripts = fs.readdirSync(__dirname + '/scrapers');
var scriptChecklist = scripts.slice();
function scrapContent() {
  // Reset stuff
  scriptChecklist = scripts.slice();
  wordCount = {};

  // Load scripts dynamically
  scripts.forEach(function(element) {
    var Mod = require(__dirname + '/scrapers/' + element);
    var scraper = new Mod();
    scraper.search(cheerio, worker);
  });
}

this.finishedScraping = function(scriptName, count) {
  if (count == 0) {
    console.log("WARNING! Scraper did not scrap anything! ", scriptName);
  }
  scriptChecklist.splice(scriptChecklist.indexOf(scriptName), 1);
  if (scriptChecklist.length == 0) {
    calculateStats();
  }
}

// Make sure we have a data.json
// Intentionally using sync methods, I want to make sure nothing else happens
try {
  process.env['data'] = fs.readFileSync(__dirname + '/data.json');
} catch (e) {
  fs.writeFileSync(__dirname + '/data.json', '');
}

scrapContent();
setInterval(scrapContent, 1000 * 60 * 2); // Run it every 2 minutes
