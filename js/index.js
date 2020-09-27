// import {TypingGame} from "./TypingGame/index.js";
import {MyModalElement} from "./components/my-modal/index.js";
import {generateEntryElement} from "./shared/_generateEntryElement.js";
import {sortEntries} from "./shared/_sortEntries.js";
import {getEntries} from "./shared/_getEntries.js";
import {displayModalJouer} from "./shared/_displayModalJouer.js";

document.addEventListener('DOMContentLoaded', event => {
    const introductionSection = document.querySelector('section[data-name="introduction"]');
    const links = introductionSection.querySelectorAll('.grid-buttons a');
    for (
        let cursor = 0, cursorMax = links.length;
        cursor < cursorMax;
        cursor++
    ) {
        const link = links[cursor];
        link.addEventListener('click', event => onClickLink(event));
    }
});

function onClickLink(event) {
    event.preventDefault();

    let {target} = event;
    const {nodeName} = target;
    if ('a' !== nodeName.toLowerCase()) target = target.closest('a');

    const {href} = target;

    const introductionSection = document.querySelector('section[data-name="introduction"]');
    const sectionName = href.substring(href.indexOf("#") + 1);

    if ('jouer' === sectionName) {
        displayModalJouer();
        return;
    }

    const section = document.querySelector(`section[data-name="${sectionName}"]`);
    introductionSection.classList.remove('show');

    console.log({section, sectionName});

    setTimeout(function () {
        section.classList.add('show');
    }, 0);

    if ('leaderboard' === sectionName) {
        initializeLeaderboard();
        return;
    }

    if ('statistiques' === sectionName) {
        initializeStatistiques();
        return;
    }
}

function initializeLeaderboard() {
    const section = document.querySelector(`section[data-name="leaderboard"]`);
    const introductionSection = document.querySelector('section[data-name="introduction"]');

    const backButton = section.querySelector('button[data-name="back"]');
    backButton.onclick = function (event) {
        event.preventDefault();
        event.stopPropagation();

        setTimeout(function () {
            section.classList.remove('show');
            introductionSection.classList.add('show');
        }, 0);
    }

    let entries = getEntries();

    console.log({entries});

    const entriesSorted = sortEntries();

    /*const sortEntries = entries.sort((a, b) => {
        if (a.score === b.score) return parseInt(a.date) - parseInt(b.date);
        return parseInt(b.score) - parseInt(a.score);
    });
    console.log({sortEntries});*/

    const table = section.querySelector('table tbody');
    table.innerHTML = '';

    for (
        let cursor = 0, cursorMax = Math.min(10, entries.length);
        cursor < cursorMax;
        cursor++
    ) {
        const entry = entriesSorted[cursor];
        const {pseudo, date, score, niveau} = entry;
        const entryElement = generateEntryElement();
        entryElement.then(element => {

            if (undefined === entry.difficulte) return;

            element.dataset.difficulte = entry.difficulte;

            element.classList.add('d-none');

            const cellPseudo = element.querySelector('td[data-name="pseudo"]');
            const cellDate = element.querySelector('td[data-name="date"]');
            const cellNiveau = element.querySelector('td[data-name="niveau"]');
            const cellScore = element.querySelector('td[data-name="score"]');

            cellPseudo.innerHTML = entry.pseudo;
            cellDate.innerHTML = entry.date;
            cellNiveau.innerHTML = entry.niveau;
            cellScore.innerHTML = entry.score;

            table.appendChild(element);
        });
    }

    const difficultesButtons = section.querySelectorAll('.btn-group[data-name="difficultes"] .btn');
    for (
        let cursor = 0, cursorMax = difficultesButtons.length;
        cursor < cursorMax;
        cursor++
    ) {
        const button = difficultesButtons[cursor];
        button.addEventListener('click', toggleDifficulte, true);
        if (1 === cursor) {
            button.click();
        }
    }
}

function updateShowEntries(difficulteValue) {
    const section = document.querySelector(`section[data-name="leaderboard"]`);
    // const difficulteRadio = section.querySelector('input[type=radio][name="difficulte"]:checked');
    // const difficulteValue = difficulteRadio.value;
    console.log({difficulteValue});

    const entriesElement = section.querySelectorAll('tbody tr');
    for (
        let cursor = 0, cursorMax = entriesElement.length;
        cursor < cursorMax;
        cursor++
    ) {
        const entry = entriesElement[cursor];
        const {difficulte} = entry.dataset;

        if (difficulteValue === difficulte) {
            setTimeout(function() {
                entry.classList.remove('d-none');
            }, 0);
            continue;
        }

        setTimeout(function() {
            entry.classList.add('d-none');
        }, 0);
    }
}

function toggleDifficulte(event) {

    let {target} = event;

    if ('button' === target.nodeName.toLowerCase()) {
        target = target.closest('.btn');
    }

    const targetValue = target.dataset.value;

    const section = document.querySelector(`section[data-name="leaderboard"]`);

    const difficultesButtons = section.querySelectorAll('.btn-group[data-name="difficultes"] .btn');
    for (
        let cursor = 0, cursorMax = difficultesButtons.length;
        cursor < cursorMax;
        cursor++
    ) {
        const button = difficultesButtons[cursor];
        const {value} = button.dataset;
        const radioAssociated = section.querySelector(`input[type="radio"][name="difficulte"][value="${value}"]`);

        if (button === target) {
            setTimeout(function () {
                button.classList.remove('btn-outline-primary');
                button.classList.add('btn-primary');
                radioAssociated.checked = true;
            }, 0);
            continue;
        }

        setTimeout(function () {
            button.classList.add('btn-outline-primary');
            button.classList.remove('btn-primary');
        }, 0);
    }

    updateShowEntries(targetValue);
}

function initializeStatistiques() {
    const section = document.querySelector(`section[data-name="statistiques"]`);
    const introductionSection = document.querySelector('section[data-name="introduction"]');

    const backButton = section.querySelector('button[data-name="back"]');
    backButton.onclick = function (event) {
        event.preventDefault();
        event.stopPropagation();

        setTimeout(function () {
            section.classList.remove('show');
            introductionSection.classList.add('show');
        }, 0);
    }

    let entries = getEntries();

}