require('dotenv').config();

const request = require('request-promise');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

const Telegraf = require('telegraf');
const text = require('./text');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const start = new Date();
  await db.set(`users._${String(ctx.chat.id)}`, ctx.chat).write();
  await next();
  const ms = new Date() - start;
  console.log('Response time %sms', ms);
});

bot.start(async (ctx) => {
  await ctx.reply(`Привіт, ${ctx.chat.first_name}`);
  await ctx.reply('Приємно познайомитися');
  await ctx.reply(text.start);
});

/* /me section */
bot.command('me', ctx => ctx.reply(ctx.chat.first_name + text.me));
bot.command('growth', ctx => ctx.reply('Cередньо статистичний'));
bot.command('name', async (ctx) => {
  await ctx.reply('Ой,я забув. Тільки ти йому не розповідай. Він мене видалить');
  setTimeout(() => {
    ctx.reply('Згадав його звати св Діонісій');
  }, 5000);
});
bot.command('weight', ctx => ctx.reply('65-75кг'));
bot.command('foot', ctx => ctx.reply('42 розмір. Дві ноги'));
bot.command('sizeXXX', async (ctx) => {
  await ctx.reply('Не стидно тобі таке питати?');
  await ctx.reply('Знаю що ні');
  await ctx.reply('Більший ніж середньо статистичний');
});

/* end /me section */

/* /danger section */
bot.command('danger', async (ctx) => {
  await ctx.reply('Я бачу ти любиш небезпеку');
  setTimeout(() => {
    ctx.reply('Ааааааааааа небезпека позвони в Google');
  }, 5000);
});
/* end /danger section */

/* end compliment section */
bot.command('compliment', async (ctx) => {
  const res = await request('http://free-generator.ru/generator.php?action=compliment&pol=1&type=2');
  const { compliment } = JSON.parse(res).compliment;
  await ctx.reply(compliment);
});
/* end /compliment section */ 

/* end compliment section */
bot.command('humor', async (ctx) => {
  const res = await request.post('https://ultragenerator.com/anekdotov/handler.php');
  const text1 = JSON.parse(JSON.stringify(res)).replace('br', ' ').replace('>', '&gt;').replace('<', '&lt;')
  await ctx.replyWithHTML(text1);
});
/* end /compliment section */

bot.help(ctx => ctx.reply('Send me a sticker'));
bot.on('sticker', ctx => ctx.reply('👍'));
bot.hears('hi', ctx => ctx.reply('Hey there'));
bot.hears(/buy/i, ctx => ctx.reply('Buy-buy'));

bot.startPolling();


bot.catch((err) => {
  console.log('Ooops', err);
});
