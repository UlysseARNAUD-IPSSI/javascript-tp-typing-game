export class MyModalTitleElement extends HTMLElement {
    connectedCallback() {
        const {dataset} = this;
        const {title} = dataset;

        this.removeAttribute('data-title');

        this.innerHTML = title;
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }
}

if (!window.customElements.get('my-modal-title')) {
    window.MyModalTitleElement = MyModalTitleElement
    window.customElements.define('my-modal-title', MyModalTitleElement)
}