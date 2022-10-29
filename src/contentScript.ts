const leftPad = require('left-pad');

// function extractCodeFromIdAttribute(idAttribute: string): string {
//     //:/dc918ec87077460fbdbb0986a91c4c9d
//     const splitViewMatch = idAttribute.match(/^\:\/([A-Za-z0-9]+)/)
//     if (splitViewMatch) {
//         return splitViewMatch[1]
//     }
//     //file://C:/Users/user/.config/joplin-desktop/resources/dc918ec87077460fbdbb0986a91c4c9d.png?t=1647790570726
//     const richTextMatch = idAttribute.match(/^file\:\/\/.+?([a-z0-9]+)\.(svg|png)(\?t=[0-9]+)?$/)
//     if (richTextMatch) {
//         return richTextMatch[1]
//     }
//     return null
// }

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

        const val = getTagValue(token, "src");
		
		const postMessageWithResponseTest = `
			webviewApi.postMessage('${contentScriptId}', '${val}').then(function(response) {
				console.info('Got response in content script: ' + response);
			});
			return false;
		`;
		
		return `<button onclick="${postMessageWithResponseTest.replace(/\n/g, ' ')}">Excalidraw</button>`
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