const snippet = "javascript/prefer-regexp-test";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  const input = `
    string.match(/unicorn/);
    /unicorn/.exec(string);
  `;

  const output = `
    /unicorn/.test(string);
    /unicorn/.test(string);
  `;

  assertConvert({
    input,
    output,
    snippet,
  });
});
