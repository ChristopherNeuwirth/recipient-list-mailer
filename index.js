#!/usr/bin/env node --harmony

'use sctrict';

let path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
});

const program = require("commander"),
  pkg = require("./package.json"),
  Spinner = require('cli-spinner').Spinner;

let spinner = new Spinner('%s Processing ');
spinner.setSpinnerString('⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏');

let newMail = () => {

  if (!process.env.BASEURL) {
    console.error('⚙️  Please specify the base url in .env file.');
    process.exit(1);
  }

  console.log('Start here');
  spinner.start();
  setTimeout(() => {
    process.exit(0);
  }, 10000);
};

program.version(pkg.version).action(newMail);
program.parse(process.argv);