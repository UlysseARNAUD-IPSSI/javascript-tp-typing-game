import './content.js';
import './content-resize.js';
import './footer.js';
import './header.js';
import './header-actions.js';
import './title.js';

export class MyModalElement extends HTMLElement {
    connectedCallback() {
        const {dataset} = this;
        const {title} = dataset;

        this.removeAttribute('data-title');

        const content = this.innerHTML;
        this.innerHTML = '';

        const modalHeaderElement = document.createElement('my-modal-header');
        modalHeaderElement.dataset.title = title;

        const modalContentlement = document.createElement('my-modal-content');
        modalContentlement.innerHTML = content;

        const modalFooterElement = document.createElement('my-modal-footer');

        this.appendChild(modalContentlement);
        this.insertBefore(modalHeaderElement, modalContentlement);
        this.appendChild(modalFooterElement);
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }

    show() {
        this.classList.remove('hide');
    }

    hide() {
        this.classList.add('hide');
    }

    minimize() {
        const modalHeaderActions = this.querySelector('my-modal-header-actions');
        const minimizeButton = modalHeaderActions.querySelector('button[data-action="minimize"]');
        minimizeButton.click();
    }

    maximize() {
        const modalHeaderActions = this.querySelector('my-modal-header-actions');
        const maximizeButton = modalHeaderActions.querySelector('button[data-action="maximize"]');
        maximizeButton.click();
    }

    close() {
        const modalHeaderActions = this.querySelector('my-modal-header-actions');
        const closeButton = modalHeaderActions.querySelector('button[data-action="close"]');
        closeButton.click();
    }
}

if (!window.customElements.get('my-modal')) {
    window.MyModalElement = MyModalElement;
    window.customElements.define('my-modal', MyModalElement);
}