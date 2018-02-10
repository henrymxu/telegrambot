const request = require('request');
require('dotenv').config()

const client_id='55M9zTd_0k5V2Q'
const client_secret=process.env.REDDIT_SECRET
const reddit_password=process.env.REDDIT_PASSWORD

const url = 'https://www.reddit.com/r/'
module.exports = {
  apiSearch: function(subreddit) {
    return new Promise(function(resolve, reject) {
        authenticateReddit().then(function (token) {
        searchReddit(token, subreddit).then(function (json) {
          resolve(formatReddit(parseReddit(json)));
        })
      })
    })
  }
}

function authenticateReddit() {
  var options = {
    url: 'https://www.reddit.com/api/v1/access_token',
    headers: {'Authorization': 'Basic ' + generateBase64Credentials(client_id ,client_secret),
              'User-Agent': 'telegrambot/1.0 by Slowbroooo'},
    form: {'grant_type': 'password',
           'username': 'Slowbroooo',
           'password': reddit_password},
  };
  return new Promise(function(resolve, reject) {
    request.post(options, function(error, response, body){
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body).access_token);
      }
      else {
        console.error("Authentication Error: " + response.statusCode);
        reject(response.statusCode);
      }
    });
  })
}

function searchReddit(token, subreddit) {
  var options = {
    url: createAPIUrl(subreddit, 'hot'),
    headers: {'Authorization': ('bearer ' + token),
              'User-Agent': 'telegrambot/1.0 by Slowbroooo'}
  }
  return new Promise(function(resolve, reject) {
    request.get(options, function(error, response, body){
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      }
      else {
        console.error("Authentication Error: " + response.statusCode);
        reject(response.statusCode);
      }
    });
  })
}

function parseReddit(json) {
  var listings = json.data.children;
  var stickyCounter = 0;
  var results = [];
  while (listings[stickyCounter].data.stickied == true) {
    stickyCounter++;
  }
  for (var i = stickyCounter; i < (5 + stickyCounter); i++) {
    result = {}
    result.title = listings[i].data.title
    result.url = listings[i].data.url
    result.score = listings[i].data.score
    results.push(result);
  }
  return results;
}

function formatReddit(result) {
  var string = []
  for (var i = 0; i < result.length; i++) {
    string[i] = (i+1) + '. ' + result[i].score + ' [' + result[i].title.replace(/'/g, '\'') + '](' + result[i].url + ')';
  }
  return string;
}

function createAPIUrl(subreddit, sort) {
  return 'https://oauth.reddit.com/r/' + subreddit + '/' + sort
}

function generateBase64Credentials (client_id, client_secret) {
  var base64Buffer = new Buffer(client_id + ':' + client_secret)
  return base64Buffer.toString('base64');
}
