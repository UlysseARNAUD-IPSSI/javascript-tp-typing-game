import {getEntries} from "./_getEntries.js";

export function sortEntries() {
    let entries = getEntries();

    let sortedEntries = [];

    const entriesByNiveau = getEntriesByNiveau(entries);
    console.log({entriesByNiveau});
    /*const _niveaux = entriesByNiveau.keys();
    for (
        let cursor = 0, cursorMax = _niveaux.length;
        cursor < cursorMax;
        cursor++
    ) {
        const _niveau = _niveaux[cursor];
        const _entries = entriesByNiveau[_niveau];
        const entriesByScore = getEntriesByScore(_entries);
        console.log({entriesByScore});
    }*/
    for (let _niveau in entriesByNiveau) {
        const _entries = entriesByNiveau[_niveau];
        const entriesByScore = getEntriesByScore(_entries);

        let _sortedEntries = []

        for (let _score in entriesByScore) {
            const _entries = entriesByScore[_score];
            const __sortedEntries = _entries.sort((a,b) => parseInt(a.date) - parseInt(b.date));
            entriesByScore[_score] = __sortedEntries;
            _sortedEntries = [
                ..._sortedEntries,
                ...__sortedEntries
            ];
        }

        sortedEntries = [
            ...sortedEntries,
            ..._sortedEntries
        ];

        entriesByNiveau[_niveau] = entriesByScore;
    }

    sortedEntries = sortedEntries.reverse();

    return sortedEntries;
}

function getEntriesByNiveau(entries) {
    return getEntriesByProperty('niveau', entries);
}

function getEntriesByScore(entries) {
    return getEntriesByProperty('score', entries);
}

function getEntriesByProperty (property, entries) {
    let entriesByProperty = {};
    for (
        let cursor = 0, cursorMax = entries.length;
        cursor < cursorMax;
        cursor++
    ) {
        const entry = entries[cursor];
        if (false === entriesByProperty.hasOwnProperty(entry[property])) {
            entriesByProperty[entry[property]] = [];
        }
        entriesByProperty[entry[property]].push(entry);
    }
    return entriesByProperty;
}