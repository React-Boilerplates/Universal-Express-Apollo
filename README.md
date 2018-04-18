# Universal-Express-Apollo

[![Build Status](https://travis-ci.org/React-Boilerplates/Universal-Express-Apollo.svg?branch=master)](https://travis-ci.org/React-Boilerplates/Universal-Express-Apollo) [![Build status](https://ci.appveyor.com/api/projects/status/pdc5fmop0d0humdr?svg=true)](https://ci.appveyor.com/project/couturecraigj/universal-express-apollo) [![codecov](https://codecov.io/gh/React-Boilerplates/Universal-Express-Apollo/branch/master/graph/badge.svg)](https://codecov.io/gh/React-Boilerplates/Universal-Express-Apollo) [![Known Vulnerabilities](https://snyk.io/test/github/react-boilerplates/universal-express-apollo/badge.svg?targetFile=package.json)](https://snyk.io/test/github/react-boilerplates/universal-express-apollo?targetFile=package.json) [![Open Source Love](https://badges.frapsoft.com/os/mit/mit.svg?v=102)](https://github.com/ellerbrock/open-source-badge/) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/33dd062391a446d7b98762803b1cd5ef)](https://www.codacy.com/app/couturecraigj/Universal-Express-Apollo?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=React-Boilerplates/Universal-Express-Apollo&amp;utm_campaign=Badge_Grade)
[![Dependency Status](https://www.versioneye.com/user/projects/5ad5d6dc0fb24f39bed6e020/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/5ad5d6dc0fb24f39bed6e020)

[![Open Source Love svg3](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![Github all releases](https://img.shields.io/github/downloads/React-Boilerplates/Universal-Express-Apollo/total.svg)](https://GitHub.com/React-Boilerplates/Universal-Express-Apollo/releases/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![made-with-Markdown](https://img.shields.io/badge/Made%20with-Webpack-1f425f.svg)](http://commonmark.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Install

```bash
git clone https://github.com/React-Boilerplates/Universal-Express-Apollo.git
npm install
```

### Development

```bash
npm start
```

### Production

```bash
npm run build
npm run start:prod
```

## WHAT?!?! a Boilerplate, isn't that like totally 2015

I was trying to use other cli/generators and was coming up against some blockers... many of them try to extract away too much.  Next.js makes it hard to create an initializer so that they have a better page building experience.  As a result things like `redux` are VERY hacky to implement by using wrappers.  Things like `create-react-app` are not SSR by default.  Also getting styling implemented in these are a serious pain in the tuckus.  I wanted to build an app that allows for production quality build with modern standards like `graphql` by default.

### Technology

- Server
  - Express
    - Logging
      - Winston
      - AirBrake
  - Apollo-Server
  - Apollo-Upload-Server
  - Sequelize
  - Session-Storage
  - DataLoader
- Client
  - JWT
  - ServiceWorker
  - React
    - React-hot-loader
    - React-Helmet
    - React-Router
  - Redux
    - Redux-Form
  - Apollo-Client
  - Styled-Components
- Testing
  - Casual
  - Jest
  - Enzyme
- Pre-processors
  - Webpack
  - Babel
  - Styling
  - Linting
    - ESLint
    - StyleLint
  - Prettier
  - PostCSS
    - PreCSS
    - CSSNano
    - Autoprefixer
  - Code-Splitting
    - Loadable-Components
- Server-Side-Render
- Production-Ready

Take a look and contribute if you would like.  The goal of this is to use modern standards.
