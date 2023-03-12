import joplin from 'api'
import { v4 as uuidv4 } from 'uuid'
import { tmpdir } from 'os'
import { sep } from 'path'
const fs = joplin.require('fs-extra')

const Config = {
    TempFolder: `${tmpdir}${sep}joplin-excalidraw-plugin${sep}`,
    TitlePrefix: 'excalidraw-',
}

export interface IDiagramOptions {
    sketch?: boolean
}

function generateId() {
    return uuidv4().replace(/-/g, '')
}

function buildTitle(json_resource_id: string): string {
    return Config.TitlePrefix + Date.parse(new Date().toString())
}

export function clearDiskCache(): void {
    if (fs.existsSync(Config.TempFolder)) {
        fs.rmdirSync(Config.TempFolder, { recursive: true })
    }
    fs.mkdirSync(Config.TempFolder, { recursive: true })
}

async function writeJsonFile(name: string, data: string, filePath: string = null): Promise<string> {
    if (!filePath) {
        filePath = `${Config.TempFolder}${name}.json`
    }
    filePath += buildTitle(data)
    await fs.writeFile(filePath, data)
    return filePath
}

export async function getDiagramResource(diagramId: string): Promise<{ body: string, dataJson:string }> {
    let resourceData = await joplin.data.get(['resources', diagramId, 'file'])
    return {
        body: "",
        dataJson: new TextDecoder().decode(resourceData.body)
    }
}

export async function updateDiagramResource(diagramId:string, dataJson:string): Promise<string> {
    let filePath = await writeJsonFile(diagramId, dataJson)
    await joplin.data.put(['resources', diagramId], null, {title: buildTitle(dataJson) }, [{ path: filePath }])
    return diagramId
}


export async function createDiagramResource(dataJson:string): Promise<string> {
    let diagramId = generateId()

    let filePath = await writeJsonFile(diagramId, dataJson)
    await joplin.data.post(['resources'], null, { id: diagramId, title: buildTitle(dataJson) }, [{ path: filePath }])

    return diagramId
}

export async function isDiagramResource(diagramId: string): Promise<boolean> {
    let resourceProperties = await joplin.data.get(['resources', diagramId])
    return resourceProperties.title.startsWith(Config.TitlePrefix)
}