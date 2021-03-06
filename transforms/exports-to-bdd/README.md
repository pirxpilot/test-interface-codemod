# exports-to-bdd


## Usage

```
npx test-interface-codemod exports-to-bdd path/of/files/ or/some**/*glob.js

# or

yarn global add test-interface-codemod
test-interface-codemod exports-to-bdd path/of/files/ or/some**/*glob.js
```

## Input / Output

<!--FIXTURES_TOC_START-->
* [basic](#basic)
<!--FIXTURES_TOC_END-->

<!--FIXTURES_CONTENT_START-->
---
<a id="basic">**basic**</a>

**Input** (<small>[basic.input.js](transforms/exports-to-bdd/__testfixtures__/basic.input.js)</small>):
```js
var l10n = require('../src/l10n');
// should = require('should');

function req(language) {
  return {
    get: function get(header) {
      return (header === 'accept-language') && language;
    }
  };
}

module.exports = {
  'beforeEach': function () {
    this.res = {
      locals: {}
    };
  },

  after: function () {
    this.res = undefined;
  },

  'united states': function (done) {
    var res = this.res;
    var request = req('en-US,en;q=0.8,pl;q=0.6');
    request.parsedLang = {
      language: 'en',
      region: 'US',
      value: 'en-US'
    };
    l10n(request, res, function() {
      res.locals.should.have.property('l10n');
      res.locals.l10n.should.have.property('distance', 'm');
      done();
    });
  },

  empty:  function (done) {
    var res = this.res;
    var request = req();
    request.parsedLang = {
      language: 'en',
      region: 'US',
      value: 'en-US',
      q: -1
    };
    l10n(req(), res, function() {
      res.locals.should.have.property('l10n');
      res.locals.l10n.should.have.property('distance', 'm');
      done();
    });
  }
};

```

**Output** (<small>[basic.output.js](transforms/exports-to-bdd/__testfixtures__/basic.output.js)</small>):
```js
var l10n = require('../src/l10n');
// should = require('should');

function req(language) {
  return {
    get: function get(header) {
      return (header === 'accept-language') && language;
    }
  };
}

describe('basic.input.js', function () {
  beforeEach(function () {
    this.res = {
      locals: {}
    };
  });

  after(function () {
    this.res = undefined;
  });

  it('united states', function (done) {
    var res = this.res;
    var request = req('en-US,en;q=0.8,pl;q=0.6');
    request.parsedLang = {
      language: 'en',
      region: 'US',
      value: 'en-US'
    };
    l10n(request, res, function() {
      res.locals.should.have.property('l10n');
      res.locals.l10n.should.have.property('distance', 'm');
      done();
    });
  });

  it('empty', function (done) {
    var res = this.res;
    var request = req();
    request.parsedLang = {
      language: 'en',
      region: 'US',
      value: 'en-US',
      q: -1
    };
    l10n(req(), res, function() {
      res.locals.should.have.property('l10n');
      res.locals.l10n.should.have.property('distance', 'm');
      done();
    });
  });
});

```
<!--FIXTURES_CONTENT_END-->