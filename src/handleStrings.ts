import { Settings } from "./types"

const dataText = 'excalidraw-data'
const dataTextMD = `\`\`\`${dataText}`

export const isExcalidraw = (input: string): boolean => input == undefined?false:input.toLocaleLowerCase().includes('```excalidraw```')
export const hasData = (input: string): boolean => input == undefined?false:input.toLocaleLowerCase().includes(dataText)

export const parseData = (input: string): Settings => {
  const data = isolateData(input)
  if(!data) {
    return {}
  } else {
    const parsedData = data ? JSON.parse(data) : null
    return parsedData
  }
}

export const replaceData = (input: string, replace: string): string => {
  const temp = input
  if (!hasData(input))
    return temp + '\n\n' + dataTextMD + '\n\n' + replace
  const splitData = temp.split(dataTextMD)
  return splitData[0] + dataTextMD + '\n\n' + replace
}

export const isolateData = (input: string): string => {
  if (!hasData(input)) return ''
  return input.split(dataText)[1].replace('\n', '').trim()
}
