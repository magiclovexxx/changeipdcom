const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 8000;

changeIp = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        devtools: false,
    });

    width = Math.floor(Math.random() * (1280 - 1000)) + 1000;;
    height = Math.floor(Math.random() * (800 - 600)) + 600;;
    const page = (await browser.pages())[0];

    try {
       // đổi ip
       console.log("Đổi ip mạng")
       await page.goto("http://192.168.8.1/html/home.html")
       //  timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
       //   await page.waitFor(timeout)
       checkDcom = await page.$$(".mobile_connect_btn_on")

       //   process.exit()
       if (checkDcom.length) {
           await page.click("#mobile_connect_btn")
           timeout = Math.floor(Math.random() * (4000 - 3000)) + 3000;
           await page.waitForTimeout(timeout)

           // turn on dcom
           checkDcomOff = await page.$$(".mobile_connect_btn_on")
           if (!checkDcomOff.length) {
               await page.click("#mobile_connect_btn")
               timeout = Math.floor(Math.random() * (2000 - 1000)) + 2000;
               await page.waitForTimeout(timeout)

               return "OK"
           }
       }

       if (!checkDcom.length) {
           console.log("DCOM V2")
           checkDcomOff = await page.$$("#disconnect_btn")
           await page.click("#disconnect_btn")
           timeout = Math.floor(Math.random() * (2000 - 1000)) + 1000;
           await page.waitForTimeout(timeout)

           // turn on dcom
           //checkDcomOff = await page.$$("#connect_btn")
           checkDcomOff = await page.waitForSelector("#connect_btn")
           await page.click("#connect_btn")
           timeout = Math.floor(Math.random() * (2000 - 1000)) + 2000;
           await page.waitForTimeout(timeout)
           return "OK"
       }
    } catch (error) {
        console.log(error)
        await browser.close();
        return "Có lỗi gì đó"

    }
}


app.get('/', async (req, res) => {
    try {
        changedIp = await changeIp()
        console.log(changedIp)
        await res.send(changedIp);
    } catch (error) {
        console.log(error)
        await res.send("Có lỗi xảy ra");
    }
})

app.listen(port, function () {
    console.log("Change Dcom Server" + port);
})