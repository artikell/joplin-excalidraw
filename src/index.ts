import joplin from 'api'
import { v4 as uuidv4 } from 'uuid';

import { Settings } from "./types"
import { ToolbarButtonLocation } from 'api/types';
import { replaceData, parseData, isExcalidraw } from './handleStrings'

let panel, note, isOpening, isHide

const createPanel = async (): Promise<string> => {
  // unfortunately it's wayyy more reliable to just close and re-create than to re-use a panel :'(
  const panel = await joplin.views.panels.create(`excalidraw-${uuidv4()}`)
  await joplin.views.panels.onMessage(panel, handleMessage)
 
  await joplin.views.panels.setHtml(panel, '<div class="container" id="excalidraw">Hello Excalidraw!!!</div>')

  await joplin.views.panels.addScript(panel, './webview.js')
  await joplin.views.panels.addScript(panel, './webview.css')
  await joplin.views.panels.addScript(panel, './react.development.js')
  await joplin.views.panels.addScript(panel, './react-dom.development.js')
  await joplin.views.panels.addScript(panel, './excalidraw.development.js')

  return panel
}

const handleClose = async () => {
  if(!panel || isHide) return
  await joplin.views.panels.postMessage(panel, { message: 'excalidraw_close' })
  await joplin.views.panels.hide(panel)
  isHide = true
}

const handleOpen = async () => {
  panel = await createPanel()
  const options = await parseData(note.body)
  await joplin.views.panels.postMessage(panel, {
    message: 'excalidraw_init',
    options
  })
  await joplin.views.panels.show(panel)
  isHide = false
}

const switchView = async () => {
  if(isHide) {
  	await updateView()
  } else {
  	await handleClose()
  }
}

const updateView = async () => {
  isOpening = true
  await handleClose()

  note = await joplin.workspace.selectedNote()

  if (isExcalidraw(note?.body)) {
    await handleOpen()
  }
  isOpening = false
}

const handleSync = async ({ jsonData }) => {
  if (!isExcalidraw(note?.body) || isOpening) return
  note.body = replaceData(note.body, JSON.stringify(jsonData))
  await joplin.commands.execute("editor.setText", note.body);
  await joplin.data.put(['notes', note.id], null, { body: note.body });
}

const handleMessage = async (message: {message:string,sheets:any[],jsonData:Settings}) => {
  if(message.message === 'excalidraw_sync') {
    handleSync(message)
  }
}

joplin.plugins.register({
  onStart: async () => {
	await joplin.commands.register({
		name: 'switchExcalidraw',
		label: 'switch excalidraw panel',
		iconName: 'fa fa-palette',
		execute: switchView
	});

	await joplin.views.toolbarButtons.create('switchExcalidraw', 'switchExcalidraw', ToolbarButtonLocation.NoteToolbar);

    await joplin.workspace.onNoteSelectionChange(updateView)
  },
})
