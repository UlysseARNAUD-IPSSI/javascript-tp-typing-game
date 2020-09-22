export class MyModalHeaderElement extends HTMLElement {
    connectedCallback() {
        const {dataset} = this;
        const {title} = dataset;

        this.removeAttribute('data-title');

        const modalTitleElement = document.createElement('my-modal-title');
        modalTitleElement.dataset.title = title;

        const modalHeaderActionsElement = document.createElement('my-modal-header-actions');

        this.appendChild(modalTitleElement);
        this.appendChild(modalHeaderActionsElement);

        modalTitleElement.addEventListener('mousedown', event => {

            event.preventDefault();

            let {pageX, pageY} = event;

            const modal = this.closest('my-modal');
            const modalHeader = this.closest('my-modal-header');
            const modalHeaderTitle = this;

            moveModalAt(pageX,pageY);

            function onMouseMove(event) {
                event.preventDefault();

                pageX = event.pageX;
                pageY = event.pageY;

                moveModalAt(pageX,pageY);
            }
            this.onmousemove = onMouseMove;

            this.onmouseup = () => {
                console.log('hey');
                modalHeaderTitle.onmousemove = null;
                modalHeaderTitle.onmouseup = null;
            };

            function moveModalAt(pageX,pageY) {
                setTimeout(function() {
                    modal.style.left = pageX - modalHeader.offsetWidth/2 + 'px';
                    modal.style.top = pageY - modalHeader.offsetHeight/2  + 'px';
                }, 0);
            }

        });
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }
}

if (!window.customElements.get('my-modal-header')) {
    window.MyModalHeaderElement = MyModalHeaderElement
    window.customElements.define('my-modal-header', MyModalHeaderElement)
}