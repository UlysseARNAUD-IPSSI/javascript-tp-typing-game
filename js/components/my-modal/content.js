export class MyModalContentElement extends HTMLElement {
    connectedCallback() {
        // const modalContentResizeElement = document.createElement('my-modal-content-resize');
        // this.appendChild(modalContentResizeElement);
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }
}

if (!window.customElements.get('my-modal-content')) {
    window.MyModalContentElement = MyModalContentElement
    window.customElements.define('my-modal-content', MyModalContentElement)
}