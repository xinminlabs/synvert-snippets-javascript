require("../../lib/jquery/deprecate-ready-event");
const { assertConvert } = require("../utils");

describe("jquery/deprecate-ready-event", () => {
  assertConvert({
    input: `
      $(document).on("ready", fn)
      $(document).ready(fn)
    `,
    output: `
      $(fn)
      $(fn)
    `,
    snippet: "jquery/deprecate-ready-event",
  });
});