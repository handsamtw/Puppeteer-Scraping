
const express = require('express');
const puppeteer = require('puppeteer');

const scrapePage = require('./helper');

const app = express();
const port = 3000;

app.get('/:searchQuery', async (req, res) => {
    try {
        const searchQuery = req.params.searchQuery; // Retrieve the search query parameter from the URL path
        let from_page = parseInt(req.query.from_page);
        from_page = isNaN(from_page ) || from_page  <= 0 || !Number.isInteger(from_page) ? 1 : from_page ;
        let to_page = parseInt(req.query.to_page);
        to_page = isNaN(to_page) || to_page  <= 0 || !Number.isInteger(to_page) ? 1 : to_page;
        if (from_page > to_page) {
            from_page = 1;
            to_page = 1;
        }
        const browser = await puppeteer.launch({ headless: false }); // Launch browser
        const pagePromises = [];
        for (let pageNum = from_page; pageNum <= to_page; pageNum++) {
        const pagePromise = scrapePage(browser, searchQuery, pageNum);
            pagePromises.push(pagePromise);
        }
            // Wait for all scraping tasks to complete
        const results = await Promise.all(pagePromises);
        const dataArray = results.flat()        
        await browser.close();
        res.json({"count":dataArray.length, "listings": dataArray});
    } catch (error) {
        console.error('Error scraping:', error);
        res.status(500).json({ error: 'An error occurred while scraping' });
    }
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
