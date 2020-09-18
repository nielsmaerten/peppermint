### This project is in Maintenance Mode. No new features will be added. 
### If you're interested in taking over development, contact me on Gitter or email.

# Peppermint - https://peppermint-wallpapers.web.app

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/nielsmaerten/peppermint/master/LICENSE)
[![Dependencies](https://david-dm.org/nielsmaerten/peppermint.svg)](https://david-dm.org/nielsmaerten/peppermint)
[![Build Status](https://travis-ci.org/nielsmaerten/peppermint.svg?branch=master)](https://travis-ci.org/nielsmaerten/peppermint)
[![Coverage Status](https://coveralls.io/repos/github/nielsmaerten/peppermint/badge.svg?branch=master)](https://coveralls.io/github/nielsmaerten/peppermint?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/b28fed4ace7959d2e8c7/maintainability)](https://codeclimate.com/github/nielsmaerten/peppermint/maintainability)

## Start here: [**Connect your Dropbox**](https://peppermint-wallpapers.web.app)
## Nature's most beautiful wallpapers: Right in your Dropbox!

Peppermint takes the top-rated images from Reddit's [r/earthporn](https://reddit.com/r/earthporn), and saves them to your Dropbox.  
Configure your system to cycle through them, and you'll have an always up-to-date collection of amazing wallpapers.

### How to I set Peppermint as my wallpaper?
[Windows Instructions](https://www.google.com/search?q=wallpaper+slideshow+windows)  
[Mac OS Instructions](https://www.google.com/search?q=wallpaper+slideshow+mac+os)

---
## Contributing
1. Use VS Code + Docker to work on this project. The included devcontainer will provide a locked down environment where all dependencies still work.
2. After init, vscode will run `npm i` in the root dir, installing all dependencies. You'll see lots of warnings for outdated ones :)
3. Run `npm run build`. The compiled JS file is placed in the /dist folder
4. Run `firebase login --no-localhost`
5. Run `firebase deploy`

The dev env uses Node 8. Compiled code is compatible with Node 10 and is deployed to a Node 10 instance for Firebase Functions