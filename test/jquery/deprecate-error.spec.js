const snippet = "jquery/deprecate-error";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  assertConvert({
    input: `
      $(this).error(function () { console.log("error") });
      $this.error(function () { console.log("error") });
    `,
    output: `
      $(this).on("error", function () { console.log("error") });
      $this.on("error", function () { console.log("error") });
    `,
    snippet,
  });
});
