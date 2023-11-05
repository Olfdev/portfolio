const express = require('express')
const cors = require('cors')
const puppeteer = require('puppeteer')
const sharp = require('sharp')

const app = express()
const port = 3001

app.use(express.json())
app.use(cors({ origin: '*' }))

app.post('/', async (req, res) => {
    try {
        const url = req.body.url
        const delay = req.body.delay

        const browser = await puppeteer.launch({ headless: 'new' })
        const page = await browser.newPage()

        // Go to specified page
        await page.goto(url)

        // Set viewport for desktop mode
        await page.setViewport({ width: 1920, height: 1080 })

        // Add a delay to make sure the page is properly loaded
        await new Promise(resolve => setTimeout(resolve, delay))

        // Take desktop screenshot
        const desktopScreenshot = await page.screenshot()

        // Set viewport for mobile mode
        await page.setViewport({ width: 400, height: 840 })

        // Take mobile screenshot
        const mobileScreenshot = await page.screenshot()

        await browser.close()

        // Resize the screenshots using sharp
        const resizedDesktopScreenshot = await sharp(desktopScreenshot)
            .resize({ width: 960 })
            .toBuffer()

        const resizedMobileScreenshot = await sharp(mobileScreenshot)
            .resize({ width: 200 })
            .toBuffer()

        res.json({
            desktopScreenshot: resizedDesktopScreenshot.toString('base64'),
            mobileScreenshot: resizedMobileScreenshot.toString('base64'),
        })
        console.log("Screenshots successfully taken and resized")
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

app.listen(port, () => {
    console.log(`Puppeteer server is running on port ${port}`)
})
