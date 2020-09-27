import {generateModalJouer} from "./_generateModalJouer.js";
import {TypingGame} from "../TypingGame/index.js";
import {getEntries} from "./_getEntries.js";

export function displayModalJouer() {
    const section = document.querySelector('section[data-name="introduction"]');

    const modalJouer = generateModalJouer();
    modalJouer.then(modal => {

        const modals = document.querySelectorAll('my-modal[data-name="jouer"]');
        for (
            let cursor = 0, cursorMax = modals.length;
            cursor < cursorMax;
            cursor++
        ) {
            modals[cursor].remove();
        }

        section.appendChild(modal);

        const difficultesButtons = modal.querySelectorAll('.btn-group[data-name="difficultes"] .btn');
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

        const jouerButton = modal.querySelector('.btn[data-name="jouer"]');
        jouerButton.addEventListener('click', function (event) {
            event.preventDefault();
            const form = document.forms.namedItem('jouer');
            const formData = new FormData(form);
            const entries = formData.entries();
            let values = {}
            let done = false;
            while (true) {
                const entry = entries.next();
                if (true === entry.done) break;
                const [name, value] = entry.value;
                values[name] = parseInt(value);
            }


            const introductionSection = document.querySelector('section[data-name="introduction"]');
            const jouerSection = document.querySelector('section[data-name="jouer"]');

            modal.close();

            setTimeout(function () {
                introductionSection.classList.remove('show');
                jouerSection.classList.add('show');
            }, 0);

            initializeTypingGame(values);
        }, true);

    }).catch(function (response) {
        console.error(response);
    });
}

function toggleDifficulte(event) {

    const DIFFICULTES = {
        facile: {
            secondsLimit: 30,
            secondsLimitMin: 7,
            scoreEachLevel: 8
        },
        moyen: {
            secondsLimit: 15,
            secondsLimitMin: 3,
            scoreEachLevel: 8
        },
        difficile: {
            secondsLimit: 8,
            secondsLimitMin: 2,
            scoreEachLevel: 8
        }
    }

    let {target} = event;

    if ('button' === target.nodeName.toLowerCase()) {
        target = target.closest('.btn');
    }

    const targetValue = target.dataset.value;

    const modal = document.querySelector('my-modal[data-name="jouer"]');
    const difficultesButtons = modal.querySelectorAll('.btn-group[data-name="difficultes"] .btn');
    for (
        let cursor = 0, cursorMax = difficultesButtons.length;
        cursor < cursorMax;
        cursor++
    ) {
        const button = difficultesButtons[cursor];
        const {value} = button.dataset;
        const radioAssociated = modal.querySelector(`input[type="radio"][name="difficulte"][value="${value}"]`);

        if (button === target) {
            setTimeout(function () {
                button.classList.remove('btn-outline-secondary');
                button.classList.add('btn-secondary');
                radioAssociated.checked = true;
            }, 0);
            continue;
        }

        setTimeout(function () {
            button.classList.add('btn-outline-secondary');
            button.classList.remove('btn-secondary');
        }, 0);

        const rowGameConfig = modal.querySelector('.row[data-name="game-config"]');

        if ('personnalise' === targetValue) {
            if (undefined === rowGameConfig) return;
            setTimeout(function () {
                rowGameConfig.classList.remove('d-none');
            }, 0);
            continue;
        }

        if (false === rowGameConfig.classList.contains('d-none')) {
            rowGameConfig.classList.add('d-none');
        }

        const difficulte = DIFFICULTES[targetValue];

        const secondsLimit = rowGameConfig.querySelector('input#seconds-limit');
        setTimeout(function () {
            secondsLimit.value = difficulte.secondsLimit;
        }, 0);

        const secondsLimitMin = rowGameConfig.querySelector('input#seconds-limit-min');
        setTimeout(function () {
            secondsLimitMin.value = difficulte.secondsLimitMin;
        }, 0);

        const scoreEachLevel = rowGameConfig.querySelector('input#score-each-level');
        setTimeout(function () {
            scoreEachLevel.value = difficulte.scoreEachLevel;
        }, 0);


    }
}

function initializeTypingGame(values) {
    const section = document.querySelector(`section[data-name="jouer"]`);

    window._game = new TypingGame(values);
    _game.start();

    const inputMotUtilisateur = section.querySelector('input[name="mot-utilisateur"]');
    setTimeout(function () {
        inputMotUtilisateur.disabled = false;
        inputMotUtilisateur.classList.remove('disabled');
        inputMotUtilisateur.value = "";
    }, 0);

    const exitButton = section.querySelector('button[data-name="exit"]');
    exitButton.onclick = function (event) {
        event.preventDefault();
        event.stopPropagation();
        _game.end();
    }
}

window.saveScoreFromModalEndGame = function (event) {
    const {target} = event;

    const modal = target.closest('my-modal');
    const form = modal.querySelector('form[data-name="save-score"]');
    const formData = new FormData(form);

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.classList.add('disabled');

    const canSave = localStorage.getItem('can-save');
    // console.log({canSave})
    if ("false" === canSave) {
        submitButton.innerHTML = "Déjà enregistré !";
        return;
    }
    localStorage.setItem('can-save', false);

    const pseudo = formData.get('pseudo');
    const score = formData.get('score');
    const niveau = formData.get('niveau');
    const date = new Date().getTime();

    if ('' === pseudo) {
        // TODO: creer une notif / alerte pour prevenir que le pseudo est invalide.
    }

    const entry = {pseudo, score, niveau, date};

    let entries = getEntries();

    entries.push(entry);

    localStorage.setItem('entries', JSON.stringify(entries));

    submitButton.innerHTML = "Enregistré !";
}

window.replayGameFromModalEndGame = function (event) {
    const {target} = event;

    const modal = target.closest('my-modal');

    modal.remove();

    const messages = [
        'Faite tout pour vous surpasser !',
        "C'est reparti !"
    ];
    _game.setRandomMessageInStatus(messages);
    _game.start();
}

window.quitGameFromModalEndGame = function (event) {
    const {target} = event;

    const modal = target.closest('my-modal');
    modal.remove();

    const jouerSection = document.querySelector('section[data-name="jouer"]');
    const introductionSection = document.querySelector('section[data-name="introduction"]');

    setTimeout(function () {
        jouerSection.classList.remove('show');
        introductionSection.classList.add('show');
    }, 0);

    // TODO : Donner la possibilité de relancer le jeu sans recharger la page.
    window.location.reload(true);
}