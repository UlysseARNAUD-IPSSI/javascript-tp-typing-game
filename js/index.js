import {TypingGame} from "./TypingGame/index.js";
import {MyModalElement} from "./components/my-modal/index.js";

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

    const section = document.querySelector(`section[data-name="${sectionName}"]`);
    introductionSection.classList.remove('show');

    setTimeout(function () {
        section.classList.add('show');
    }, 0);

    if ('jouer' === sectionName) {
        initializeTypingGame();
        return;
    }

    if ('leaderboard' === sectionName) {
        initializeLeaderboard();
    }
}

window.saveScoreFromModalEndGame = function(event) {
    const {target} = event;

    const modal = target.closest('my-modal');
    const form = modal.querySelector('form[data-name="save-score"]');
    const formData = new FormData(form);

    const pseudo = formData.get('pseudo');
    const score = formData.get('score');
    const niveau = formData.get('niveau');
    const date = new Date().getTime();

    if ('' === pseudo) {
        // TODO: creer une notif / alerte pour prevenir que le pseudo est invalide.
    }

    const entry = { pseudo, score, niveau, date };

    let entries = JSON.parse( localStorage.getItem('entries') );
    if (null === entries) {
        entries = [];
        localStorage.setItem('entries', JSON.stringify(entries));
    }

    entries.push(entry);

    localStorage.setItem('entries', JSON.stringify(entries));

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.classList.add('disabled');

    submitButton.innerHTML = "Enregistré !";

}

window.replayGameFromModalEndGame = function(event) {
    const {target} = event;

    const modal = target.closest('my-modal');

    modal.remove();
    initializeTypingGame();
}

window.quitGameFromModalEndGame = function(event) {
    const {target} = event;

    const modal = target.closest('my-modal');
    modal.remove();

    const jouerSection = document.querySelector('section[data-name="jouer"]');
    const introductionSection = document.querySelector('section[data-name="introduction"]');

    setTimeout(function() {
        jouerSection.classList.remove('show');
        introductionSection.classList.add('show');
    }, 0);
}

function initializeTypingGame() {
    const section = document.querySelector(`section[data-name="jouer"]`);

    const typingGame = new TypingGame;

    const inputMotUtilisateur = section.querySelector('input[name="mot-utilisateur"]');
    setTimeout(function() {
        inputMotUtilisateur.disabled = false;
        inputMotUtilisateur.classList.remove('disabled');
        inputMotUtilisateur.value = "";
    }, 0);

    const exitButton = section.querySelector('button[data-name="exit"]');
    exitButton.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();
        typingGame.end();
    }
}

function initializeLeaderboard() {
    const section = document.querySelector(`section[data-name="leaderboard"]`);
    const introductionSection = document.querySelector('section[data-name="introduction"]');

    const backButton = section.querySelector('button[data-name="back"]');
    backButton.onclick = function(event) {
        event.preventDefault();
        event.stopPropagation();

        setTimeout(function() {
            section.classList.remove('show');
            introductionSection.classList.add('show');
        }, 0);
    }
}