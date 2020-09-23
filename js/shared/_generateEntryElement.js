import {generateElement} from "./_generateElement.js";

export async function generateEntryElement() {
    const path = 'html/sections/leaderboard/entry.html';
    return await generateElement({path});
}