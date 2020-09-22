export class MyModalHeaderActionsElement extends HTMLElement {
    connectedCallback() {
        const closeButton = document.createElement('button');
        closeButton.role = 'button';
        closeButton.dataset.action ='close';

        const minimizeButton = document.createElement('button');
        minimizeButton.role = 'button';
        minimizeButton.dataset.action ='minimize';

        const maximizeButton = document.createElement('button');
        maximizeButton.role = 'button';
        maximizeButton.dataset.action ='maximize';
        maximizeButton.classList.add('hide');

        const modal = this.closest('my-modal');
        const modalContent = modal.querySelector('my-modal-content');

        closeButton.onclick = event => {
            event.preventDefault();
            event.stopPropagation();

            modal.remove();
        };

        minimizeButton.onclick = event => {
            event.preventDefault();
            event.stopPropagation();

            minimizeButton.classList.add('hide');
            maximizeButton.classList.remove('hide');

            modalContent.classList.add('hide');
        };

        maximizeButton.onclick = event => {
            event.preventDefault();
            event.stopPropagation();

            maximizeButton.classList.add('hide');
            minimizeButton.classList.remove('hide');

            modalContent.classList.remove('hide');
        };

        this.appendChild(minimizeButton);
        this.appendChild(maximizeButton);
        this.appendChild(closeButton);
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }
}

if (!window.customElements.get('my-modal-header-actions')) {
    window.MyModalHeaderActionsElement = MyModalHeaderActionsElement
    window.customElements.define('my-modal-header-actions', MyModalHeaderActionsElement)
}