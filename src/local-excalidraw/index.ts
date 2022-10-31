/*eslint-disable */
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ExcalidrawLib from "@excalidraw/excalidraw";
import "./style.css";

let excalidrawJson = "{}";

let InitialData = {
  appState: { viewBackgroundColor: "#AFEEEE", currentItemFontFamily: 1 }
};

try {
  let el:HTMLInputElement = window.parent.document.getElementById('excalidraw_diagram_json')  as HTMLInputElement;
  InitialData = JSON.parse((el as HTMLInputElement).value);
} catch (d) {
  console.error("error: ", d)
}

const App = () => {
  const excalidrawWrapperRef = React.useRef(null);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      {
        className: "excalidraw-wrapper",
        ref: excalidrawWrapperRef,
      },
      React.createElement(ExcalidrawLib.Excalidraw, {
        initialData: InitialData,
        onChange: (elements, state) => {
          excalidrawJson = (ExcalidrawLib as any).serializeAsJSON(
            elements,
            state
          );
          (window.parent.document.getElementById('excalidraw_diagram_json') as HTMLInputElement).value = excalidrawJson;
        },
      })
    )
  );
};

const excalidrawWrapper = document.getElementById("app");

ReactDOM.render(React.createElement(App), excalidrawWrapper);
