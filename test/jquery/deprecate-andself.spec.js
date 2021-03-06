const snippet = "jquery/deprecate-andself";
require(`../../lib/${snippet}`);
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `$(e.target).parents("#userMenu").andSelf()`,
    output: `$(e.target).parents("#userMenu").addBack()`,
    snippet,
  });
});
