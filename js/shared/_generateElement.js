export async function generateElement({path} = {}) {
    const template = document.createElement('template');
    return await fetch(path)
        .then(response => {
            return response.text();
        }).then(response => {
            template.innerHTML = response;
            return template.content.firstChild;
        });
}