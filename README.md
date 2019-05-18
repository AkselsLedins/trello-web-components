<div align="center">

[![GitHub issues](https://img.shields.io/github/issues/AkselsLedins/trello-web-components.svg)](https://github.com/AkselsLedins/trello-web-components/issues)
[![GitHub forks](https://img.shields.io/github/forks/AkselsLedins/trello-web-components.svg)](https://github.com/AkselsLedins/trello-web-components/network)
[![GitHub forks](https://img.shields.io/github/forks/AkselsLedins/trello-web-components.svg)](https://github.com/AkselsLedins/trello-web-components/network)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/AkselsLedins/trello-web-components.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FAkselsLedins%2Ftrello-web-components)
[![GitHub license](https://img.shields.io/github/license/AkselsLedins/trello-web-components.svg)](https://github.com/AkselsLedins/trello-web-components)
</div>

<img src="docs/logo.png" alt="logo" width="25%" align="right"  />

<h1>Trello-like - with Web Components</h1>

<br /><br />
<br /><br />
<br /><br />

* ✔ Vanilla JS
* ✔ Lightweight (36ko uncompressed)
* ✔ No dependencies (except for testing)
* ✔ Decent UX
* ✔ Works


<div align="center">
  <img src="docs/preview.png" alt="illustration" width="80%" />
</div>

<hr />

### Features

* ✓ display all columns with all cards
* ✓ create a new card
* ✓ modify a card
* ✓ delete a card
* ✓ add a column
* ✓ delete a column
* ✓ search for any keywords presents on one or multiple cards
* ✓ drag and drop a card from one column to another
* ✓ click on a card to see its description

### Missing features

* ❌ #14 modify a column
* ❌ #10 cards and columns should be unique

Any contribution is welcome. Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

<hr />

### How do I launch it?

#### Setup

```
$> npm install
```

> Q: But you said no dependencies?
>
> A: We use json-server to serve our index.html and to create an API.

#### Start the application

```
$> npm start
```

<div align="center">
  <img src="docs/npm-start.png" alt="illustration" width="80%" />
</div>

You can access the application on your browser at `http://localhost:3000`

#### Test the application

```
$> npm test
```

The application should be running on port `3000`. <br />
This will test the application. Beware, it will **override** the database in `data/db.json`.

<div align="center">
  <img src="docs/npm-test.png" alt="illustration" width="80%" />
</div>

##### Testing Strategy

There are only one E2E test. We believe that it will be counter-productive writing unit tests for this app.

At the moment the application is not covered at 100%. Each feature should be tested and CircleCI should be connected to this repository in order to prevent defects in future developments.
