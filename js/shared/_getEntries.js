export function getEntries() {
    let entries = localStorage.getItem('entries');
    console.log({entries});
    if(null === entries || "" === entries) {
        localStorage.setItem('entries', "[]");
        return [];
    }
    entries = JSON.parse(entries);
    return entries;
}