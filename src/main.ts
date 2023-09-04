import interact from 'interactjs';
import { 
	addPlaceholder,
	replacePlaceholder,
	removePlaceholder,
    addComponentControllers,
    addWrapperToComponent,
    addResizePoints
 }   from './utils';

export default function () {
	let update: Function;
	let insert: Function;
	let remove: Function;
	let focusIn: Function;
	let focusOut: Function;
	let resize: Function;
	let fireContoller: number = 0; //conttrol drag over event speed
	interface details {
		id: string | number | undefined;
		target: HTMLElement | undefined;
		parentId: string | number | undefined;
		parent: HTMLElement | undefined;
		slots: [] | string | undefined;
	}
	function getDetails(event: Event): details {
		if (!event?.target?.tagName)
			return {
				id: undefined,
				target: undefined,
				parent: undefined,
				parentId: undefined,
				slots: undefined
			};

		const target = event?.target?.classList?.contains('u-component')
			? event?.target
			: event?.target?.querySelector('.u-component');

		const parent = target?.parentElement.closest('.u-component') ?? target?.closest('.drop-zone');

		return {
			id: target?.getAttribute('id'),
			target,
			parentId: parent?.getAttribute('id'),
			parent,
			slots: target?.getAttribute('slots')
		};
	}
	function makeReiszeAbleSelector(targetSelector: string, { onResize } = { onResize: undefined }) {
		interact(targetSelector)
		.resizable({
			edges: { top: '.top', left: '.left', bottom: '.bottom', right: '.right' },
			listeners: {
				move: function (event) {
					let { x, y } = event.target.dataset;

					x = (parseFloat(x) || 0) + event.deltaRect.left;
					y = (parseFloat(y) || 0) + event.deltaRect.top;

					Object.assign(event.target.style, {
						width: `${event.rect.width}px`,
						height: `${event.rect.height}px`,
						transform: `translate(${x}px, ${y}px)`
					});

					Object.assign(event.target.dataset, { x, y });
				}
			}
		})
		.on('down', (event) => {
			if (event.target.classList.contains('resize-point')) {
				event.preventDefault();
			}
		})
		.on('resizeend', (event) => {
			const details: details = getDetails(event);
			onResize && onResize(event, details);
			resize && resize(event, details);
		});
	}
	function makeDragAble(el: HTMLElement, { onDragStart, onDragEnd }) {
		el.setAttribute('draggable', 'true');
		const target = el;
		if (!target) return;
		target.setAttribute('tabindex', 0);
		if (!target.querySelector('.control')) {
			addComponentControllers(target);
		}
		if (!target.querySelector('.edges')) {
			addResizePoints(target);
		}
		el.addEventListener('dragstart', (event: Event) => {
			if (!event.dataTransfer) return;
			event.stopPropagation();
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.dropEffect = 'move';
			const template = event.target.outerHTML;
			event.dataTransfer.setData('text/html', template);
			event.target.style.display = 'none';

			onDragStart && onDragStart(event);
			remove && remove(event, getDetails(event));
		});
		el.addEventListener('dragend', (event) => {
			event.target.parentElement.remove();
			onDragEnd && onDragEnd(event);
		});
	}
	function makeDropZone(el: HTMLElement, { onDragEnter, onDragOver, onDragLeave, onDrop }) {
		onDragEnter &&
			el.addEventListener('dragenter', (event) => {
				event.preventDefault();
				onDragEnter(event);
			});
		el.addEventListener('dragover', (event) => {
			event.preventDefault();
			if (fireContoller < 20) {
				fireContoller++;
				return;
			}
			fireContoller = 0;
			
		    removePlaceholder();
		    addPlaceholder(event);
			onDragOver && onDragOver(event);
		});
		onDragLeave &&
			el.addEventListener('dragleave', (event) => {
				removePlaceholder();
				event.preventDefault();
				onDragLeave(event);
			});
		el.addEventListener('drop', (event) => {
			event?.preventDefault();
			const component = addWrapperToComponent(event?.dataTransfer.getData('text/html'));
			replacePlaceholder(component)
			onDrop && onDrop(event);
		});
		el.addEventListener('DOMNodeInserted', (event: Event) => {
			const details = getDetails(event);
			const target = details.target;
			if (target) {
				makeDragAble(target, { onDragEnd: undefined, onDragStart: undefined });
			}

			insert && insert(event, details);
		});
		el.addEventListener('focusin', (event: Event) => {
			event.preventDefault();
			event.stopPropagation();
			const details = getDetails(event);
			if (!details.target) return;
			focusIn && focusIn(event, details);
		});
		el.addEventListener('click', (event: Event) => {
			event.preventDefault();
			// event.stopPropagation();
			if (!event?.target?.classList?.contains('drop-zone')) return;
			focusOut && focusOut(event, {});
		});
	}
	function makeDragAbleSelector(query: string, { onDragStart, onDragEnd } = {onDragEnd: undefined, onDragStart: undefined}) {
		document.querySelectorAll(query).forEach((element) => {
			makeDragAble(element, { onDragStart, onDragEnd });
		});
	}
	function makeDropZoneSelector(query: string, { onDragEnter, onDragOver, onDragLeave, onDrop }) {
		document.querySelectorAll(query).forEach((element) => {
			makeDropZone(element, { onDragEnter, onDragOver, onDragLeave, onDrop });
		});
	}

	function onUpdate(callback: Function): void {
		update = callback;
	}
	function onInsert(callback: Function): void {
		insert = callback;
	}
	function onRemove(callback: Function): void {
		remove = callback;
	}
	function onFocusIn(callback: Function): void {
		focusIn = callback;
	}
	function onFocusOut(callback: Function): void {
		focusOut = callback;
	}
	function onResize(callback: Function): void {
		resize = callback;
	}

	return {
		makeDragAble,
		makeDropZone,
		makeDragAbleSelector,
		makeDropZoneSelector,
		makeReiszeAbleSelector,
		onUpdate,
		onInsert,
		onRemove,
		onFocusIn,
		onFocusOut,
		onResize
	};
}

