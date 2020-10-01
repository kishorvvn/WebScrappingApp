
const express = require('express');
const fs = require('file-system');
const path = require('path');
const router = express.Router();
const scrape = require('website-scraper');
const PuppeteerPlugin = require('website-scraper-puppeteer');
const admZIp = require('adm-zip');
const webScrapes = require('./webscrapping.js');


var app = express();
/**
 * set up routes
 * */
router.get('/home', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
  //__dirname : to resolve to project folder.
});

// get user input from the form submit
router.get('/submit-with-get', function async(req, res) {
  // set up variables to store url from user and filepath to store scrapped files
  var url = req.query.url;
  if (url == '') {
    res.send('Please provide a valid url')

  } else {

    var dir_name = '/' + new Date().getMinutes();
    var directory = path.join(__dirname + '/public') + dir_name;

    // call scrape function
    webScrapes.scrapeWeb(url, directory)
      .then(() => {
        // res.send('scrapping sucessful')
        // initialize adm-zip module
        var zip = new admZIp();
        // declate output path for file to store
        var outputFIlePath = directory + 'output.zip';

        // add folder to zip it up
        zip.addLocalFolder(directory);
        // write files to the path
        fs.writeFileSync(outputFIlePath, zip.toBuffer());
        // send it to the client and download

        res.sendFile(outputFIlePath, 'scrapped_web_files.zip', (err) => {

          if (err) {
            console.log(err);
          }
          // remove folder
          // fs.rmdirSync(directory);
          // remove zip file
          // fs.unlinkSync(path.resolve(outputFIlePath));
        });

      });
  }


  // scrape({
  //   urls: [url],
  //   directory: __dirname + dir_name,
  //   plugins: [
  //     new PuppeteerPlugin({
  //       launchOptions: { headless: false }, /* optional */
  //       scrollToBottom: { timeout: 10000, viewportN: 10 }, /* optional */
  //       blockNavigation: true, /* optional */
  //     })
  //   ]
  // })
  //   .then(() => {
  //     // res.send('scrapping sucessful')
  //     // initialize adm-zip module
  //     var zip = new admZIp();
  //     // declate output path for file to store
  //     var outputFIlePath = new Date().getMinutes() + 'output.zip';
  //     // add folder
  //     zip.addLocalFolder(__dirname + dir_name);
  //     // write files to the path
  //     fs.writeFileSync(outputFIlePath, zip.toBuffer());
  //     // send it to the client and download
  //     res.download(outputFIlePath);
  //   });


});







// fs.readFile('./index.html', function read(err, data) {
//   if (err) {
//     console.log('File can not be read' + err);
//   }

//   content = data;
// })


// app.get("/home", function (req, res) {
//   res.send(content);
// })

//add the router
app.use('/', router);

const port = 3000
app.listen(3000, () => console.log(`App listening on port ${port}`))