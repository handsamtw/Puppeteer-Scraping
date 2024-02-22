
async function scrapePage(browser, searchQuery, pageNum) {
    try {
        const page = await browser.newPage(); // Open new page
        // Navigate the page to a URL
        await page.goto('https://www.redfin.com/');
        
        // Type into the input field
        await page.waitForSelector('input[name="searchInputBox"]')
        await page.type('input[name="searchInputBox"]', searchQuery);
        await page.keyboard.press("Enter");
        await page.waitForNavigation();
        if (pageNum > 1) {                
            const newURL = `${page.url()}/page-${pageNum}`;
            await page.goto(newURL);
        }

    // Wait for the elements to appear
    await page.waitForSelector('.bp-Homecard__Stats--beds');
    await page.waitForSelector('.bp-Homecard__Stats--baths');
    await page.waitForSelector('.bp-Homecard__LockedStat--value');
    await page.waitForSelector('.bp-Homecard__LockedStat--label');
    await page.waitForSelector('.bp-Homecard__Address');

    // Extract values from the spans
    const beds = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.bp-Homecard__Stats--beds'), element => 
        {
            const text = element.textContent.trim()
            const matches = text.match(/\d+/); 
            return matches ? parseInt(matches[0]) : text;
        }
        )
    );

    const baths = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.bp-Homecard__Stats--baths'), element => 
        {const text = element.textContent.trim()
            const matches = text.match(/\d+/); 
            return matches ? parseInt(matches[0]) : text;
        }
        )
    );


    const lockedValues = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.bp-Homecard__LockedStat--value'), element => 
        {
            const text = element.textContent.trim().replace(/,/g, '')
            return  parseInt(text) ? parseInt(text) : text;
        })
    );

    const lockedLabels = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.bp-Homecard__LockedStat--label'), element => element.textContent.trim())
    );

    const addresses = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.bp-Homecard__Address'), element => element.textContent.trim())
    );

    // Construct an array of objects with the extracted data
    const dataArray = [];
    for (let i = 0; i < beds.length; i++) {
        const dataObject = {
            beds: beds[i],
            baths: baths[i],
            size: lockedValues[i], 
            unit: lockedLabels[i],
            address: addresses[i]
        };
        dataArray.push(dataObject);
    }

    return dataArray
} catch(error) {
    console.error("Error: ", error);
    return []
    }
}

module.exports = scrapePage;
