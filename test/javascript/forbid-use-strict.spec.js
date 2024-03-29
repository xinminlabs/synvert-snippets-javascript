const snippet = "javascript/forbid-use-strict";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  describe("exists", () => {
    assertConvert({
      input: `'use strict'\nfoobar`,
      output: `foobar`,
      snippet,
    });
  });

  describe("does not exist", () => {
    assertConvert({
      input: `foobar`,
      output: `foobar`,
      snippet,
    });
  });
});
