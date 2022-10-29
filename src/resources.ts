import joplin from 'api'
import { v4 as uuidv4 } from 'uuid'
import { tmpdir } from 'os'
import { sep } from 'path'
const fs = joplin.require('fs-extra')

const Config = {
    TempFolder: `${tmpdir}${sep}joplin-excalidraw-plugin${sep}`,
    DataImageRegex: /^data:image\/(?<extension>png|svg)(?:\+xml)?;base64,(?<blob>.*)/,
    TitlePrefix: 'mindmap-',
}

export interface IDiagramOptions {
    sketch?: boolean
}

function generateId() {
    return uuidv4().replace(/-/g, '')
}

function buildTitle(json_resource_id: string): string {
    return Config.TitlePrefix + json_resource_id
}
function parseTitle(title: string): any {
    return title.replace(Config.TitlePrefix, '')
}

export function clearDiskCache(): void {
    fs.rmdirSync(Config.TempFolder, { recursive: true })
    fs.mkdirSync(Config.TempFolder, { recursive: true })
}

async function writeJsonFile(name: string, data: string, filePath: string = null): Promise<string> {
    if (!filePath) {
        filePath = `${Config.TempFolder}${name}.json`
    }
    await fs.writeFile(filePath, data)
    return filePath
}

export async function getDiagramResource(diagramId: string): Promise<{ body: string, dataJson: string }> {
    let resourceProperties = await joplin.data.get(['resources', diagramId])
    let resourceData = await joplin.data.get(['resources', diagramId, 'file'])

    let dataJson: string = ""
    try {
        dataJson = parseTitle(resourceProperties.title)
    } catch (e) {
        console.warn('getDiagramResource - json resource ID parsing failed:', e)
    }

    if (!resourceData.contentType.startsWith('image')) {
        throw new Error('Invalid resource content type. The resource must be an image')
    }

    return {
        body: `data:${resourceData.contentType};base64,${Buffer.from(resourceData.body).toString('base64')}`,
        dataJson: dataJson
    }
}

export async function createDiagramResource(data: string, dataJson: string): Promise<string> {
    let diagramId = generateId()

    let createdResource = await joplin.data.post(['resources'], null, { id: diagramId, title: buildTitle(dataJson) })
    console.warn('getDiagramResource - diagramId:', diagramId)
    return diagramId
}

export async function updateDiagramResource(diagramId: string, data: string, dataJson: string): Promise<string> {
    let newDiagramId = generateId()

    let createdResource = await joplin.data.post(['resources'], null, { id: newDiagramId, title: buildTitle(dataJson) })
    console.warn('getDiagramResource - diagramId:', diagramId)
    return newDiagramId
}

export async function isDiagramResource(diagramId: string): Promise<boolean> {
    let resourceProperties = await joplin.data.get(['resources', diagramId])
    return resourceProperties.title.startsWith(Config.TitlePrefix)
}