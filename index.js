#!/usr/bin/env node --harmony

'use sctrict';

let path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
});

const program = require("commander"),
  pkg = require("./package.json");

let newMail = () => {

  if (!process.env.BASEURL) {
    console.error("⚙️  Please specify the base url in .env file.");
    process.exit(1);
  }

  console.log('Start here');
  process.exit(0);
};

program.version(pkg.version).action(newMail);
program.parse(process.argv);