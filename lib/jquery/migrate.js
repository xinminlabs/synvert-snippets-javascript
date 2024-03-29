new Synvert.Rewriter("jquery", "migrate", () => {
  description(`
    Migrate jquery base on jquery-migrate plugin, see https://github.com/jquery/jquery-migrate/blob/main/warnings.md.
  `);

  addSnippet("jquery", "deprecate-andself");
  addSnippet("jquery", "deprecate-bind-and-delegate");
  addSnippet("jquery", "deprecate-error");
  addSnippet("jquery", "deprecate-event-shorthand");
  addSnippet("jquery", "deprecate-hover");
  addSnippet("jquery", "deprecate-isarray");
  addSnippet("jquery", "deprecate-isnumeric");
  addSnippet("jquery", "deprecate-jqxhr-methods");
  addSnippet("jquery", "deprecate-load-unload");
  addSnippet("jquery", "deprecate-nodename");
  addSnippet("jquery", "deprecate-parsejson");
  addSnippet("jquery", "deprecate-ready-event");
  addSnippet("jquery", "deprecate-removeattr-boolean-properties");
  addSnippet("jquery", "deprecate-size");
  addSnippet("jquery", "deprecate-unique");
  addSnippet("jquery", "quote-attribute-selector-with-number-sign");
  addSnippet("jquery", "use-expr-pseudos");

  // The following snippets are not listed in jquery-migrate repo,
  // but we suggest to
  addSnippet("jquery", "deprecate-ajax-success-error-and-complete");
  addSnippet("jquery", "prop-boolean-properties");
});
