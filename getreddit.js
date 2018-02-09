const request = require('request');
const cheerio = require('cheerio');
const phantom = require('phantom');

const url = 'https://www.reddit.com/r/'
module.exports = {
  search: function (subreddit) {
    return new Promise(function(resolve, reject) {
      phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
          page.open(createSearchURL(subreddit)).then(function(status) {
            page.property('content').then(function(content) {
              resolve(getTopPost(content));
              page.close();
              ph.exit();
            });
          });
        });
      });
    });
  }
}

function getTopPost(body) {
  const $ = cheerio.load(body);
  var counter = 0;
  var result = $('div.top-matter > p.tagline').toArray();
  while ($(result[counter]).children('span.stickied-tagline').text() == 'announcement' || $(result[counter]).text().includes('promoted by ')) {
    counter++;
  }
  var topPost = $('p.title > a.title').eq(counter).text();
  var postUrl = url + $('p.title > a.title').eq(counter).attr('href');
  return '[' + topPost + '](' + postUrl + ')';
}

function createSearchURL(subreddit) {
  return url + subreddit
}
