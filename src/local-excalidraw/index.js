/*eslint-disable */
let InitialData = {
  appState: { viewBackgroundColor: "#AFEEEE", currentItemFontFamily: 1 }
};

try {
  InitialData = JSON.parse(window.parent.document.getElementById('excalidraw_diagram_json').value);
} catch (d) {
  console.error("error: ", d)
}

const App = () => {
  const excalidrawRef = React.useRef(null);
  const excalidrawWrapperRef = React.useRef(null);
  const [dimensions, setDimensions] = React.useState({
    width: undefined,
    height: undefined
  });

  React.useEffect(() => {
    setDimensions({
      width: excalidrawWrapperRef.current.getBoundingClientRect().width,
      height: excalidrawWrapperRef.current.getBoundingClientRect().height
    });
    const onResize = () => {
      setDimensions({
        width: excalidrawWrapperRef.current.getBoundingClientRect().width,
        height: excalidrawWrapperRef.current.getBoundingClientRect().height
      });
    };

    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [excalidrawWrapperRef]);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      {
        className: "excalidraw-wrapper",
        ref: excalidrawWrapperRef
      },
      React.createElement(ExcalidrawLib.Excalidraw, {
        initialData: InitialData,
        onChange: (elements, state) => {
          excalidrawJson = ExcalidrawLib.serializeAsJSON(elements, state)
          window.parent.document.getElementById('excalidraw_diagram_json').value = excalidrawJson;
        }
      })
    )
  );
};

const excalidrawWrapper = document.getElementById("app");

ReactDOM.render(React.createElement(App), excalidrawWrapper);
