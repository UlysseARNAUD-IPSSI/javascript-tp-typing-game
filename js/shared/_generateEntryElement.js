export async function generateEntryElement() {
    const template = document.createElement('template');
    return await fetch('html/sections/leaderboard/entry.html')
        .then(response => {
            return response.text();
        }).then(response => {
            template.innerHTML = response;
            return template.content.firstChild;
        });
}