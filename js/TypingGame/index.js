import {generateModalEndGame} from "../shared/_generateModalEndGame.js";

export class TypingGame {

    dynamicValues;
    dynamicValuesElement;
    secondsLimit;
    secondsLimitMin;
    score;
    niveau;

    words;
    word;

    constructor(
        {
            secondsLimit = 15,
            secondsLimitMin = 3,
            scoreEachLevel = 15
        } = {}
    ) {

        const score = 0;
        const niveau = 1;

        this.score = score;
        this.niveau = niveau;

        this.scoreEachLevel = scoreEachLevel;

        this.dynamicValues = {};
        this.dynamicValues['secondes-limite'] = secondsLimit;
        this.dynamicValues['secondes-restantes'] = secondsLimit + 1;
        this.dynamicValues['status'] = "Bonjour !";
        this.dynamicValues['score'] = score;
        this.dynamicValues['niveau'] = niveau;

        this.dynamicValuesElement = document.querySelectorAll('span[data-dynamic]');
        this.originalSecondsLimit = secondsLimit;
        this.secondsLimitMin = secondsLimitMin;
        this.secondsLimit = secondsLimit;

        this.words = [];
        this.initializeWords();

        this.updateDynamicValues();
    }

    updateDynamicValues() {
        const names = Object.keys(this.dynamicValues);
        const values = Object.values(this.dynamicValues);
        for (
            let cursor = 0, cursorMax = names.length;
            cursor < cursorMax;
            cursor++
        ) {
            const name = names[cursor];
            this.updateDynamicValue(name);
        }
    }

    updateDynamicValue(name) {
        const value = this.dynamicValues[name];
        const dynamicValueElements = document.querySelectorAll(`span[data-dynamic][data-name="${name}"]`)
        for (
            let cursorElement = 0, cursorMaxElement = dynamicValueElements.length;
            cursorElement < cursorMaxElement;
            cursorElement++
        ) {
            const element = dynamicValueElements[cursorElement];
            element.innerHTML = value;
        }
    }

    initializeWords() {
        let words = [];

        fetch('/assets/texts/sentences.txt').then(response => {
            return response.text();
        }).then(response => {
            response = response.replace(/,/ig, ' ');
            response = response.replace(/\./ig, ' ');
            response = response.replace(/\r/ig, ' ');
            response = response.replace(/\n/ig, ' ');

            return response.split(' ');
        }).then(_words => {
            for (
                let cursor = 0, cursorMax = _words.length;
                cursor < cursorMax;
                cursor++
            ) {
                let word = _words[cursor];

                word = word.replace(/,/, ' ');
                word = word.replace(/\./, ' ');

                if ('' === word) continue;

                const hasNumber = /[0-9]/ig.test(word);
                if (true === hasNumber) continue;

                const hasSingleQuote = /’/ig.test(word);
                if (true === hasSingleQuote) {
                    const indexOfSingleQuote = word.indexOf("’");
                    word = word.slice(indexOfSingleQuote + 1);
                }

                // On enlève les accents
                word = word.normalize("NFD").replace(/[\u0300-\u036f]/g, '');

                words.push(word.toLowerCase());
            }
        }).finally(() => {
            words = words.filter(function onlyUnique(value, index, self) {
                return self.indexOf(value) === index && 3 < value.length;
            });
            this.words = words;
            this.start();
        })
    }

    start() {
        this.setWord();
        this.startCountdown();
        this.enableInputForUser();
    }

    startCountdown() {
        this._countdownInterval();
    }

    _countdownInterval() {
        const secondsRemaining = this.dynamicValues['secondes-restantes'];

        if (0 === secondsRemaining) {
            this.end();
            return;
        }

        if (8 === secondsRemaining) {
            this.dynamicValues['status'] = 'Ne ralentissez surtout pas !';
            this.updateDynamicValue('status');
        }

        if (6 === secondsRemaining) {
            this.dynamicValues['status'] = 'Pas assez vite !';
            this.updateDynamicValue('status');
        }

        if (4 === secondsRemaining) {
            this.dynamicValues['status'] = 'On se rapproche de la fin !';
            this.updateDynamicValue('status');
        }

        if (2 === secondsRemaining) {
            this.dynamicValues['status'] = 'Dépêchez-vous !';
            this.updateDynamicValue('status');
        }

        this.dynamicValues['secondes-restantes'] = secondsRemaining - 1;
        this.updateDynamicValue('secondes-restantes');

        setTimeout(() => this._countdownInterval(), 1000);
    }

    setWord() {
        const randomPosition = Math.floor(Math.random() * this.words.length);
        const selectedWord = this.words[randomPosition];
        if (selectedWord === this.word) {
            this.setWord();
            return;
        }
        this.word = selectedWord;
        this.dynamicValues['mot-actuel'] = selectedWord;
        this.updateDynamicValue('mot-actuel');
    }

    end() {
        const section = document.querySelector('section[data-name="jouer"]');
        const input = section.querySelector('input[name="mot-utilisateur"]');
        setTimeout(function () {
            input.classList.add('disabled');
            input.disabled = true;
        }, 0);

        this.dynamicValues['secondes-restantes'] = 0;
        this.updateDynamicValue('secondes-restantes');

        this.dynamicValues['status'] = 'Game over !';
        this.updateDynamicValue('status');

        const niveau = this.niveau;
        const score = this.score;

        const modalEndGame = generateModalEndGame();
        modalEndGame.then(modal => {

            const modals = document.querySelectorAll('my-modal[data-name="end-game"]');
            for (
                let cursor = 0, cursorMax = modals.length;
                cursor < cursorMax;
                cursor++
            ) {
                modals[cursor].remove();
            }

            section.appendChild(modal);

            const scoreInput = modal.querySelector('input[name="score"][type="hidden"]');
            if (undefined !== scoreInput) {
                setTimeout(function () {
                    scoreInput.value = score;
                }, 0);
            }
            const niveauInput = modal.querySelector('input[name="niveau"][type="hidden"]');
            if (undefined !== niveauInput) {
                setTimeout(function () {
                    niveauInput.value = niveau;
                }, 0);
            }
        });
    }

    nextWord() {
        const score = this.dynamicValues.score;
        this.dynamicValues['score'] = score + 1;
        this.updateDynamicValue('score');

        const isLevelUp = 0 === score % this.scoreEachLevel && 1 < score;
        if (true === isLevelUp) {
            const niveau = this.dynamicValues.niveau;
            this.dynamicValues['niveau'] = niveau + 1;
            this.updateDynamicValue('niveau');

            const secondsLimit = Math.max(this.secondsLimitMin, Math.min(this.originalSecondsLimit, this.secondsLimit - 1));
            this.secondsLimit = secondsLimit;
            this.dynamicValues['secondes-restantes'] = secondsLimit;
            this.dynamicValues['secondes-limite'] = secondsLimit;
            this.updateDynamicValue('secondes-restantes');
            this.updateDynamicValue('secondes-limite');

            const messages = [
                'Niveau suivant !',
                'Level up !'
            ];
            const positionAleatoire = Math.floor(Math.random() * messages.length);
            const messageAleatoire = messages[positionAleatoire];

            this.dynamicValues['status'] = messageAleatoire;
            this.updateDynamicValue('status');
        }

        this.setWord();
        this.resetTimeRemaining();

        const section = document.querySelector('section[data-name="jouer"]');
        const input = section.querySelector('input[name="mot-utilisateur"]');
        input.value = '';

        if (true === isLevelUp) return;

        const messages = [
            'Bien !',
            'Continuer !',
            'La force est avec vous !',
            "C'est bien mais plus vite"
        ];
        const positionAleatoire = Math.floor(Math.random() * messages.length);
        const messageAleatoire = messages[positionAleatoire];

        this.dynamicValues['status'] = messageAleatoire;
        this.updateDynamicValue('status');
    }

    resetTimeRemaining() {
        const secondsLimit = this.secondsLimit;
        this.dynamicValues['secondes-restantes'] = secondsLimit;
        this.updateDynamicValue('secondes-restantes');
    }

    enableInputForUser() {
        const section = document.querySelector('section[data-name="jouer"]');
        const input = section.querySelector('input[name="mot-utilisateur"]');
        input.addEventListener('keypress', event => {
            const {target, key} = event;
            const {value, selectionStart} = target;
            const word = document.querySelector('span[data-name="mot-actuel"]').innerHTML;
            let currentValue = value.substring(0, selectionStart) + key + value.substring(selectionStart);
            if (word === currentValue) {
                this.nextWord();
                setTimeout(function () {
                    const position = target.selectionStart;
                    input.value = input.value.substring(0, position - 1) + input.value.substring(position + 1);
                }, 0);
            }
        });
    }

}