new Synvert.Rewriter("javascript", "forbid-use-strict", () => {
  description("Remove `'use strcit'` if does not exist");

  configure({ parser: Synvert.Parser.TYPESCRIPT });

  withinFiles(Synvert.ALL_FILES, () => {
    findNode('.ExpressionStatement[expression.text="use strict"]', function () {
      remove();
    });
  });
});
