//utils functions

function replacePlaceholder(element: HTMLElement): void {
	document.getElementById('component-placeholder')?.replaceWith(element);
}

function addPlaceholder(e: Event): void {
	const placeholder = document.createElement('div');
	placeholder.id = 'component-placeholder';

	if (!isSlot(e) && !isDropZone(e)) return;
	const index = findIndex(e);
	insertAtIndex(e.target, placeholder, index);
}
function isDropZone(e: Event): Boolean {
	return e.target.classList.contains('drop-zone');
}

function findIndex(e: Event): number {
	//crazy low level implementation
	const target = e.target;
	const children = target.childNodes;
	if (children.length == 0) return 0;
	if (children[0].nodeName.startsWith('#')) {
		const range = document.createRange();
		range.selectNode(children[0]);
		const top = range.getBoundingClientRect().top;
		range.detach();
		if (e.clientY < top) return 0;
	} else {
		if (e.clientY < children[0].querySelector('.u-component').getBoundingClientRect().top) return 0;
	}
	for (let i = 0; i < children.length; i++) {
		let child;
		let rect;
		if (children[i].nodeName.startsWith('#')) {
			child = children[i];
			const range = document.createRange();
			range.selectNode(child);
			rect = range.getBoundingClientRect();
			range.detach();
		} else {
			child = children[i].querySelector('.u-component');
			rect = child.getBoundingClientRect();
		}
		if (e.clientY > rect.top && e.clientY < rect.bottom) {
			return e.clientY < rect.top + rect.height / 2 ? i : i + 1;
		}
	}
	return children.length;
}
function insertAtIndex(parrent: HTMLElement, child: HTMLElement, index: number) {
	if (index == 0) {
		return parrent.prepend(child);
	} else if (index == parrent.children.length) {
		return parrent.append(child);
	} else {
		return parrent.insertBefore(child, parrent.children[index]);
	}
}

function isSlot(e: MouseEvent): Boolean {
	return e.target.classList.contains('u-slot');
}
function removePlaceholder(): void {
	document.getElementById('component-placeholder')?.remove();
}
function addResizePoints(target: HTMLelemnt): void {
	const edges = document.createElement('div');
	edges.classList.add('edges');
	edges.innerHTML = `
			<div class = 'resize-point left'></div>
			<div class = 'resize-point right'></div>
			<div class = 'resize-point top'></div>
			<div class = 'resize-point bottom'></div>
			<div class = 'resize-point top left top-left'></div>
			<div class = 'resize-point top right top-right'></div>
			<div class = 'resize-point bottom left bottom-left'></div>
			<div class = 'resize-point bottom right bottom-right '></div>
			`;
	target.append(edges);
}
function addComponentControllers(target: HTMLElement): void {
	const control = document.createElement('div');
	control.classList.add('control');
	control.innerHTML = `<div class = 'holder'></div><div class = 'close'></div>`;
	target.append(control);
	target.querySelector('.close')?.addEventListener(
		'mousedown',
		(e) => {
			e.preventDefault();
			console.log('click', target);
			target.parentElement.remove();
		},
		true
	);
	target.querySelector('.holder')?.addEventListener(
		'focusin',
		(e) => {
			e.stopPropagation();
			e.preventDefault();
		},
		true
	);
}
function addWrapperToComponent(html: string): HTMLElement {
	const element = document.createElement('span');
	element.classList.add('component-wrapper')
	element.innerHTML = html;
	return element
}


export   {
	isSlot,
	isDropZone,
	findIndex,
	insertAtIndex,
	addPlaceholder,
	replacePlaceholder,
	removePlaceholder,
    addComponentControllers,
    addWrapperToComponent,
    addResizePoints
};
