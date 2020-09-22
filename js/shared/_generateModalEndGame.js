export async function generateModalEndGame() {
    const template = document.createElement('template');
    return await fetch('html/components/my-modal/modal-end-game.html')
        .then(response => {
            return response.text();
        }).then(response => {
            template.innerHTML = response;
            return template.content.firstChild;
        });
}