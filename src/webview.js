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
          onChange: (elements, state) => {
            console.log("Elements :", elements, "State : ", state)
            console.log("Elements :", elements, "State : ", state)
          }
        })
      )
    );
  };

  
const start = async () => {
  let stopped = false
  let processingMessage = false

  async function init(message) {
    infiniteSave()
  }

  async function waitForLuckySheet(cb) {
    while (!webviewApi || !webviewApi.postMessage || !existReact()) {
      if (stopped) return
      await new Promise(resolve => setTimeout(() => resolve(), 500))
    }
    const excalidrawWrapper = document.getElementById("excalidraw");
    ReactDOM.render(React.createElement(App), excalidrawWrapper);
    return await cb()
  }

  function existReact() {
    var isExist = false
    try {
      if (!React || !ReactDOM) {
        isExist = false
      } else {
        isExist = true
      }
    } catch(e) {
      console.error("React isn't exist...")
    }
    return isExist
  }

  async function infiniteSave() {
    while (!stopped) {
      webviewApi.postMessage({
        message: 'excalidraw_sync',
        sheets: "",
        jsonData: ""
      })
      await new Promise(resolve => setTimeout(() => resolve(), 2000))
    }
  }

  webviewApi.onMessage(async ({ message }) => {
    if (processingMessage === message.message)
      return console.log("ALREADY PROCESSING", message.message)

    processingMessage = message.message
    if (message.message === 'excalidraw_init')
      stopped = false
      await waitForLuckySheet(async () => await init(message))
    // if (message.message === 'excalidraw_close') {
    //   stopped = true
    //   await waitForLuckySheet(async () => await luckysheet.destroy())
    // }

    console.log("done-processing")
    processingMessage = false
  })
}

try {
  start()
} catch (err) {
  console.error(err)
}
