#!/usr/bin/env node --harmony

"use sctrict";

let path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, ".env")
});

const program = require("commander"),
  pkg = require("./package.json"),
  Spinner = require("cli-spinner").Spinner,
  rp = require("request-promise"),
  cheerio = require("cheerio");

let spinner = new Spinner("%s Processing ");
spinner.setSpinnerString("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");

function pbcopy(data) {
  return new Promise(function(resolve, reject) {
    const proc = require("child_process").spawn("pbcopy");
    proc.on("error", function(err) {
      reject(err);
    });
    proc.on("close", function(err) {
      resolve();
    });
    proc.stdin.write(data);
    proc.stdin.end();
  });
}

let newMail = () => {
  if (!process.env.BASEURL) {
    console.error("⚙️  Please specify the base url in .env file.");
    process.exit(1);
  }

  if (!process.env.PASSWORD) {
    // prompt for password
    console.error("🔐  Please specify a password");
    process.exit(1);
  }

  //spinner.start();

  // AUTH
  const options = {
    uri: process.env.BASEURL,
    method: "PUT",
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD
    },
    transform: body => {
      return cheerio.load(body);
    }
  };

  console.log("🙋‍♂️  Fetching collegaues from Confluence.");
  rp(options)
    .then($ => {
      let content = [];

      $('.confluenceTable a[href*="mailto:"]').map((i, el) => {
        content.push($(el).text());
      });

      // console.log(content, "Count: " + content.length);
      pbcopy(content.join("; "))
        .then(() => {
          console.log(`✅  Copied ${content.length} Entries To Clipboard!`);
        })
        .catch(e => {
          console.error(new Error(`😱  Could Not Copy To Clipboard!`));
        });
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      //spinner.stop(true);
    });
};

program.version(pkg.version).action(newMail);
program.parse(process.argv);
