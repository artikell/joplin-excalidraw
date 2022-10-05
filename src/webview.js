const start = async () => {
  let stopped = false
  let processingMessage = false

  async function init(message) {
    // luckysheet.create(message.options)
    excalidraw.updateScene({})
    infiniteSave()
  }

  async function waitForLuckySheet(cb) {
    while (!webviewApi || !webviewApi.postMessage) {
      if (stopped) return
      await new Promise(resolve => setTimeout(() => resolve(), 500))
    }
    return await cb()
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
