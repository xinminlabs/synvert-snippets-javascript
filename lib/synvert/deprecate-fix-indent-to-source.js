const Synvert = require("synvert-core");

new Synvert.Rewriter("synvert", "deprecate-fix-indent-to-source", () => {
  description("Deprecate `fixIndentToSource`, use `toSource({ fixIndent: true })` instead.");

  withinFiles(Synvert.ALL_JS_FILES, function () {
    findNode(".CallExpression[callee=.MemberExpression[property=fixIndentToSource]]", () => {
      replace("callee.property", { with: "toSource" });
      insert("{ fixIndent: true }", { to: "arguments.0" });
    });
  });
});
