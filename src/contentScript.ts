const leftPad = require('left-pad');

const excalidrawLogo = `data:image/png;base64,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`

function getTagValue(token: any, tagName: string): string {
    if (token.attrs && token.attrs.length > 0) {
        for (const attr of token.attrs) {
            if (attr[0] === tagName) {
                return attr[1]
            }
        }
    }
    return ""
}

function buildRenderer(context, renderer) {
	const contentScriptId = context.contentScriptId;

    const defaultRender = renderer || function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options)
    }

    return function (tokens, idx, options, env, self) {
		const token = tokens[idx];
		if (token.content !== 'excalidraw') return defaultRender(tokens, idx, options, env, self);

        const diagramId = getTagValue(token, "src").substring("excalidraw://".length);
		
        const sendContentToJoplinPlugin = `
        document.getElementById('excalidraw-${diagramId}-edit').addEventListener('click', async e => {
            webviewApi.postMessage('${contentScriptId}', '${diagramId}').then(function(response) {
                console.info('Got response in content script: ' + response);
            });
        });
        `.replace(/"/g, '&quot;');

        return `
            <span class="excalidraw-container">
                <input id="excalidraw-${diagramId}-edit" type="image" src="${excalidrawLogo}"/>
            </span>
            <style onload="${sendContentToJoplinPlugin}"></style>
        `
    }
}

export default function (context: { contentScriptId: string }) {
    return {
        plugin: async function (markdownIt, _options) {
            markdownIt.renderer.rules.image = buildRenderer(context, markdownIt.renderer.rules.image)
        },
        assets: function () {
            return [
                { name: 'style.css' },
            ]
        },
    }
}