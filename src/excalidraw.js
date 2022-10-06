/*eslint-disable */
const App = () => {
    const excalidrawRef = React.useRef(null);
    const excalidrawWrapperRef = React.useRef(null);
    const [dimensions, setDimensions] = React.useState({
      width: undefined,
      height: undefined
    });
  
    const [viewModeEnabled, setViewModeEnabled] = React.useState(false);
    const [zenModeEnabled, setZenModeEnabled] = React.useState(false);
    const [gridModeEnabled, setGridModeEnabled] = React.useState(false);
  
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
  
    const updateScene = () => {
      const sceneData = {
        elements: [
          {
            type: "rectangle",
            version: 141,
            versionNonce: 361174001,
            isDeleted: false,
            id: "oDVXy8D6rom3H1-LLH2-f",
            fillStyle: "hachure",
            strokeWidth: 1,
            strokeStyle: "solid",
            roughness: 1,
            opacity: 100,
            angle: 0,
            x: 100.50390625,
            y: 93.67578125,
            strokeColor: "#c92a2a",
            backgroundColor: "transparent",
            width: 186.47265625,
            height: 141.9765625,
            seed: 1968410350,
            groupIds: []
          }
        ],
        appState: {
          viewBackgroundColor: "#edf2ff"
        }
      };
      excalidrawRef.current.updateScene(sceneData);
    };
  
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        { className: "button-wrapper" },
        React.createElement(
          "button",
          {
            className: "update-scene",
            onClick: updateScene
          },
          "Update Scene"
        ),
        React.createElement(
          "button",
          {
            className: "reset-scene",
            onClick: () => excalidrawRef.current.resetScene()
          },
          "Reset Scene"
        ),
        React.createElement(
          "label",
          null,
          React.createElement("input", {
            type: "checkbox",
            checked: viewModeEnabled,
            onChange: () => setViewModeEnabled(!viewModeEnabled)
          }),
          "View mode"
        ),
        React.createElement(
          "label",
          null,
          React.createElement("input", {
            type: "checkbox",
            checked: zenModeEnabled,
            onChange: () => setZenModeEnabled(!zenModeEnabled)
          }),
          "Zen mode"
        ),
        React.createElement(
          "label",
          null,
          React.createElement("input", {
            type: "checkbox",
            checked: gridModeEnabled,
            onChange: () => setGridModeEnabled(!gridModeEnabled)
          }),
          "Grid mode"
        )
      ),
      React.createElement(
        "div",
        {
          className: "excalidraw-wrapper",
          ref: excalidrawWrapperRef
        },
        React.createElement(ExcalidrawLib.Excalidraw, {
        })
      )
    );
  };
  
  
const ExcalidrawRender = async () => {
    const excalidrawWrapper = document.getElementById("excalidraw");
    React.createElement(App)
    ReactDOM.render(React.createElement(App), excalidrawWrapper);
}

try {
  ExcalidrawRender()
}catch(e) {
  console.log("ExcalidrawRender error: " + e)
}