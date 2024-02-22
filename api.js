
const express = require('express');
const puppeteer = require('puppeteer');

const scrapePage = require('./helper');

const app = express();
const port = 3000;
// async function scrapePage(browser, searchQuery, pageNum) {
//     try {
//         myFunc()
//         const page = await browser.newPage(); // Open new page
//         // Navigate the page to a URL
//         await page.goto('https://www.redfin.com/');
        
//         // Wait for the input field to appear

//         // Type into the input field
//         await page.waitForSelector('input[name="searchInputBox"]')
//         await page.type('input[name="searchInputBox"]', searchQuery);
//         await page.keyboard.press("Enter");
//         await page.waitForNavigation();
//         if (pageNum > 1) {                
//             const newURL = `${page.url()}/page-${pageNum}`;
//             await page.goto(newURL);
//         }

//     // Wait for the elements to appear
//     await page.waitForSelector('.bp-Homecard__Stats--beds');
//     await page.waitForSelector('.bp-Homecard__Stats--baths');
//     await page.waitForSelector('.bp-Homecard__LockedStat--value');
//     await page.waitForSelector('.bp-Homecard__LockedStat--label');
//     await page.waitForSelector('.bp-Homecard__Address');

//     // Extract values from the spans
//     const beds = await page.evaluate(() =>
//         Array.from(document.querySelectorAll('.bp-Homecard__Stats--beds'), element => 
//         {
//             const text = element.textContent.trim()
//             const matches = text.match(/\d+/); 
//             return matches ? parseInt(matches[0]) : text;
//         }
//         )
//     );

//     const baths = await page.evaluate(() =>
//         Array.from(document.querySelectorAll('.bp-Homecard__Stats--baths'), element => 
//         {const text = element.textContent.trim()
//             const matches = text.match(/\d+/); 
//             return matches ? parseInt(matches[0]) : text;
        
//         }
//         )
//     );


//     const lockedValues = await page.evaluate(() =>
//         Array.from(document.querySelectorAll('.bp-Homecard__LockedStat--value'), element => 
//         {
//             const text = element.textContent.trim().replace(/,/g, '')
//             return  parseInt(text) ? parseInt(text) : text;
//         })
//     );

//     const lockedLabels = await page.evaluate(() =>
//         Array.from(document.querySelectorAll('.bp-Homecard__LockedStat--label'), element => element.textContent.trim())
//     );

//     const addresses = await page.evaluate(() =>
//         Array.from(document.querySelectorAll('.bp-Homecard__Address'), element => element.textContent.trim())
//     );

//     // Construct an array of objects with the extracted data
//     const dataArray = [];
//     for (let i = 0; i < beds.length; i++) {
//         const dataObject = {
//             beds: beds[i],
//             baths: baths[i],
//             size: lockedValues[i], 
//             unit: lockedLabels[i],
//             address: addresses[i]
//         };
//         dataArray.push(dataObject);
//     }

//     return dataArray
// } catch(error) {
//     console.error("Error: ", error);
//     return []
//     }
// }

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
