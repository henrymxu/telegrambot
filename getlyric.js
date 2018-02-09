const request = require('request');
const cheerio = require('cheerio');
const phantom = require('phantom');

const url = 'https://genius.com/search?q='
module.exports = {
  search: function (song) {
    return new Promise(function(resolve, reject) {
      phantom.create().then(function(ph) {
        ph.createPage().then(function(page) {
          page.open(createSearchURL(song)).then(function(status) {
            page.property('content').then(function(content) {
              resolve(getSongURL(content));
              page.close();
              ph.exit();
            });
          });
        });
      });
    });
  }
}

function getSongURL(body) {
  const $ = cheerio.load(body);
  var url = $('a.mini_card').eq(1).attr('href');
  return new Promise(function(resolve, reject) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(getSongLyrics(body))
      } else {
        reject(error.statusCode);
      }
    })
  })
}

function getSongLyrics(body) {
  const $ = cheerio.load(body);
  var result = $('div.lyrics').children('p').text()
  return result;
}

function createSearchURL(song) {
  return url + song.split(' ').join('%20')
}
