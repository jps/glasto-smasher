# glasto-smasher

A node.js puppeteer bot that will reload a page until a provided phrase disappears

## Install Dependencies

Recommend install on Linux or Mac, Windows is possible but you will need to install WSL2 and [setup an X Server](https://www.rickmakes.com/windows-subsystem-for-linux-2-installing-vcxrv-x-server/).

### node.js

[Install node.js for your platform](https://nodejs.org/en/download/)

### yarn

[Install the yarn package manager](https://classic.yarnpkg.com/en/docs/install#windows-stable)

### Git

[Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Running the app

open your terminal and clone the repo

```bash
git clone git@github.com:jps/glasto-smasher.git
```

navigate to the cloned repo

```bash
cd glasto-smasher
```

install the dependencies

```bash
yarn
```

## Test mode

A test site is available, by pulling and running https://github.com/thomasms/testsites

open a second terminal and enter the following

```bash
git clone https://github.com/thomasms/testsites
cd testsites
yarn start
```

once started the site will report a url that it's running on this can be added to the test script below

now you can run the script local with

```bash
yarn smash --url http://localhost:3000/ --phrase 'Number of hits'
```

## Game day

You will need to input the url of holding page, this will be the page that is reloaded e.g. `https://glastonbury.seetickets.com/event/glastonbury-2020-deposits/worthy-farm/1450000` you won't know this until the day!

Next you will need to put in a piece of text that will only appear on the loading page, this will be something like `this page will refresh automatically`
you can also add an [xpath](https://developer.mozilla.org/en-US/docs/Web/XPath) here e.g `//text()[contains(.,'this page will refresh automatically')]`

giving us either

```bash
yarn smash --url 'https://glastonbury.seetickets.com/event/glastonbury-2020-deposits/worthy-farm/1450000' --phrase 'this page will refresh automatically'
```

or for xpath

```bash
yarn smash --url 'https://glastonbury.seetickets.com/event/glastonbury-2020-deposits/worthy-farm/1450000' --xpath "//text()[contains(.,'this page will refresh automatically')]"
```

The application will now reload and hand over control when it gets through, good luck!
