new Synvert.Rewriter("javascript", "unquote-properties", () => {
  description(`
    Unquote properties if possible.

    \`\`\`javascript
    var x = { 'quotedProp': 1 };
    \`\`\`

    =>

    \`\`\`javascript
    var x = { quotedProp: 1 };
    \`\`\`
  `);

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode(".PropertyAssignment[name=.StringLiteral[text!~/(\\s|-)/]]", () => {
      replace("name", { with: "{{name.text}}" });
    });
  });
});
