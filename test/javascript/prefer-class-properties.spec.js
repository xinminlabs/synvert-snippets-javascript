require("../../lib/javascript/prefer-class-properties");
const { assertConvert } = require("../utils");

describe("javascript/prefer-class-properties", () => {
  describe("normal", () => {
    const input = `
      class Button extends Component {
        constructor(props) {
          super(props);
          this.state = { clicked: false };
          this.handleClick = this.handleClick.bind(this);
          this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleClick() {
          this.setState({ clicked: true });
        }

        handleSubmit() {
          this.setState({ submitted: true });
        }

        handleChange() {
          this.setState({ changed: true });
        }
      }
    `;

    const output = `
      class Button extends Component {
        constructor(props) {
          super(props);
          this.state = { clicked: false };
        }

        handleClick = () => {
          this.setState({ clicked: true });
        }

        handleSubmit = () => {
          this.setState({ submitted: true });
        }

        handleChange = () => {
          this.setState({ changed: true });
        }
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "javascript/prefer-class-properties",
    });
  });

  describe("async", () => {
    const input = `
      class Button {
        constructor(props) {
          this.state = { clicked: false };
          this.handleClick = this.handleClick.bind(this);
        }

        async handleClick() {
          this.setState({ clicked: true });
        }
      }
    `;

    const output = `
      class Button {
        constructor(props) {
          this.state = { clicked: false };
        }

        handleClick = async () => {
          this.setState({ clicked: true });
        }
      }
    `;

    assertConvert({
      input,
      output,
      path: "code.jsx",
      snippet: "javascript/prefer-class-properties",
    });
  });
});
