# Joplin-excalidraw

Implementation of [excalidraw](https://github.com/excalidraw/excalidraw) for Joplin. 

## How to?

Initiate a Excalidraw by writing following in the markdown:

```md
```excalidraw```
```

You can now re-open the note and the plugin will load.

Or use special tags to represent excalidraw content

```
![excalidraw](excalidraw://970d7f3995b94321827cdcb8b9e16dc0)
```

## Example

![Excalidraw in action](./example.gif)

## Notes

- The [excalidraw](https://github.com/excalidraw/excalidraw) library is bundled into the plugin.
- It was tested in the MacOS,Linux,Windows Desktop App
- This project refers to the [ThibaultJanBeyer/joplin-sheets](https://github.com/ThibaultJanBeyer/joplin-sheets) project, thank you
- Thanks [@Winbee](https://github.com/Winbee) to refactor by vite