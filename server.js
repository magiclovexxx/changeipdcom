const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 8000;

get2fa = async (key) => {
    const browser = await puppeteer.launch({
        headless: true,
        devtools: false,
    });

    width = Math.floor(Math.random() * (1280 - 1000)) + 1000;;
    height = Math.floor(Math.random() * (800 - 600)) + 600;;
    const page = (await browser.pages())[0];

    try {
        await page.goto("https://gauth.apps.gbraad.nl/")

        await page.click(".ui-icon-edit")
        //await page.waitForTimeout(1000)
        await page.click("#addButton")
        //await page.waitForTimeout(1000)
        await page.type("#keySecret", key)
        //await page.waitForTimeout(1000)
        await page.click("#addKeyButton")
        //await page.waitForTimeout(1000)
        code2fa = await page.evaluate(() => {
            code = document.querySelectorAll('.ui-last-child')[1].textContent
            return code
        })
        delButton = await page.$$('.ui-icon-delete')
        delButton[1].click()
        await page.waitForTimeout(1000)
        await browser.close();
        return code2fa
    } catch (error) {
        console.log(error)
        await browser.close();
        return "Có lỗi gì đó"

    }




}


app.get('/', async (req, res) => {
    try {
        key = req.query.key

        facode = await get2fa(key)
        console.log(facode)
        await res.send(facode);
    } catch (error) {
        console.log(error)
        await res.send("Có lỗi xảy ra");
    }

})

app.listen(port, function () {
    console.log("Your app running on port " + port);
})