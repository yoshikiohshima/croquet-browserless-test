/* eslint-disable no-await-in-loop */

const express = require('express');
const puppeteer = require('puppeteer');

const {readFile} = require('fs/promises');

const app = express();

const run = require('./draw');

function getBrowser() {
    const IS_PRODUCTION = process.env.NODE_ENV === 'production';
    console.log("IS_PRODUCTION", IS_PRODUCTION);
    if (IS_PRODUCTION) {
        return readFile('apiKey.txt', 'utf-8').then(key => {
            return puppeteer.connect({ browserWSEndpoint: 'wss://chrome.browserless.io?token=' + key.trim() });
        });
    }
    return puppeteer.launch();
}

async function endPoint(req, res) {
    // puppeteer.launch() => Chrome running locally (on the same hardware)
    let browser = null;
    let screenshot;

    try {
        browser = await getBrowser();
        const page = await browser.newPage();
        screenshot = await run({page});
    } catch (error) {
        if (res) {
            if (!res.headersSent) {
                res.status(400).send(error.message);
            }
        }
    } finally {
        if (browser) {
            browser.close();
        }
    }
    res.end(screenshot, "binary");
}

app.get('/image', endPoint);

app.listen(8080, () => console.log('Listening on PORT: 8080'));
