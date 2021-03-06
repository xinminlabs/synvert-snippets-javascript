const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-unique", () => {
  configure({ sourceType: 'script' });

  description(`
    JQMIGRATE: jQuery.unique is deprecated; use jQuery.uniqueSort
    Cause: The fact that jQuery.unique sorted its results in DOM order was surprising to many who did not read the documentation carefully. As of jQuery 3.0 this function is being renamed to make it clear.

    Solution: Replace all uses of jQuery.unique with jQuery.uniqueSort which is the same function with a better name.
  `);

  withinFiles(Synvert.ALL_JS_FILES, function () {
    findNode(".CallExpression[callee=.MemberExpression[object IN ($ jQuery)][property=unique]][arguments.length=1]", () => {
      replace("callee.property", { with: "uniqueSort" });
    });
  });
});
