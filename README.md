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


there are a set if events that are fired when specific actions take place, you can hook to and get the important information about affected component.

* onInsert
* onResize
* onFocusIn
* onRemove
* onUpdate

```js
dnd.onInsert((event, {id, index, target, parent, parentId, slots})=>{
   console.log('inserted component id: ', id)
});

dnd.onUpdate((event, {id, target, parent, parentId, slots})=>{
   console.log('updated component id: ', id)
})

dnd.onRemove((event, {id, target, parent, parentId, slots})=>{
   console.log('removed component id: ', id)
})

dnd.onResize((event, {id, target, parent, parentId, slots})=>{
   console.log('resized component id: ', id)
})
dnd.onFocusIn((event, {id, index, target, parent, parentId, slots})=>{
   console.log('resized component id: ', id)
})
```

