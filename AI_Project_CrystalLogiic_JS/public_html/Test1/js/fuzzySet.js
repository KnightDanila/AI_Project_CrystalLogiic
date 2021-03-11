/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var AI = function () {

    var FuzzySet = function () {
    };

    /*
     * struct Ling {
     *      name
     *      level
     *      
     *      // TermN=3
     *      terms[level][TermN][]       
     *      
     *      
     * }
     */
    addLing("name",/*array of term names*/[], /*array*/[]);
    var Ling3Terms = function (name, low, mid, high) {
        this._name = name;
        this._low;
        this._mid;
        this._high;
    };
};

var START = 0;
var FINISH = 0;

var questionN = 0;

var questions = [
    'Are you a woman? (Y/N)',
    'What is your height? (cm)',
    'How old are you? (years)',
    'What is your weight? (kg)'
];

var answersEnum = ['gender', 'height', 'years', 'weight'];
var answers = {
    gender: 0,
    height: 0,
    years: 0,
    weight: 0
};

var fuzzAnswers = [
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
];

var fuzzCharacterLooks = {
    shallow: 0,
    impressive: 0,
    incredible: 0
};

var defuzzCharacter = 0;

var IAm;

var terms = {
    height: {
        /*
         short: [0, 170],
         middle: [160, 180],
         tall: [170, 1000]
         */
        short: [Characters.getMinHeight(), Characters.getAvgHeight()],
        middle: [(Characters.getMinHeight() + Characters.getAvgHeight()) / 2, (Characters.getAvgHeight() + Characters.getMaxHeight()) / 2],
        tall: [Characters.getAvgHeight(), Characters.getMaxHeight()]
    },
    years: {
        /*
         young: [0, 35],
         middle: [20, 50],
         old: [35, 1000]
         */
        young: [Characters.getMinYears(), Characters.getAvgYears()],
        middle: [(Characters.getMinYears() + Characters.getAvgYears()) / 2, (Characters.getAvgYears() + Characters.getMaxYears()) / 2],
        old: [Characters.getAvgYears(), Characters.getMaxYears()]
    },
    weight: {
        /*
         low: [0, 70],
         middle: [60, 80],
         big: [70, 1000]
         */
        low: [Characters.getMinWeight(), Characters.getAvgWeight()],
        //middle: [(Characters.getMinWeight() + Characters.getAvgWeight()) / 2, (Characters.getAvgWeight() + Characters.getMaxWeight()) / 2],
        middle: [(Characters.getMinWeight() + Characters.getAvgWeight()) / 2, Characters.getMinWeight() + Characters.getAvgWeight()],
        big: [Characters.getAvgWeight(), Characters.getMaxWeight()]
    },
    immortal: {
        //???
    },
    characterLooks: {
        shallow: [0, 50],
        impressive: [25, 75],
        incredible: [50, 100]
    }
};
// TEST POINT
log.add(
        "TEST POINT " + log.getLineNumberAndInfo() + " <br>" + "\n" +
        "terms.height.short: " + terms.height.short[0] + ", " + terms.height.short[1] + "<br>" + "\n" +
        "terms.height.middle: " + terms.height.middle[0] + ", " + terms.height.middle[1] + "<br>" + "\n" +
        "terms.height.tall: " + terms.height.tall[0] + ", " + terms.height.tall[1] + "<br>" + "\n" +
        "terms.weight.low: " + terms.weight.low[0] + ", " + terms.weight.low[1] + "<br>" + "\n" +
        "terms.weight.middle: " + terms.weight.middle[0] + ", " + terms.weight.middle[1] + "<br>" + "\n" +
        "terms.weight.big: " + terms.weight.big[0] + ", " + terms.weight.big[1] + "<br>" + "\n" +
        "terms.years.young: " + terms.years.young[0] + ", " + terms.years.young[1] + "<br>" + "\n" +
        "terms.years.middle: " + terms.years.middle[0] + ", " + terms.years.middle[1] + "<br>" + "\n" +
        "terms.years.old: " + terms.years.old[0] + ", " + terms.years.old[1] + "<br>" + "\n"
        );


var rules = {
    /*
     * 50 character -> 50 rules
     * А это плохо
     * Следовательно нужно сделать функцию, которая
     * будет гененировать правила, а вернее 
     * принадлежнось персонажа к "мелким и слабым", "внушительным" и "невероятным"
     * Из роста ^ возраста ^ веса  -> "мелким и слабым" v "внушительным" v "грозным"
     * Скорее всего найдется несколько персонажей в БД 
     * у которых принадлежности к классам будут совпадать
     * Следовательно, для лучшей работы программы нужно больше 
     * термов, а значит вопросов :)
     * 3^3 = 27 - скорее всего максимум 27 
     * кластеров персонажей можно найти
     * 'What is your height? (cm)',
     * 'How old are you? (years)',
     * 'What is your weight? (kg)'
     * По идее я должен сделать 27 привил, но я не хочу :)
     */
    /*
     * Этот вариант работает только для моего случая
     */

    calculate: function (fuzzAnswers) {
        var fuzzCharacterLooks = {};

        fuzzCharacterLooks.shallow = (fuzzAnswers[0] /*short*/ + fuzzAnswers[3] /*young*/ + fuzzAnswers[6] /*low weight*/) / 3;
        fuzzCharacterLooks.impressive = (fuzzAnswers[1] /*middle*/ + fuzzAnswers[4] /*middle*/ + fuzzAnswers[7] /*middle weight*/) / 3;
        fuzzCharacterLooks.incredible = (fuzzAnswers[2] /*tall*/ + fuzzAnswers[5] /*old*/ + fuzzAnswers[8] /*big weight*/) / 3;

        if (FINISH === 0) {
            log.add("Your character looks Shallow: " + fuzzCharacterLooks.shallow);
            log.add("Your character looks Impressive: " + fuzzCharacterLooks.impressive);
            log.add("Your character looks Incredible: " + fuzzCharacterLooks.incredible);
        }
        return fuzzCharacterLooks;
    },
    /*
     * Для публикации таки пришлось сделать эти 27 правил, 
     * так как я не смог вывести общую формулу для примера сверху :D
     111
     Если Рост = н, Вес = н, Возраст = м, то Уровень_I
     112
     Если Рост = с, Вес = н, Возраст = м, то Уровень_I
     Если Рост = н, Вес = с, Возраст = м, то Уровень_I
     Если Рост = н, Вес = н, Возраст = с, то Уровень_I
     113
     Если Рост = в, Вес = н, Возраст = м, то Уровень_I
     Если Рост = н, Вес = в, Возраст = м, то Уровень_I
     Если Рост = н, Вес = н, Возраст = в, то Уровень_I
     
     222
     Если Рост = с, Вес = с, Возраст = с, то Уровень_II
     122
     Если Рост = н, Вес = с, Возраст = с, то Уровень_II
     Если Рост = с, Вес = н, Возраст = с, то Уровень_II
     Если Рост = с, Вес = с, Возраст = м, то Уровень_II
     123
     Если Рост = в, Вес = н, Возраст = с, то Уровень_II
     Если Рост = в, Вес = с, Возраст = м, то Уровень_II
     Если Рост = н, Вес = в, Возраст = с, то Уровень_II
     Если Рост = с, Вес = в, Возраст = м, то Уровень_II
     Если Рост = н, Вес = с, Возраст = в, то Уровень_II
     Если Рост = с, Вес = н, Возраст = в, то Уровень_II
     133
     Если Рост = н, Вес = в, Возраст = в, то Уровень_II
     Если Рост = в, Вес = н, Возраст = в, то Уровень_II
     Если Рост = в, Вес = в, Возраст = м, то Уровень_II
     223
     Если Рост = в, Вес = с, Возраст = с, то Уровень_II
     Если Рост = с, Вес = в, Возраст = с, то Уровень_II
     Если Рост = с, Вес = с, Возраст = в, то Уровень_II
     
     333
     Если Рост = в, Вес = в, Возраст = в, то Уровень_III
     233
     Если Рост = с, Вес = в, Возраст = в, то Уровень_III
     Если Рост = в, Вес = с, Возраст = в, то Уровень_III
     Если Рост = в, Вес = в, Возраст = с, то Уровень_III
     
     
     */
    calculateNew: function (fuzzAnswers) {
        var fuzzCharacterLooks = {};


        fuzzCharacterLooks.shallow = Math.max(
                // 111
                // Если Рост = н, Вес = н, Возраст = м, то Уровень_I
                Math.min(fuzzAnswers[0] /*short*/, fuzzAnswers[3] /*young*/, fuzzAnswers[6] /*low weight*/),
                // 112
                // Если Рост = с, Вес = н, Возраст = м, то Уровень_I
                // Если Рост = н, Вес = с, Возраст = м, то Уровень_I
                // Если Рост = н, Вес = н, Возраст = с, то Уровень_I
                Math.min(fuzzAnswers[0 + 1] /*short*/, fuzzAnswers[3] /*young*/, fuzzAnswers[6] /*low weight*/),
                Math.min(fuzzAnswers[0] /*short*/, fuzzAnswers[3 + 1] /*young*/, fuzzAnswers[6] /*low weight*/),
                Math.min(fuzzAnswers[0] /*short*/, fuzzAnswers[3] /*young*/, fuzzAnswers[6 + 1] /*low weight*/),
                // 113
                // Если Рост = в, Вес = н, Возраст = м, то Уровень_I
                // Если Рост = н, Вес = в, Возраст = м, то Уровень_I
                // Если Рост = н, Вес = н, Возраст = в, то Уровень_I
                Math.min(fuzzAnswers[0 + 2] /*short*/, fuzzAnswers[3] /*young*/, fuzzAnswers[6] /*low weight*/),
                Math.min(fuzzAnswers[0] /*short*/, fuzzAnswers[3 + 2] /*young*/, fuzzAnswers[6] /*low weight*/),
                Math.min(fuzzAnswers[0] /*short*/, fuzzAnswers[3] /*young*/, fuzzAnswers[6 + 2] /*low weight*/)
                );

        fuzzCharacterLooks.impressive = Math.max(
                // 222
                // Если Рост = с, Вес = с, Возраст = с, то Уровень_II
                Math.min(fuzzAnswers[1] /*middle*/, fuzzAnswers[4] /*middle*/, fuzzAnswers[7] /*middle weight*/),
                // 122
                // Если Рост = н, Вес = с, Возраст = с, то Уровень_II
                // Если Рост = с, Вес = н, Возраст = с, то Уровень_II
                // Если Рост = с, Вес = с, Возраст = м, то Уровень_II
                Math.min(fuzzAnswers[0] /*short*/, fuzzAnswers[3 + 1] /*young*/, fuzzAnswers[6 + 1] /*low weight*/),
                Math.min(fuzzAnswers[0 + 1] /*short*/, fuzzAnswers[3] /*young*/, fuzzAnswers[6 + 1] /*low weight*/),
                Math.min(fuzzAnswers[0 + 1] /*short*/, fuzzAnswers[3 + 1] /*young*/, fuzzAnswers[6] /*low weight*/),
                // 123
                // Если Рост = в, Вес = н, Возраст = с, то Уровень_II
                // Если Рост = в, Вес = с, Возраст = м, то Уровень_II
                // Если Рост = н, Вес = в, Возраст = с, то Уровень_II
                // Если Рост = с, Вес = в, Возраст = м, то Уровень_II
                // Если Рост = н, Вес = с, Возраст = в, то Уровень_II
                // Если Рост = с, Вес = н, Возраст = в, то Уровень_II
                Math.min(fuzzAnswers[1 + 1] /*middle*/, fuzzAnswers[4 - 1] /*middle*/, fuzzAnswers[7] /*middle weight*/),
                Math.min(fuzzAnswers[1 + 1] /*middle*/, fuzzAnswers[4] /*middle*/, fuzzAnswers[7 - 1] /*middle weight*/),
                Math.min(fuzzAnswers[1 - 1] /*middle*/, fuzzAnswers[4 + 1] /*middle*/, fuzzAnswers[7] /*middle weight*/),
                Math.min(fuzzAnswers[1] /*middle*/, fuzzAnswers[4 + 1] /*middle*/, fuzzAnswers[7 - 1] /*middle weight*/),
                Math.min(fuzzAnswers[1 - 1] /*middle*/, fuzzAnswers[4] /*middle*/, fuzzAnswers[7 + 1] /*middle weight*/),
                Math.min(fuzzAnswers[1] /*middle*/, fuzzAnswers[4 - 1] /*middle*/, fuzzAnswers[7 + 1] /*middle weight*/),
                // 133
                // Если Рост = н, Вес = в, Возраст = в, то Уровень_II
                // Если Рост = в, Вес = н, Возраст = в, то Уровень_II
                // Если Рост = в, Вес = в, Возраст = м, то Уровень_II
                Math.min(fuzzAnswers[1 - 1] /*middle*/, fuzzAnswers[4 + 1] /*middle*/, fuzzAnswers[7 + 1] /*middle weight*/),
                Math.min(fuzzAnswers[1 + 1] /*middle*/, fuzzAnswers[4 - 1] /*middle*/, fuzzAnswers[7 + 1] /*middle weight*/),
                Math.min(fuzzAnswers[1 + 1] /*middle*/, fuzzAnswers[4 + 1] /*middle*/, fuzzAnswers[7 - 1] /*middle weight*/),
                // 223
                // Если Рост = в, Вес = с, Возраст = с, то Уровень_II
                // Если Рост = с, Вес = в, Возраст = с, то Уровень_II
                // Если Рост = с, Вес = с, Возраст = в, то Уровень_II
                Math.min(fuzzAnswers[1 + 1] /*middle*/, fuzzAnswers[4] /*middle*/, fuzzAnswers[7] /*middle weight*/),
                Math.min(fuzzAnswers[1] /*middle*/, fuzzAnswers[4 + 1] /*middle*/, fuzzAnswers[7] /*middle weight*/),
                Math.min(fuzzAnswers[1] /*middle*/, fuzzAnswers[4] /*middle*/, fuzzAnswers[7 + 1] /*middle weight*/)
                );

        fuzzCharacterLooks.incredible = Math.max(
                // 333
                // Если Рост = в, Вес = в, Возраст = в, то Уровень_III
                Math.min(fuzzAnswers[2] /*tall*/, fuzzAnswers[5] /*old*/, fuzzAnswers[8] /*big weight*/),
                // 233
                // Если Рост = с, Вес = в, Возраст = в, то Уровень_III
                // Если Рост = в, Вес = с, Возраст = в, то Уровень_III
                // Если Рост = в, Вес = в, Возраст = с, то Уровень_III
                Math.min(fuzzAnswers[2 - 1] /*tall*/, fuzzAnswers[5] /*old*/, fuzzAnswers[8] /*big weight*/),
                Math.min(fuzzAnswers[2] /*tall*/, fuzzAnswers[5 - 1] /*old*/, fuzzAnswers[8] /*big weight*/),
                Math.min(fuzzAnswers[2] /*tall*/, fuzzAnswers[5] /*old*/, fuzzAnswers[8 - 1] /*big weight*/)
                );

        if (FINISH === 0) {
            log.add("Your character looks Shallow: " + fuzzCharacterLooks.shallow);
            log.add("Your character looks Impressive: " + fuzzCharacterLooks.impressive);
            log.add("Your character looks Incredible: " + fuzzCharacterLooks.incredible);
        }
        return fuzzCharacterLooks;
    }
};

function fuzzySetStart() {
    log.add("Answers: " + answers.gender + ", " + answers.height + ", " + answers.years + ", " + answers.weight);
    fuzzAnswers = fuzzification(answers);
    fuzzCharacterLooks = rules.calculate(fuzzAnswers);
    defuzzCharacter = defuzzification(fuzzCharacterLooks);
    log.add(defuzzCharacter);
    IAm = WhoIAm(defuzzCharacter);
    log.add(IAm.name);
    defuzzificationChart();
}

function fuzzification(answers) {
    var fuzzAnswers = [];

    if (FINISH === 0) {
        log.add(
                "height-short: " + (fuzzAnswers[0] = leftFunc(answers.height, terms.height.middle[0], terms.height.short[1])) + ", " +
                "height-middle: " + (fuzzAnswers[1] = middleFunc(answers.height, terms.height.middle[0], terms.height.tall[0], terms.height.middle[1])) + ", " +
                "height-tall: " + (fuzzAnswers[2] = rightFunc(answers.height, terms.height.tall[0], terms.height.middle[1]))
                );
        log.add(
                "years-young: " + (fuzzAnswers[3] = leftFunc(answers.years, terms.years.middle[0], terms.years.young[1])) + ", " +
                "years-middle: " + (fuzzAnswers[4] = middleFunc(answers.years, terms.years.middle[0], terms.years.old[0], terms.years.middle[1])) + ", " +
                "years-old: " + (fuzzAnswers[5] = rightFunc(answers.years, terms.years.old[0], terms.years.middle[1]))
                );
        log.add(
                "weight-low: " + (fuzzAnswers[6] = leftFunc(answers.weight, terms.weight.middle[0], terms.weight.low[1])) + ", " +
                "weight-middle: " + (fuzzAnswers[7] = middleFunc(answers.weight, terms.weight.middle[0], terms.weight.big[0], terms.weight.middle[1])) + ", " +
                "weight-big: " + (fuzzAnswers[8] = rightFunc(answers.weight, terms.weight.big[0], terms.weight.middle[1]))
                );
    } else {
        fuzzAnswers[0] = leftFunc(answers.height, terms.height.middle[0], terms.height.short[1]);
        fuzzAnswers[1] = middleFunc(answers.height, terms.height.middle[0], terms.height.tall[0], terms.height.middle[1]);
        fuzzAnswers[2] = rightFunc(answers.height, terms.height.tall[0], terms.height.middle[1]);

        fuzzAnswers[3] = leftFunc(answers.years, terms.years.middle[0], terms.years.young[1]);
        fuzzAnswers[4] = middleFunc(answers.years, terms.years.middle[0], terms.years.old[0], terms.years.middle[1]);
        fuzzAnswers[5] = rightFunc(answers.years, terms.years.old[0], terms.years.middle[1]);

        fuzzAnswers[6] = leftFunc(answers.weight, terms.weight.middle[0], terms.weight.low[1]);
        fuzzAnswers[7] = middleFunc(answers.weight, terms.weight.middle[0], terms.weight.big[0], terms.weight.middle[1]);
        fuzzAnswers[8] = rightFunc(answers.weight, terms.weight.big[0], terms.weight.middle[1]);
    }
    return fuzzAnswers;
}

function defuzzification(fuzzCharacterLooks) {
    // COGS - Center of Gravity for Singletons
    var defuzzCharacter = (
            fuzzCharacterLooks.shallow * terms.characterLooks.impressive[0] +
            fuzzCharacterLooks.impressive * ((terms.characterLooks.shallow[1] + terms.characterLooks.incredible[0]) / 2) +
            fuzzCharacterLooks.incredible * terms.characterLooks.impressive[1]
            ) /
            (fuzzCharacterLooks.shallow + fuzzCharacterLooks.impressive + fuzzCharacterLooks.incredible);
    //(terms.characterLooks.impressive[0] + ((terms.characterLooks.shallow[1] + terms.characterLooks.incredible[0]) / 2) + terms.characterLooks.impressive[1]);
    return defuzzCharacter;
}

function AllCharactersOnFuzzySet() {
    FINISH = 1;
    var charactersOnFuzzySet = [];
    var fuzzCharactersLooks;
    for (var i = 0; i < characters.length; i++) {
        /*
         *      fuzzAnswers = fuzzification(answers);
         *      fuzzCharacterLooks = rules.calculate(fuzzAnswers);
         *      defuzzCharacter = defuzzification(fuzzCharacterLooks);
         */
        charactersOnFuzzySet[i] = defuzzification(fuzzCharactersLooks = rules.calculate(fuzzification(characters[i])));
        // TEST POINT
        log.add(
                "characters[ " + i + "] " + characters[i].name + "->" +
                "looks Shallow: " + fuzzCharactersLooks.shallow + " " +
                "looks Impressive: " + fuzzCharactersLooks.impressive + " " +
                "looks Incredible: " + fuzzCharactersLooks.incredible + " " +
                "<br>" + "\n" +
                "charactersOnFuzzySet[" + i + "] " + charactersOnFuzzySet[i] + "<br>" + "\n"
                );
    }
    FINISH = 0;
    return charactersOnFuzzySet;
}

function WhoIAm(defuzzCharacter) {
    charactersOnFuzzySet = AllCharactersOnFuzzySet();
    var n = 0;
    var min = 200;                  // Our scale is 100. Thats why 200 enaught
    for (var i = 0; i < characters.length; i++) {
        // Проверка пола :) Но можно и убрать :)
        if (answers.gender === characters[i].gender) {
            if (min > Math.abs((defuzzCharacter - charactersOnFuzzySet[i]))) {
                min = Math.abs(defuzzCharacter - charactersOnFuzzySet[i]);
                n = i;
            }
        }
    }
    return characters[n];
}

chartQuality = 1;
function defuzzificationChart() {
    /*
     * ____________________________ L
     */
    // L type - leftFunc - Left Original Function - which we have in rules
    leftCharacterLooksOriginX = [];
    leftCharacterLooksOriginY = [];
    for (var j = 0, i = terms.characterLooks.shallow[0]; i <= terms.characterLooks.shallow[1]; i += chartQuality, j++) {
        leftCharacterLooksOriginX[j] = i;
        leftCharacterLooksOriginY[j] = leftFunc(leftCharacterLooksOriginX[j], terms.characterLooks.impressive[0], terms.characterLooks.shallow[1]);
    }
    // L type - leftFunc - Left Defuzzy Function - which we get in defuzzification
    leftCharacterLooksDefuzzyX = [];
    leftCharacterLooksDefuzzyY = [];
    for (var j = 0, i = terms.characterLooks.shallow[0]; i <= terms.characterLooks.shallow[1]; i += chartQuality, j++) {
        leftCharacterLooksDefuzzyX[j] = i;
        leftCharacterLooksDefuzzyY[j] = Math.min(leftCharacterLooksOriginY[j], fuzzCharacterLooks.shallow);
    }

    /*
     * Write other middle and right functions :)
     */

    /*
     *  ____________________________ T
     */
    // T type - middleFunc - Middle Original Function - which we have in rules
    middleCharacterLooksOriginX = [];
    middleCharacterLooksOriginY = [];
    for (var j = 0, i = terms.characterLooks.impressive[0]; i <= terms.characterLooks.impressive[1]; i += chartQuality, j++) {
        middleCharacterLooksOriginX[j] = i;
        middleCharacterLooksOriginY[j] = middleFunc(middleCharacterLooksOriginX[j], terms.characterLooks.impressive[0], terms.characterLooks.shallow[1], terms.characterLooks.impressive[1]);
    }
    // T type - middleFunc - Middle Defuzzy Function - which we get in defuzzification
    middleCharacterLooksDefuzzyX = [];
    middleCharacterLooksDefuzzyY = [];
    for (var j = 0, i = terms.characterLooks.impressive[0]; i <= terms.characterLooks.impressive[1]; i += chartQuality, j++) {
        middleCharacterLooksDefuzzyX[j] = i;
        middleCharacterLooksDefuzzyY[j] = Math.min(middleCharacterLooksOriginY[j], fuzzCharacterLooks.impressive);
    }

    /*
     *  ____________________________ Gamma
     */
    // Gamma type - rightFunc - Right Original Function - which we have in rules
    rightCharacterLooksOriginX = [];
    rightCharacterLooksOriginY = [];
    for (var j = 0, i = terms.characterLooks.incredible[0]; i <= terms.characterLooks.incredible[1]; i += chartQuality, j++) {
        rightCharacterLooksOriginX[j] = i;
        rightCharacterLooksOriginY[j] = rightFunc(rightCharacterLooksOriginX[j], terms.characterLooks.incredible[0], terms.characterLooks.impressive[1]);
    }
    // Gamma type - rightFunc - Right Defuzzy Function - which we get in defuzzification
    rightCharacterLooksDefuzzyX = [];
    rightCharacterLooksDefuzzyY = [];
    for (var j = 0, i = terms.characterLooks.incredible[0]; i <= terms.characterLooks.incredible[1]; i += chartQuality, j++) {
        rightCharacterLooksDefuzzyX[j] = i;
        rightCharacterLooksDefuzzyY[j] = Math.min(rightCharacterLooksOriginY[j], fuzzCharacterLooks.incredible);
    }

    drawChartClear();
    drawChart(leftCharacterLooksOriginX, leftCharacterLooksOriginY, 1, 0.5, "Left-Original");
    drawChart(leftCharacterLooksDefuzzyX, leftCharacterLooksDefuzzyY, 1, 1, "Left-Defuzzy");
    drawChart(middleCharacterLooksOriginX, middleCharacterLooksOriginY, 1, 0.5, "Middle-Original");
    drawChart(middleCharacterLooksDefuzzyX, middleCharacterLooksDefuzzyY, 1, 1, "Middle-Defuzzy");
    drawChart(rightCharacterLooksOriginX, rightCharacterLooksOriginY, 1, 0.5, "Right-Original");
    drawChart(rightCharacterLooksDefuzzyX, rightCharacterLooksDefuzzyY, 1, 1, "Right-Defuzzy");
}

/* L type*/
function leftFunc(x, a, b) {
    if (x <= a) {
        return 1;
    }
    if (a <= x && x <= b) {
        return (b - x) / (b - a);
    }
    if (x >= b) {
        return 0;
    }
}

/* T type*/
function middleFunc(x, a, b, c) {
    if (x <= a) {
        return 0;
    }
    if (a <= x && x <= b) {
        return (x - a) / (b - a);
    }
    if (b <= x && x <= c) {
        return (c - x) / (c - b);
    }
    if (x >= c) {
        return 0;
    }
}

/* Gamma type*/
function rightFunc(x, a, b) {
    if (x <= a) {
        return 0;
    }
    if (a <= x && x <= b) {
        return (x - a) / (b - a);
    }
    if (x >= b) {
        return 1;
    }
}