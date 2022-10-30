const { assertHelper } = require("../utils");

describe("helpers/add-import", () => {
  describe("default import", () => {
    describe("inserts unless exist", () => {
      assertHelper({
        input: `
          class MyComponent {}
        `,
        output: `
          import React from "react";
          class MyComponent {}
        `,
        helper: "helpers/add-import",
        options: { defaultImport: "React", moduleSpecifier: "react" },
      });
    });

    describe("inserts before named import", () => {
      assertHelper({
        input: `
          import { Component } from "react";
          class MyComponent {}
        `,
        output: `
          import React, { Component } from "react";
          class MyComponent {}
        `,
        helper: "helpers/add-import",
        options: { defaultImport: "React", moduleSpecifier: "react" },
      });
    });

    describe("does not insert if exist", () => {
      assertHelper({
        input: `
          import React from "react";
          class MyComponent {}
        `,
        output: `
          import React from "react";
          class MyComponent {}
        `,
        helper: "helpers/add-import",
        options: { defaultImport: "React", moduleSpecifier: "react" },
      });
    });
  });

  describe("named import", () => {
    describe("inserts unless exist", () => {
      assertHelper({
        input: `
          import Bootstrap from "react-bootstrap";
          class MyComponent {}
        `,
        output: `
          import { Component } from "react";
          import Bootstrap from "react-bootstrap";
          class MyComponent {}
        `,
        helper: "helpers/add-import",
        options: { namedImport: "Component", moduleSpecifier: "react" },
      });
    });

    describe("inserts no import", () => {
      assertHelper({
        input: `
          class MyComponent {}
        `,
        output: `
          import { Component } from "react";
          class MyComponent {}
        `,
        helper: "helpers/add-import",
        options: { namedImport: "Component", moduleSpecifier: "react" },
      });
    });

    describe("inserts unless exist but has default import", () => {
      assertHelper({
        input: `
          import React from "react";
          class MyComponent {}
        `,
        output: `
          import React, { Component } from "react";
          class MyComponent {}
        `,
        helper: "helpers/add-import",
        options: { namedImport: "Component", moduleSpecifier: "react" },
      });
    });

    describe("does not insert if exist", () => {
      assertHelper({
        input: `
          import { Component } from "react";
          class MyComponent {}
        `,
        output: `
          import { Component } from "react";
          class MyComponent {}
        `,
        helper: "helpers/add-import",
        options: { namedImport: "Component", moduleSpecifier: "react" },
      });
    });
  });

  describe("namespace import", () => {
    describe("inserts unless exist", () => {
      assertHelper({
        input: `
          class MyComponent {}
        `,
        output: `
          import * as vscode from "vscode";
          class MyComponent {}
        `,
        helper: "helpers/add-import",
        options: { namespaceImport: "vscode", moduleSpecifier: "vscode" },
      });
    });

    describe("does not insert if exist", () => {
      assertHelper({
        input: `
          import * as vscode from "vscode";
          class MyComponent {}
        `,
        output: `
          import * as vscode from "vscode";
          class MyComponent {}
        `,
        helper: "helpers/add-import",
        options: { namespaceImport: "vscode", moduleSpecifier: "vscode" },
      });
    });
  });
});