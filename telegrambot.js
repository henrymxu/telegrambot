const Telegraf = require('telegraf')
const express = require('express')
const lyrics = require('./getlyric.js')
const reddit = require('./getreddit.js')
const coinmarket = require('./getcoin.js')

const BOT_TOKEN = '546701409:AAFuhCSl0V2G-ZHMCd9vVsaNdhoUBLQ8Aj0'
app = express()
app.listen(process.env.PORT || 8080)

const bot = new Telegraf(BOT_TOKEN)

bot.start((ctx) => {
  return ctx.reply('Welcome!')
})

bot.command('help', (ctx) => ctx.reply('Try send a sticker!'))

bot.command('getlyric', (ctx) => {
  var song = ctx.update.message.text.split("/getlyric ")[1]
  Promise.resolve(lyrics.search(song)).then(function(values) {
    splitValues = chunkString(values, 4096);
    for (var i = 0; i < splitValues.length; i++) {
      ctx.reply(splitValues[i]);
    }
  })
})

bot.command('getreddit', (ctx) => {
  var subreddit = ctx.update.message.text.split("/getreddit ")[1]
  Promise.resolve(reddit.search(subreddit)).then(function(values) {
    ctx.replyWithMarkdown(values);
  })
})

bot.command('getcoin', (ctx) => {
  var coin = ctx.update.message.text.split("/getcoin ")[1]
  Promise.resolve(coinmarket.search(coin)).then(function(values) {
    ctx.replyWithMarkdown(values);
  }, function(values) {
    ctx.reply('Value: -69$, fuck you');
  })
})

bot.command('listcoins', (ctx) => {
  var count = ctx.update.message.text.split("/getcoin ")[1]
  Promise.resolve(coinmarket.getTopN(count)).then(function(values) {
    ctx.replyWithMarkdown(values);
  }, function(values) {
    ctx.reply('Value: -69$, fuck you');
  })
})

bot.hears('jimmy', (ctx) => ctx.reply('Where\'s my food Jimmy'))

bot.on('sticker', (ctx) => ctx.reply('👍'))

bot.on('message', ctx => {
  if (ctx.from.first_name == 'Jimmy') {
    ctx.reply('Where\'s my food Jimmy')
  }
})

bot.startPolling()

function chunkString(str, len) {
  var _size = Math.ceil(str.length/len),
      _ret  = new Array(_size),
      _offset
  ;
  for (var _i=0; _i<_size; _i++) {
    _offset = _i * len;
    _ret[_i] = str.substring(_offset, _offset + len);
  }
  return _ret;
}
