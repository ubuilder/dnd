# dnd
Drag and drop for Ubuilder cms

```js
import dragdrop from 'dnd'

const dropZone = document.getElementById('dropzone');
const dnd = dragdrop();

dragDrop.makeDropZone(dropZone, {
			onDragEnter: dragEnterHandler,
			onDragLeave: dragLeaveHandler,
      onDragOver: dragOverhandler,
      onDrop: dropHandler,
});
dnd.makeDragAbleSelector('.dragable');
dnd.makeReiszeAbleSelector('.dragable');
```
