import {generateElement} from "./_generateElement.js";

export async function generateModalEndGame() {
    const path = 'html/components/my-modal/modal-end-game.html';
    return await generateElement({path});
}