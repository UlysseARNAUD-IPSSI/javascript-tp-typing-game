export class MyModalFooterElement extends HTMLElement {
    connectedCallback() {
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }
}

if (!window.customElements.get('my-modal-footer')) {
    window.MyModalFooterElement = MyModalFooterElement
    window.customElements.define('my-modal-footer', MyModalFooterElement)
}