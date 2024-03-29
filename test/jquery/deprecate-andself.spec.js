const snippet = "jquery/deprecate-andself";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      $(e.target).parents("#userMenu").andSelf()
      $this.andSelf()
    `,
    output: `
      $(e.target).parents("#userMenu").addBack()
      $this.addBack()
    `,
    snippet,
  });
});
