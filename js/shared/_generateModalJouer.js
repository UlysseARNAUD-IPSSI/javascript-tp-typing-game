import {generateElement} from "./_generateElement.js";

export async function generateModalJouer() {
    const path = 'html/components/my-modal/modal-jouer.html';
    return await generateElement({path});
}