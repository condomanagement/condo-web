# Condo Web

[![Build](https://github.com/condomanagement/condo-web/actions/workflows/node.js.yml/badge.svg)](https://github.com/condomanagement/condo-web/actions/workflows/node.js.yml)
[![Lint](https://github.com/condomanagement/condo-web/actions/workflows/lint.js.yml/badge.svg)](https://github.com/condomanagement/condo-web/actions/workflows/lint.js.yml)
[![Test](https://github.com/condomanagement/condo-web/actions/workflows/test.yml/badge.svg)](https://github.com/condomanagement/condo-web/actions/workflows/test.yml)

Web interface for Condo Management

## Setup / Installation

1. Clone repository
2. `npm install`
3. `npm run dev`
4. Visit http://localhost:3001 to see the project. Note that many interactions will require
[condo-api](https://github.com/condomanagement/condo-api) to be running at http://localhost:3000.

## Development

### Lint

Run `npm run lint` to lint repository  
Run `npm run lint:fix` to auto-fix linting issues  
Run `npm run lint:ci` to lint with zero warnings (used in CI)

### Test

Run `npm test` to test repository with coverage  
Run `npm run test-watch` to run tests in watch mode

### Build

Run `npm run build` to build client application  
Run `npm run build-server` to build server application  
Run `npm run dev` to start development server with hot reload

## Working with condo-brain

[Condo brain](https://github.com/condomanagement/condo-brain) takes care of most of the interfacing. If you are developing
with condo brain at the same time, you will need to [link](https://docs.npmjs.com/cli/link) the library.
