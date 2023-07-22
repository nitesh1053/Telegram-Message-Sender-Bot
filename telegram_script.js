import fetch from 'node-fetch';
import TelegramBot from 'node-telegram-bot-api';

const botToken = '6338318168:AAED94yely51Yk5pnNTIs_w2C_Jf1-f4A78'; //get from telegram botFather
const chatId = '-1001641138038'; //get from telegram

const bot = new TelegramBot(botToken, { polling: true });
 

async function getRandomWikiArticle() {
  try {
    const response = await fetch(
      'https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnlimit=1' // Wiki Api to fetch random article
    );
    const data = await response.json();
    if (data && data.query && data.query.random) {
      return data.query.random[0];
    }
    throw new Error('Failed to fetch a random Wikipedia article.');
  } catch (error) {
    throw new Error('Failed to fetch a random Wikipedia article.');
  }
}

async function getWikiArticleSummary(pageId) {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${pageId}`
    );
    const data = await response.json();
    if (data && data.query && data.query.pages) {
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      return pages[pageId].extract;
    }
    throw new Error('Failed to fetch the summary of the Wikipedia article.');
  } catch (error) {
    throw new Error('Failed to fetch the summary of the Wikipedia article.');
  }
}

async function sendMessageInTelegram() {
  try {
    const response = await getRandomWikiArticle();
    const articleTitle = response.title;
    const pageId = response.id;
    const articleSummary = await getWikiArticleSummary(pageId);

    const message = `Random Wikipedia Article: ${articleTitle}\n\n${articleSummary}`;

    await bot.sendMessage(chatId, message);
    console.log('Message Successfully sent');
  } catch (error) {
    console.error(error.message);

  }
};

sendMessageInTelegram();

