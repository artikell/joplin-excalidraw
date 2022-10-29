import joplin from 'api'
import { v4 as uuidv4 } from 'uuid';

import { ContentScriptType, ToolbarButtonLocation, MenuItem, MenuItemLocation } from 'api/types'
import { Settings } from "./types"
import { replaceData, parseData, isExcalidraw } from './handleStrings'
import { createDiagramResource, getDiagramResource, updateDiagramResource } from './resources';

const Config = {
  ContentScriptId: 'excalidraw-script',
}


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
  if (!panel || isHide) return
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
  if (isHide) {
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

const handleMessage = async (message: { message: string, sheets: any[], jsonData: Settings }) => {
  if (message.message === 'excalidraw_sync') {
    handleSync(message)
  }
}
// ´´½¨dlgÄÚÇ¶form
const buildDialogHTML = (diagramBody: string): string =>  {
	return `
		<form name="main">
			<input type="" id="excalidraw_diagram_json" value='${diagramBody}'>
		</form>
		`
}

const openDialog = async (context: string) => {
  const appPath = await joplin.plugins.installationDir();

  let dialogs = joplin.views.dialogs;
  let diglogHandle = await dialogs.create(`myDialog2-${uuidv4()}`);

  let header = buildDialogHTML(context);
  let iframe = `<iframe id="excalidraw_iframe" style="position:absolute;border:0;width:100%;height:100%;" src="${appPath}\\local-excalidraw\\index.html" title="description"></iframe>`

  await dialogs.setHtml(diglogHandle, header + iframe);
  await dialogs.setButtons(diglogHandle, [
    { id: 'ok', title: 'Save' },
    { id: 'cancel', title: 'Close' }
  ]);
  await dialogs.open(diglogHandle)
}

joplin.plugins.register({
  onStart: async () => {
    /* support excalidraw dialog */
    await joplin.contentScripts.register(
      ContentScriptType.MarkdownItPlugin,
      Config.ContentScriptId,
      './contentScript.js'
    );

    await joplin.contentScripts.onMessage(Config.ContentScriptId, (message: any) => {
      console.log(message)
      openDialog(message);
    });

    /* support excalidraw panel */
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
