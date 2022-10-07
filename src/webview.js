let excalidrawJson = "{}"
let excalidrawLastJson = "{}"
let excalidrawInitData = {}
/*eslint-disable */
const App = () => {
    const excalidrawWrapperRef = React.useRef(null);
  
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
          initialData: excalidrawInitData,
          onChange: (elements, state) => {
            excalidrawJson = ExcalidrawLib.serializeAsJSON(elements, state)
          }
        })
      )
    );
  };
  
const start = async () => {
  let stopped = false
  let processingMessage = false
  document.getElementById('joplin-plugin-content').parentElement.setAttribute("style","height:100%;");

  async function init(message) {
    excalidrawInitData = message.options;
    excalidrawJson = JSON.stringify(excalidrawInitData);
    const excalidrawWrapper = document.getElementById("excalidraw");
    ReactDOM.render(React.createElement(App), excalidrawWrapper);
    infiniteSave()
  }

  async function waitForLuckySheet(cb) {
    while (!webviewApi || !webviewApi.postMessage || !existReact()) {
      if (stopped) return
      await new Promise(resolve => setTimeout(() => resolve(), 500))
    }
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
      if(excalidrawJson.localeCompare(excalidrawLastJson) != 0) {
        webviewApi.postMessage({
          message: 'excalidraw_sync',
          jsonData: JSON.parse(excalidrawJson)
        })
        excalidrawLastJson = excalidrawJson
      }
      await new Promise(resolve => setTimeout(() => resolve(), 2000))
    }
  }

  webviewApi.onMessage(async ({ message }) => {
    if (processingMessage === message.message)
      return console.log("ALREADY PROCESSING", message.message)

    processingMessage = message.message
    if (message.message === 'excalidraw_init') {
      stopped = false
      await waitForLuckySheet(async () => await init(message))
    } else  if (message.message === 'excalidraw_close') {
      stopped = true
    }

    console.log("done-processing")
    processingMessage = false
  })
}

try {
  start()
} catch (err) {
  console.error(err)
}
