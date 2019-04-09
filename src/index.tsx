import * as React from "react";
import { render } from "react-dom";
import App from "./component/App";

const rootElement = document.getElementById("root");
if (rootElement) {
  render(<App />, rootElement);
}
