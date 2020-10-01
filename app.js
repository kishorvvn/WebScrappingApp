
const express = require('express');
const fs = require('file-system');
const path = require('path');
const router = express.Router();
const scrape = require('website-scraper');
const PuppeteerPlugin = require('website-scraper-puppeteer');
const admZIp = require('adm-zip');
const webScrapes = require('./webscrapping.js');


var app = express();

app.use('/public', express.static(path.join(__dirname + 'public')));


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
    res.send('Please provide a valid url');
  } else {

    var dir_name = '/' + new Date().getDay();
    var directory = path.join(__dirname + '/public') + dir_name;

    // call scrape function
    webScrapes.scrapeWeb(url, directory).then(() => {
      var zip = new admZIp();
      // declate output path for file to store
      var outputFIlePath = directory + 'output.zip';

      // add folder to zip it up
      zip.addLocalFolder(directory);
      // write files to the path
      fs.writeFileSync(outputFIlePath, zip.toBuffer());
      // send it to the new page with download link
      res.sendFile(path.join(__dirname + '/download.html'));
    })

  }

  // set up route for new page with download link
  router.get('/download', function async(req, res) {
    // diclare path variables to locate the file
    var dir_name = '/' + new Date().getDay();
    var directory = path.join(__dirname + '/public') + dir_name;
    var outputFIlePath = directory + 'output.zip';

    // send a file to download
    res.sendFile(outputFIlePath, 'scrapped_web_files.zip', (err) => {
      if (err) {
        console.log(err);
      }
      // remove folder
      fs.rmdirSync(directory);
      // remove zip file
      fs.unlinkSync(path.resolve(outputFIlePath));
    });

  })
});

//add the router
app.use('/', router);

// set up port to listen
const port = 3000
app.listen(3000, () => console.log(`App listening on port ${port}`));