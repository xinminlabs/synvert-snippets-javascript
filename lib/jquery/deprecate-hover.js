const Synvert = require("synvert-core");

new Synvert.Rewriter("jquery", "deprecate-hover", () => {
  configure({ sourceType: 'script' });

  description(`
    JQMIGRATE: jQuery.fn.hover() is deprecated
    Cause: The .hover() method is a shorthand for the use of the mouseover/mouseout events. It is often a poor user interface choice because it does not allow for any small amounts of delay between when the mouse enters or exits an area and when the event fires. This can make it quite difficult to use with UI widgets such as drop-down menus. For more information on the problems of hovering, see the hoverIntent plugin.

    Solution: Review uses of .hover() to determine if they are appropriate, and consider use of plugins such as hoverIntent as an alternative. The direct replacement for .hover(fn1, fn2), is .on("mouseenter", fn1).on("mouseleave", fn2).
  `);

  withinFiles(Synvert.ALL_JS_FILES, function () {
    findNode(".CallExpression[callee=.MemberExpression[object IN (/^\\$/ /^jQuery/)][property=hover]][arguments.length=2]", () => {
      replaceWith(`{{callee.object}}.on("mouseenter", {{arguments.0}}).on("mouseover", {{arguments.1}})`);
    });
  });
});
