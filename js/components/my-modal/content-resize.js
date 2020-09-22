export class MyModalContentResizeElement extends HTMLElement {
    connectedCallback() {
        const modalContentResize = this;

        this.addEventListener('mousedown', event => {

            event.preventDefault();

            let {pageX, pageY} = event;
            let {clientX, clientY} = event;

            let startX = event.clientX;
            let startY = event.clientY;

            const modal = modalContentResize.closest('my-modal');

            let startWidth = parseInt(document.defaultView.getComputedStyle(modal).width, 10);
            let startHeight = parseInt(document.defaultView.getComputedStyle(modal).height, 10);

            setModalSize(pageX,pageY);

            function onMouseMove(event) {
                event.preventDefault();

                pageX = event.pageX;
                pageY = event.pageY;

                clientX = event.clientX;
                clientY = event.clientY;

                setModalSize(pageX,pageY);
            }
            modalContentResize.onmousemove = onMouseMove;

            modalContentResize.onmouseup = () => {
                modalContentResize.onmousemove = null;
                modalContentResize.onmouseup = null;
            };

            function setModalSize(pageX,pageY) {
                setTimeout(function() {
                    modal.style.width = (startWidth + clientX - startX) + 'px';
                    modal.style.height = (startHeight + clientY - startY) + 'px';
                }, 0);
            }

        });
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
    }
}

if (!window.customElements.get('my-modal-content-resize')) {
    window.MyModalContentResizeElement = MyModalContentResizeElement
    window.customElements.define('my-modal-content-resize', MyModalContentResizeElement)
}