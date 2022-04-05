const Synvert = require("synvert-core");

new Synvert.Rewriter("react", "transform-class-components-to-functions", () => {
  description("transform react class components to functions");

  const DEFAULT_INDENT = 2;
  const LIFECYCLE_METHODS = [
    "componentDidMount",
    "componentDidUpdate",
    "componentWillReceiveProps",
    "componentWillUnmount",
    "componentDidCatch",
    "shouldComponentUpdate",
  ];

  const convertedFiles = {};
  const setComponentName = (filePath, componentName) => {
    convertedFiles[filePath] = convertedFiles[filePath] || { useEffect: false, thisMethods: [], thisProps: [] };
    convertedFiles[filePath].componentName = componentName;
  };
  const setUseEffect = (filePath) => {
    convertedFiles[filePath] = convertedFiles[filePath] || { useEffect: false, thisMethods: [], thisProps: [] };
    convertedFiles[filePath].useEffect = true;
  };
  const addThisMethod = (filePath, thisMethod) => {
    convertedFiles[filePath] = convertedFiles[filePath] || { useEffect: false, thisMethods: [], thisProps: [] };
    convertedFiles[filePath].thisMethods.push(thisMethod);
  };
  const addThisProp = (filePath, thisProp) => {
    convertedFiles[filePath] = convertedFiles[filePath] || { useEffect: false, thisMethods: [], thisProps: [] };
    convertedFiles[filePath].thisProps.push(thisProp);
  };

  withinFiles(Synvert.ALL_FILES, function () {
    const currentFilePath = this.currentFilePath;
    withNode({ type: "ClassDeclaration", superClass: "Component" }, () => {
      let functionBodyIndent = this.currentNode.loc.end.column - 1;
      const functionBody = [];
      const lifecycleMethods = [];

      // const { name } = this.props;
      withNode(
        {
          type: "VariableDeclaration",
          declarations: { length: 1, first: { init: { type: "MemberExpression", object: "this", property: "props" } } },
        },
        () => {
          this.currentNode.declarations[0].id.properties.forEach((property) =>
            addThisProp(currentFilePath, property.toSource())
          );
        }
      );

      // this.props.name => name
      withNode(
        { type: "MemberExpression", object: { type: "MemberExpression", object: "this", property: "props" } },
        () => {
          addThisProp(currentFilePath, this.currentNode.property.toSource());
        }
      );

      // state = { key: value };
      withNode({ type: "PropertyDefinition", key: "state" }, () => {
        this.currentNode.value.properties.forEach((property) => {
          const name = property.key.name;
          const value = property.value.toSource();
          functionBody.push(
            indent(
              `const [${name}, set${name.replace(/^\w/, (c) => c.toUpperCase())}] = useState(${value});\n`,
              DEFAULT_INDENT
            )
          );
        });
      });

      // foo = () => {}
      withNode({ type: "PropertyDefinition", value: { type: "ArrowFunctionExpression" } }, () => {
        const name = this.currentNode.key.name;
        const value = this.currentNode.value.toSource({ fixIndent: true });
        functionBody.push(indent(`const ${name} = ${value}\n`, DEFAULT_INDENT));
        addThisMethod(currentFilePath, name);
      });

      // componentDidMount() {
      // }
      withNode({ type: "MethodDefinition", key: { in: LIFECYCLE_METHODS } }, () => {
        lifecycleMethods.push(this.currentNode);
      });

      if (lifecycleMethods.length > 0) {
        functionBody.push("  // Synvert TODO: convert lifecycle methods to useEffect by yourself");
        setUseEffect(currentFilePath);
        lifecycleMethods.forEach((lifecycleMethod) => {
          const lines = lifecycleMethod.toSource({ fixIndent: true }).split("\n");
          functionBody.push(
            indent(lines.map((line) => (line.length > 0 ? "// " + line : "//")).join("\n"), DEFAULT_INDENT)
          );
        });
      }

      // render() {}
      //
      // convert it temporarily to `const render = () => {}`
      // to avoid duplicated declarations.
      // it will be removed in the next round.
      withNode({ type: "MethodDefinition", key: "render" }, () => {
        functionBody.push(
          indent(this.currentNode.toSource({ fixIndent: true }), DEFAULT_INDENT).replace(
            /render ?\(\)/,
            "const render = () =>"
          )
        );
      });

      replaceWith(
        indent(
          `
const {{id}} = (props) => {
${functionBody.join("\n")}
}
      `.trim(),
          functionBodyIndent
        ),
        { autoIndent: false }
      );

      setComponentName(currentFilePath, this.currentNode.id.name);
    });
  });

  withinFiles(`{${Object.keys(convertedFiles).join(",")},}`, function () {
    const { componentName, useEffect, thisMethods, thisProps } = convertedFiles[this.currentFilePath];
    const conflictNames = thisMethods.filter((method) => thisProps.includes(method));

    withNode({ type: "VariableDeclarator", id: componentName }, () => {
      withNode({ type: "ArrowFunctionExpression", params: { length: 1, first: "props" } }, () => {
        if (thisProps.length === 0) {
          deleteNode("params.0");
        } else if (conflictNames.length === 0) {
          replace("params.0", { with: `{ ${[...new Set(thisProps)].join(", ")} }` });
        } else if (thisProps.length - conflictNames.length > 0) {
          replace("params.0", {
            with: `{ ${[...new Set(thisProps.filter((prop) => !thisMethods.includes(prop)))].join(", ")}, ...props }`,
          });
        }
      });
    });

    // <div onClick={this.clickHandler} />
    // =>
    // <div onClick={clickHandler} />
    withNode({ type: "MemberExpression", object: "this", property: { in: thisMethods } }, () => {
      deleteNode(["object", "dot"]);
    });

    // const { name } = this.props;
    withNode(
      {
        type: "VariableDeclaration",
        declarations: { length: 1, first: { init: { type: "MemberExpression", object: "this", property: "props" } } },
      },
      () => {
        remove();
      }
    );

    // const { name } = this.state;
    withNode(
      {
        type: "VariableDeclaration",
        declarations: { length: 1, first: { init: { type: "MemberExpression", object: "this", property: "state" } } },
      },
      () => {
        remove();
      }
    );

    // this.props.name => name
    withNode(
      {
        type: "MemberExpression",
        object: { type: "MemberExpression", object: "this", property: "props" },
        property: { notIn: conflictNames },
      },
      () => {
        deleteNode(["object", "dot"]);
      }
    );

    // this.props.name => props.name
    withNode(
      {
        type: "MemberExpression",
        object: { type: "MemberExpression", object: "this", property: "props" },
        property: { in: conflictNames },
      },
      () => {
        deleteNode(["object.object", "object.dot"]);
      }
    );

    // this.state.name => name
    withNode(
      { type: "MemberExpression", object: { type: "MemberExpression", object: "this", property: "state" } },
      () => {
        deleteNode(["object", "dot"]);
      }
    );

    // this.setState(foo: 'bar') => setFoo('bar')
    withNode(
      { type: "CallExpression", callee: { type: "MemberExpression", object: "this", property: "setState" } },
      () => {
        const properties = [];
        withNode({ type: "ObjectExpression" }, () => {
          withNode({ type: "Property" }, () => {
            properties.push({ name: this.currentNode.key.name, value: this.currentNode.value.toSource() });
          });
        });
        const useStateStatements = properties.map(
          ({ name, value }) => `set${name.replace(/^\w/, (c) => c.toUpperCase())}(${value})`
        );
        replaceWith(useStateStatements.join("\n"));
      }
    );

    // const render = () => {}
    withNode(
      {
        type: "VariableDeclaration",
        declarations: {
          length: 1,
          first: { type: "VariableDeclarator", id: "render", init: { type: "ArrowFunctionExpression" } },
        },
      },
      () => {
        const body = this.currentNode.declarations[0].init.body.body;
        replaceWith(body.toSource({ fixIndent: true }));
      }
    );

    ifExistNode({ type: "CallExpression", callee: "useState" }, () => {
      // import React, { Component } from 'react'
      // =>
      // import React, { Component, useState } from 'react'
      withNode(
        {
          type: "ImportDeclaration",
          source: { value: "react" },
          specifiers: { first: { type: "ImportDefaultSpecifier", local: "React" } },
        },
        () => {
          unlessExistNode({ type: "ImportSpecifier", local: "useState" }, () => {
            withNode({ type: "ImportSpecifier", local: "Component" }, () => {
              insert(", useState", { at: "end" });
            });
          });
        }
      );
    });

    if (useEffect) {
      // import React, { Component } from 'react'
      // =>
      // import React, { Component, useEffect } from 'react'
      withNode(
        {
          type: "ImportDeclaration",
          source: { value: "react" },
          specifiers: { first: { type: "ImportDefaultSpecifier", local: "React" } },
        },
        () => {
          unlessExistNode({ type: "ImportSpecifier", local: "useEffect" }, () => {
            withNode({ type: "ImportSpecifier", local: "Component" }, () => {
              insert(", useEffect", { at: "end" });
            });
          });
        }
      );
    }

    // import React, { Component } from 'react'
    // =>
    // import React from 'react'
    withNode({ type: "ImportSpecifier", local: "Component" }, () => {
      remove();
    });
  });
});