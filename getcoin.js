const request = require('request');
const cheerio = require('cheerio');
const phantom = require('phantom');

const url = 'https://api.coinmarketcap.com/v1/ticker/?convert=CAD&limit=0'
var _coin;
var _count = 10;

module.exports = {
  search: function (coin) {
    return new Promise(function(resolve, reject) {
      global._coin = coin.toLowerCase();
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(getCoinValue(body))
        } else {
          if (error != null ) {
            reject(error.statusCode);
          } else {
            reject(0);
          }
        }
      })
    })
  },
  getTopN: function (count) {
    if (!isNaN(count)) {
      global._count = count;
    } else {
      global._count = 10;
    }
    return new Promise(function(resolve, reject) {
      request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(getCoinRanking(body))
        } else {
          if (error != null ) {
            reject(error.statusCode);
          } else {
            reject(0);
          }
        }
      })
    })
  }
}

function getCoinValue(body) {
  var result = JSON.parse(body);
  var value;
  var change1h;
  var change24h;
  for (var i = 0; i < result.length; i++) {
    if (result[i].id == global._coin || result[i].name == global._coin || (result[i].symbol).toLowerCase() == global._coin) {
      value = result[i].price_cad;
      change1h = result[i].percent_change_1h;
      change24h = result[i].percent_change_24h;
      break;
    }
  }
  return '*Value:* `$' + value + '`\n*1H:* `' + change1h + '%`\n*24H:* `' + change24h + '%`';
}

function getCoinRanking(body) {
  var result = JSON.parse(body);
  var returnString = '';
  for (var i = 0; i < global._count; i++) {
    returnString += '*Coin:* `' + result[i].name + '` *Value:* `$' + result[i].price_cad + '` *7d:* `' + result[i].percent_change_7d + '%`\n'
  }
  return returnString;
}
