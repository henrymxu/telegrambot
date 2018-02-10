const Telegraf = require('telegraf')
const express = require('express')
require('dotenv').config()
const lyrics = require('./getlyric.js')
const reddit = require('./getreddit.js')
const coinmarket = require('./getcoin.js')

app = express()
app.listen(process.env.PORT || 8080)
console.log (process.env.BOT_TOKEN)
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => {
  return ctx.reply('Welcome!')
})

bot.command('help', (ctx) => ctx.reply('Try send a sticker!'))

bot.command('getlyric', (ctx) => {
  var song = ctx.update.message.text.split("/getlyric ")[1]
  Promise.resolve(lyrics.search(song)).then(function(values) {
    splitValues = chunkString(values, 4096);
    for (var i = splitValues.length - 1; i >= 0; i--) {
      ctx.replyWithMarkdown('`' + splitValues[i] + '`');
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
bot.on('sticker', (ctx) => ctx.reply('👍'))

bot.on('message', ctx => {
  if (ctx.from.first_name == 'Jimmy' && (ctx.update.message.text == 'wtf' || ctx.update.message.text == 'wat')) {
    ctx.reply('Shut the fuck up Jimmy')
  }
  if (ctx.from.first_name == 'Jimmy') {
    ctx.reply('Where\'s my food Jimmy')
    return;
  }
})

bot.startPolling()

function chunkString(str, len) {
  var counter = 0;
  var result = [];
  while (str.length > 4000) {
    result[counter] = str.substring(0, 4000);
    str = str.replace(result[counter], '')
    counter++;
  }
  result[counter] = str;
  return result;
}
