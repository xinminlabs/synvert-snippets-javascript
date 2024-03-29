const snippet = "javascript/prefer-import-export";
const { assertConvert } = require("../utils");

describe(snippet, () => {
  input = `
    const fs = require('fs'),
          path = require('path')
    const { Node } = require('acorn')

    module.exports = Rewriter
    module.exports = { Rewriter, Configuration }
  `;
  output = `
    import fs from 'fs'
    import path from 'path'
    import { Node } from 'acorn'

    export default Rewriter
    export { Rewriter, Configuration }
  `;
  assertConvert({
    input,
    output,
    snippet,
  });
});
