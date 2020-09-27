import {generateModalEndGame} from "../shared/_generateModalEndGame.js";

export class TypingGame {

    dynamicValues;
    dynamicValuesElement;
    secondsLimit;
    secondsLimitMin;
    score;
    niveau;
    difficulte;

    words;
    word;

    constructor(args) {

        // console.log('Appelle du constructeur !', this);

        args = {
            difficulte: 'moyen',
            secondsLimit: 15,
            secondsLimitMin: 3,
            scoreEachLevel: 8,
            ...args
        };

        const {difficulte, secondsLimit, secondsLimitMin, scoreEachLevel} = args;

        this.initializeDynamicValues();

        this.setScore(0);
        this.setNiveau(0);
        this.setDifficulte(difficulte);
        this.setScoreEachLevel(scoreEachLevel);

        this.setOriginalSecondsLimit(secondsLimit);
        this.setSecondsLimitMin(secondsLimitMin);
        this.setSecondsLimit(secondsLimit);

        // this.start();

    }

    start() {

        this.setStatus('Bonjour !');

        this.setSecondsLimit(this.originalSecondsLimit);
        this.setSecondesRestantes(this.secondsLimit);

        this.dynamicValuesElement = document.querySelectorAll('span[data-dynamic]');

        this.initializeWords();

        this.updateDynamicValues();

        setTimeout(function () {
            const inputMotUtilisateur = document.querySelector('input[name="mot-utilisateur"]');
            inputMotUtilisateur.classList.remove('disabled');
            inputMotUtilisateur.disabled = false;
        }, 0);

        localStorage.setItem('can-save', true);
    }

    setSecondsLimit(secondsLimit) {
        this.secondsLimit = secondsLimit;
        this.dynamicValues['secondes-limite'] = secondsLimit;
        this.updateDynamicValue('secondes-limite');
    }

    setScore(score) {
        this.score = score;
        this.dynamicValues['score'] = score;
        this.updateDynamicValue('score');
    }

    setScoreEachLevel(scoreEachLevel) {
        this.scoreEachLevel = scoreEachLevel;
        // this.dynamicValues['score-each-level'] = scoreEachLevel;
        // this.updateDynamicValue('score-each-level');
    }

    setOriginalSecondsLimit(originalSecondsLimit) {
        this.originalSecondsLimit = originalSecondsLimit;
        // this.dynamicValues['original-seconds-limit'] = originalSecondsLimit;
        // this.updateDynamicValue('original-seconds-limit');
    }

    setSecondsLimitMin(secondsLimitMin) {
        this.secondsLimitMin = secondsLimitMin;
        // this.dynamicValues['seconds-limit-min'] = secondsLimitMin;
        // this.updateDynamicValue('seconds-limit-min');
    }

    setNiveau(niveau) {
        this.niveau = niveau;
        this.dynamicValues['niveau'] = niveau;
        this.updateDynamicValue('niveau');
    }

    setDifficulte(difficulte) {
        this.difficulte = difficulte;
        /*this.dynamicValues['difficulte'] = difficulte;
        this.updateDynamicValue('difficulte');*/
    }

    setSecondesRestantes(secondesRestantes) {
        this.dynamicValues['secondes-restantes'] = secondesRestantes;
        this.updateDynamicValue('secondes-restantes');
    }

    setMotActuel(word) {
        this.word = word;
        this.dynamicValues['mot-actuel'] = word;
        this.updateDynamicValue('mot-actuel');
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

    setStatus(message) {
        this.dynamicValues['status'] = message;
        this.updateDynamicValue('status');
    }

    initializeDynamicValues() {
        this.dynamicValues = {};
    }

    initializeWords() {
        this.words = [];
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
            // TODO : this semble etre identique au premier this appellé !
            // Par conséquent, a chaque fois qu'on relance le jeu et qu'on ecrit un mot,
            // on retrouve la configuration d'origine !
            console.log('that', this);
            this._start();
        })
    }

    _start() {
        this.setWord();
        this.startCountdown();
        this.enableInputForUser();
    }

    startCountdown() {
        // On reset le compte a rebours (normalement)
        if (undefined !== this._interval) {
            clearInterval(this._interval);
            this._interval = undefined;
        }
        this._countdownInterval();
    }

    _countdownInterval() {
        const secondsRemaining = this.dynamicValues['secondes-restantes'];

        if (0 === secondsRemaining) {
            this.end();
            return;
        }

        switch (secondsRemaining) {
            case 8:
                this.setStatus('Ne ralentissez surtout pas !');
                break;
            case 6:
                this.setStatus('Pas assez vite !');
                break;
            case 4:
                this.setStatus('On se rapproche de la fin !');
                break;
            case 2:
                this.setStatus('Dépêchez-vous !');
                break;
        }

        this.setSecondesRestantes(secondsRemaining - 1);

        this._interval = setTimeout(() => this._countdownInterval(), 1000);
    }

    setWord() {
        const randomPosition = Math.floor(Math.random() * this.words.length);
        const selectedWord = this.words[randomPosition];
        if (selectedWord === this.word) {
            this.setWord();
            return;
        }
        this.setMotActuel(selectedWord);
    }

    end() {
        const section = document.querySelector('section[data-name="jouer"]');
        const input = section.querySelector('input[name="mot-utilisateur"]');
        setTimeout(function () {
            input.classList.add('disabled');
            input.disabled = true;
        }, 0);

        this.setSecondesRestantes(0);

        this.setStatus('Game over !');

        const niveau = this.niveau;
        const score = this.score;
        const difficulte = this.difficulte;

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
            const difficulteInput = modal.querySelector('input[name="difficulte"][type="hidden"]');
            if (undefined !== difficulteInput) {
                setTimeout(function () {
                    difficulteInput.value = difficulte;
                }, 0);
            }
        });
    }

    updateScore(score) {
        this.setScore(score + 1);
    }

    updateNiveau(niveau) {
        this.setNiveau(niveau + 1);
    }

    updateSecondsLimit(secondsLimit, secondsLimitMin) {
        this.setSecondsLimit(Math.max(secondsLimitMin, secondsLimit - 1));
    }

    nextWord() {
        this.updateScore(this.score);

        const isLevelUp = 0 === this.score % this.scoreEachLevel && 1 < this.score;
        if (true === isLevelUp) {

            this.updateNiveau(this.niveau);
            this.updateSecondsLimit(this.secondsLimit, this.secondsLimitMin);

            const messages = [
                'Niveau suivant !',
                'Level up !'
            ];
            this.setRandomMessageInStatus(messages);
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
        this.setRandomMessageInStatus(messages);
    }

    resetTimeRemaining({secondsLimit = this.secondsLimit} = {}) {
        this.startCountdown();
        this.setSecondsLimit(secondsLimit);
        this.setSecondesRestantes(secondsLimit);
    }

    resetTimeLimit({secondsLimit = this.originalSecondsLimit} = {}) {
        this.setSecondsLimit(secondsLimit);
        this.setSecondesRestantes(secondsLimit);
    }

    resetGame({} = {}) {
        this.start();
    }

    enableInputForUser() {
        const section = document.querySelector('section[data-name="jouer"]');
        const input = section.querySelector('input[name="mot-utilisateur"]');
        input.addEventListener('keydown', event => {
            const {target, key} = event;
            const {value, selectionStart} = target;

            const specialKeysAllowed = ['Backspace'];

            if (1 < key.length && false === specialKeysAllowed.includes(key)) return;

            let currentValue = value;
            if (1 === key.length) currentValue = value.substring(0, selectionStart) + key + value.substring(selectionStart);
            let currentValueWithoutAccent = currentValue.normalize("NFD").replace(/[\u0300-\u036f]/g, '');

            const word = document.querySelector('span[data-name="mot-actuel"]').innerHTML;

            if ('Backspace' === key) {
                const currentValueLength = currentValueWithoutAccent.length;
                currentValueWithoutAccent = currentValueWithoutAccent.substring(0, selectionStart);
                if (selectionStart !== currentValueLength - 1) {
                    currentValueWithoutAccent = currentValueWithoutAccent + currentValueWithoutAccent.substring(selectionStart);
                }
            }

            if (currentValueWithoutAccent !== currentValue) {
                setTimeout(function () {
                    currentValue = currentValueWithoutAccent.substring(0, selectionStart) + currentValueWithoutAccent.substring(selectionStart);
                    input.value = currentValue;
                }, 0);
            }
            let currentWordWithoutAccentInLowerCase = currentValueWithoutAccent.toLowerCase();
            if (currentValueWithoutAccent !== currentWordWithoutAccentInLowerCase) {
                setTimeout(function () {
                    input.value = currentWordWithoutAccentInLowerCase;
                }, 0)
            }
            if (word === currentWordWithoutAccentInLowerCase) {
                this.nextWord();
                // On définit le setTimeout 1 seconde plus tard au lieu de 0 puisqu'on n'a pas le comportement attendu
                // pour cette valeur.
                setTimeout(function () {
                    const position = target.selectionStart;
                    input.value = '';
                    input.value = input.value.substring(0, position - 1) + input.value.substring(position + 1);
                }, 1);
            }
        });
    }

    setRandomMessageInStatus(messages = []) {
        const positionAleatoire = Math.floor(Math.random() * messages.length);
        const messageAleatoire = messages[positionAleatoire];

        this.setStatus(messageAleatoire);
    }

}