var express = require('express');
var ncp = require('ncp').ncp;
var randomWords = require('random-words');
ncp.limit = 16;
var router = express.Router();
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
var request = require('request');

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

const puppeteer = require('puppeteer-extra');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

async function cs(response) {

    // That's it, the rest is puppeteer usage as normal 😊
    puppeteer.launch({
        ignoreHTTPSErrors: true,
        args: [
          '--log-level=3', // fatal only
          '--start-maximized',
          '--no-default-browser-check',
          '--disable-infobars',
          '--disable-web-security',
          '--disable-site-isolation-trials',
          '--no-experiments',
          '--ignore-gpu-blacklist',
          '--ignore-certificate-errors',
          '--ignore-certificate-errors-spki-list',
          '--disable-gpu',
          '--disable-default-apps',
          '--enable-features=NetworkService',
          '--disable-setuid-sandbox',
          '--no-sandbox'
        ],
        ignoreDefaultArgs: ['--enable-automation'],
        headless: false ,
        userDataDir: "./session"}).then(async browser => {
        const page = await browser.newPage()
        //await page.setViewport({ width: 800, height: 600 })
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36');
        await page.setRequestInterception(true);
        page.on('request', request => {
            //console.log(request.url());
            //.........................
            request.continue();
        });
        const delay = (timeout) => {
            return new Promise((resolve) => {
                setTimeout(resolve, timeout * 0.9);
            });
        }
        await page.setDefaultNavigationTimeout(0);
        console.log("browser opened!");
        await page.goto("https://antcpt.com/eng/information/demo-form/recaptcha-3-test-score.html");
        await page.waitForSelector('#score');
        await page.waitForTimeout(5000);
        let element = await page.$('#score');
        element = await page.evaluate(element => element.innerText, element);
        response.send(element.split(":")[1]);
        if (element.split(":")[1] < 0.4){

            var options = {
                'method': 'POST',
                'url': 'http://localhost:3000/cs2',
                'headers': {
                }
              };
            request(options, function (error, responseR) {
                if (error) {
                    //response.send(error);
                    throw new Error(error);
                }
            });
        }else if (element.split(":")[1] < 0.7){

            var options = {
                'method': 'POST',
                'url': 'http://localhost:3000/cs3',
                'headers': {
                }
              };
            request(options, function (error, responseR) {
                if (error) {
                    //response.send(error);
                    throw new Error(error);
                }
            });
        }
        await browser.close();
        //TODO verify if can send a message of error or not, and send

    });
}
//cs();
router.post('/', function(request, response){
    cs(response);
    //response.send('1');
});

module.exports = router;