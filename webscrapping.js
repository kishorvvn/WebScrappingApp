const scrape = require('website-scraper');
const PuppeteerPlugin = require('website-scraper-puppeteer');


// export as a function
module.exports = {
  // name function and passing parameters
  scrapeWeb: function (_url, _dir) {
    // has to return 
    return scrape({
      urls: [_url],
      directory: _dir,
      plugins: [
        new PuppeteerPlugin({
          launchOptions: { headless: true }, /* optional */
          ignoreDefaultArgs: ['--disable-extensions'],
          scrollToBottom: { timeout: 10000, viewportN: 10 }, /* optional */
          blockNavigation: true, /* optional */
        })
      ]
    })
  }
}

// scrape({
//   urls: ['https://www.balooworld.ca/'],
//   directory: 'scrappedWebPage',
//   plugins: [
//     new PuppeteerPlugin({
//       launchOptions: { headless: false }, /* optional */
//       scrollToBottom: { timeout: 10000, viewportN: 10 }, /* optional */
//       blockNavigation: true, /* optional */
//     })
//   ]
// });
