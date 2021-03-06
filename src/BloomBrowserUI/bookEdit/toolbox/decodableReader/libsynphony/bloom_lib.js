/**
 * bloom_lib.js
 *
 * Extensions to the libSynphony class to support Bloom.
 *
 * Created Apr 14, 2014 by Phil Hopper
 *
 */

var wordCache;

/**
 * Grapheme data in LanguageData.GPCS
 * @param {String} optionalGrapheme Optional. The grapheme to initialize the class.
 * @returns {DataGPC}
 */
function DataGPC(optionalGrapheme) {

    var s = (typeof optionalGrapheme === "undefined") ? '' : optionalGrapheme;

    this.GPC = s;
    this.GPCuc = s.toUpperCase();
    this.Grapheme = s;
    this.Phoneme = s;
    this.Category = 'other';
    this.Combining = 'false';
    this.Frequency = 1;
    this.TokenFreq = 1;
    this.IPA = '';
    this.Alt = [];
}

/**
 * Word data in LanguageData.geoup1
 * @param {String} optionalWord Optional. The word to initialize the class.
 * @returns {DataWord}
 */
function DataWord(optionalWord) {

    var w = (typeof optionalWord === "undefined") ? '' : optionalWord;

    this.Name = w;
    this.Count = 1;
    this.Group = 1;
    this.PartOfSpeech = '';
    this.GPCForm = [];
    this.WordShape = '';
    this.Syllables = 1;
    this.Reverse = [];
    this.html = '';
    this.isSightWord = false;
}

/**
 * Class that holds text fragment information
 * @param {String} str The text of the fragment
 * @param {Boolean} isSpace <code>TRUE</code> if this fragment is inter-sentence space, otherwise <code>FALSE</code>.
 * @returns {textFragment}
 */
function textFragment(str, isSpace) {

    // constructor code
    this.text = str;
    this.isSentence = !isSpace;
    this.isSpace = isSpace;
    this.words = libsynphony.getWordsFromHtmlString(jQuery('<div>' + str.replace(/<br><\/br>|<br>|<br \/>|<br\/>/gi, '\n') + '</div>')
        .text()).filter(function(word) { return word != ""});

    this.wordCount = function() {
        return this.words.length;
    };
}

function WordCache() {

    this.desiredGPCs;
    this.knownGPCs;
    this.selectedWords;
}

/**
 * Takes an HTML string and returns an array of fragments containing sentences and inter-sentence spaces
 * @param {String} textHTML The HTML text to split
 * @returns {Array} An array of <code>textFragment</code> objects
 */
libSynphony.prototype.stringToSentences = function(textHTML) {

    // place holders
    var delimiter = String.fromCharCode(0);
    var htmlLineBreak = String.fromCharCode(1);    // html break tags count as white space
    var windowsLineBreak = String.fromCharCode(2); // CR and LF count as white space
    var nonSentence = String.fromCharCode(3);      // u0003 is used to indicate a segment that is not part of a sentence
    var tagHolderOpen = String.fromCharCode(4);    // u0004 is a replacement character for all other opening html tags
    var tagHolderClose = String.fromCharCode(5);   // u0005 is a replacement character for all other closing html tags
    var tagHolderSelf = String.fromCharCode(6);    // u0006 is a replacement character for all other self-closing html tags
    var tagHolderEmpty = String.fromCharCode(7);   // u0007 is a replacement character for empty html tags
    if (textHTML === null) textHTML = '';

    // look for html break tags, replace them with the htmlLineBreak place holder
    var regex = /(<br><\/br>|<br>|<br \/>|<br\/>)/g;
    textHTML = textHTML.replace(regex, htmlLineBreak);

    // look for Windows line breaks, replace them with the windowsLineBreak place holder
    regex = /(\r\n)/g;
    textHTML = textHTML.replace(regex, windowsLineBreak);

    // collect opening html tags and replace with tagHolderOpen place holder
    var openTags = textHTML.match(/<[^\/][^<>]+[^\/]>/g);
    textHTML = textHTML.replace(/<[^\/][^<>]+[^\/]>/g, tagHolderOpen);

    // collect closing html tags and replace with tagHolderClose place holder
    var closeTags = textHTML.match(/<[\/][^<>]+>/g);
    textHTML = textHTML.replace(/<[\/][^<>]+>/g, tagHolderClose);

    // collect self-closing html tags and replace with tagHolderSelf place holder
    var selfTags = textHTML.match(/<[^<>]+[\/]>/g);
    textHTML = textHTML.replace(/<[^<>]+[\/]>/g, tagHolderSelf);

    // collect empty html tags and replace with tagHolderEmpty place holder
    var emptyTags = textHTML.match(/\u0004\u0005/g);
    textHTML = textHTML.replace(/\u0004\u0005/g, tagHolderEmpty);

    // look for paragraph ending sequences
    regex = XRegExp(
        '[^\\p{PEP}]*[\\p{PEP}]+' // break on all paragraph ending punctuation (PEP)
        + '|[^\\p{PEP}]+$',
        'g');

    // break the text into paragraphs
    var paragraphs = XRegExp.match(textHTML, regex);

    // regex to find sentence ending sequences and inter-sentence space
    regex = XRegExp(
        '([\\p{SEP}]+'                      // sentence ending punctuation (SEP)
        + '[\'"\\p{Pf}\\p{Pe}\\u0005]*)'    // characters that can follow the SEP
        + '([\\u0004]*)'                    // opening tag between sentences
        + '([\\s\\p{PEP}\\u0006\\u0007]+)'  // inter-sentence space
        + '([\\u0005]*)'                    // closing tag between sentences
        + '(?![^\\p{L}]*'                   // may be followed by non-letter chars
        + '[\\p{Ll}\\p{SCP}]+)',            // first letter following is not lower case
        'g');

    var returnVal = new Array();
    for (var i = 0; i < paragraphs.length; i++) {

        // mark boundaries between sentences and inter-sentence space
        var paragraph = XRegExp.replace(paragraphs[i], regex, '$1' + delimiter + nonSentence + '$2' + '$3' + '$4' + delimiter);

        // restore line breaks
        paragraph = paragraph.replace(/\u0001/g, '<br />');
        paragraph = paragraph.replace(/\u0002/g, '\r\n');

        // split the paragraph into sentences and
        var fragments = paragraph.split(delimiter);
        for (var j = 0; j < fragments.length; j++) {

            var fragment = fragments[j];

            // put the opening html tags back in
            while (fragment.indexOf('\u0007') > - 1)
                fragment = fragment.replace(/\u0007/, emptyTags.shift());

            // put the opening html tags back in
            while (fragment.indexOf('\u0004') > - 1)
                fragment = fragment.replace(/\u0004/, openTags.shift());

            // put the closing html tags back in
            while (fragment.indexOf('\u0005') > - 1)
                fragment = fragment.replace(/\u0005/, closeTags.shift());

            // put the self-closing html tags back in
            while (fragment.indexOf('\u0006') > - 1)
                fragment = fragment.replace(/\u0006/, selfTags.shift());

            // check to avoid blank segments at the end
            if ((j < (fragments.length - 1)) || (fragment.length > 0)) {

                // is this space between sentences?
                if (fragment.substring(0, 1) === nonSentence)
                    returnVal.push(new textFragment(fragment.substring(1), true));
                else
                    returnVal.push(new textFragment(fragment, false));
            }
        }
    }

    return returnVal;
};

/**
 * Reads the file passed in the fileInputElement and calls the callback function when finished
 * @param {Element} fileInputElement
 * @param {Function} callback Function with one parameter, which will be TRUE if successful.
 */
libSynphony.prototype.loadLanguageData = function(fileInputElement, callback) {

    var file = fileInputElement.files[0];

    if (!file) return;

    var reader = new FileReader();
    reader.onload = function(e) {
        callback(libsynphony.langDataFromString(e.target.result));
    };
    reader.readAsText(file);
};

/**
 * Parses the langDataString into a lang_data object.
 * NOTE: Split into 2 functions, langDataFromString() and parseLangDataString(), for testing.
 * @param {String} langDataString
 * @returns {Boolean}
 */
libSynphony.prototype.langDataFromString = function(langDataString) {

    lang_data = this.parseLangDataString(langDataString);

    libsynphony.processVocabularyGroups();

    return true;
};

/**
 * Parses the langDataString into a lang_data object
 * @param {String} langDataString
 * @returns {LanguageData}
 */
libSynphony.prototype.parseLangDataString = function(langDataString) {

    // check for setLangData( ... )
    var pos = langDataString.indexOf('{');
    if (pos > 0)
        langDataString = langDataString.substring(pos);

    // should end with } (closing brace)
    pos = langDataString.lastIndexOf('}');
    if (pos < (langDataString.length - 1))
        langDataString = langDataString.substring(0, pos + 1);

    // fix errors and remove extra characters the JSON parser does not like
    langDataString = langDataString.replace('GPCS:', '"GPCS":');     // this name may not be inside double-quotes
    langDataString = langDataString.replace(/\/\/.*\r\n/g, '\r\n');  // remove comments from the file

    // load the data
    var langData = JSON.parse(langDataString);

    // add the functions from LanguageData
    return jQuery.extend(true, new LanguageData(), langData);
};

/**
 * Returns just the Name property (the actual word) of the selected DataWord objects.
 * @param {Array} aDesiredGPCs The list of graphemes targeted by this search
 * @param {Array} aKnownGPCs The list of graphemes known by the reader
 * @param {Boolean} restrictToKnownGPCs If <code>TRUE</code> then words will only contain graphemes in the <code>aKnownGPCs</code> list. If <code>FALSE</code> then words will contain at least one grapheme from the <code>aDesiredGPCs</code> list.
 * @param {Boolean} allowUpperCase
 * @param {Array} aSyllableLengths
 * @param {Array} aSelectedGroups
 * @param {Array} aPartsOfSpeech
 * @returns {Array} An array of strings
 */
libSynphony.prototype.selectGPCWordNamesWithArrayCompare = function(aDesiredGPCs, aKnownGPCs, restrictToKnownGPCs, allowUpperCase, aSyllableLengths, aSelectedGroups, aPartsOfSpeech) {
    var gpcs = libsynphony.selectGPCWordsWithArrayCompare(aDesiredGPCs, aKnownGPCs, restrictToKnownGPCs, allowUpperCase, aSyllableLengths, aSelectedGroups, aPartsOfSpeech);
    return _.pluck(gpcs, 'Name');
};

/**
 * Returns a list of words that meet the requested criteria.
 * @param {Array} aDesiredGPCs The list of graphemes targeted by this search
 * @param {Array} aKnownGPCs The list of graphemes known by the reader
 * @param {Boolean} restrictToKnownGPCs If <code>TRUE</code> then words will only contain graphemes in the <code>aKnownGPCs</code> list. If <code>FALSE</code> then words will contain at least one grapheme from the <code>aDesiredGPCs</code> list.
 * @param {Boolean} allowUpperCase
 * @param {Array} aSyllableLengths
 * @param {Array} aSelectedGroups
 * @param {Array} aPartsOfSpeech
 * @returns {Array} An array of WordObject objects
 */
libSynphony.prototype.selectGPCWordsFromCache = function(aDesiredGPCs, aKnownGPCs, restrictToKnownGPCs, allowUpperCase, aSyllableLengths, aSelectedGroups, aPartsOfSpeech) {

    // check if the list of graphemes changed
    if (!wordCache) {
        wordCache = new WordCache();
    }
    else {
        if ((wordCache.desiredGPCs.length !== aDesiredGPCs.length) ||
            (wordCache.knownGPCs.length !== aKnownGPCs.length) ||
            (_.intersection(wordCache.desiredGPCs, aDesiredGPCs).length !== aDesiredGPCs.length) ||
            (_.intersection(wordCache.knownGPCs, aKnownGPCs).length !== aKnownGPCs.length)) {
                wordCache = new WordCache();
        }
        else {

            // return the cached list
            return wordCache.selectedWords;
        }
    }

    wordCache.desiredGPCs = aDesiredGPCs;
    wordCache.knownGPCs = aKnownGPCs;
    wordCache.selectedWords = libsynphony.selectGPCWordsWithArrayCompare(aDesiredGPCs, aKnownGPCs, restrictToKnownGPCs, allowUpperCase, aSyllableLengths, aSelectedGroups, aPartsOfSpeech);

    return wordCache.selectedWords;
};

/**
 * Adds a new DataGPC object to Vocabulary Group
 * @param grapheme Either a single grapheme (string) or an array of graphemes
 */
LanguageData.prototype.addGrapheme = function(grapheme) {

    if (!Array.isArray(grapheme)) grapheme = [grapheme];

    for (var i = 0; i < grapheme.length; i++) {

        var g = grapheme[i].toLowerCase();

        // check if the grapheme already exists
        var exists = _.any(this.GPCS, function(item) {
            return item.GPC === g;
        });

        if (!exists)
            this.GPCS.push(new DataGPC(g));
    }
};

/**
 * Adds a new DataWord object to Vocabulary Group
 * @param word Either a single word (string) or an array of words
 * @param {int} [freq] The number of times this word occurs
 */
LanguageData.prototype.addWord = function(word, freq) {

    var sortedGraphemes = _.sortBy(_.pluck(this.GPCS, 'Grapheme'), 'length').reverse();

    // if this is a single word...
    if (!Array.isArray(word)) word = [word];

    for (var i = 0; i < word.length; i++) {

        var w = word[i].toLowerCase();

        // check if the word already exists
        var dw = this.findWord(w);
        if (!dw) {
            dw = new DataWord(w);
            dw.GPCForm = this.getGpcForm(w, sortedGraphemes);
            if (freq) dw.Count = freq;
            this.group1.push(dw);
        }
        else {
            if (freq)
                dw.Count += freq;
            else
                dw.Count += 1;
        }
    }
};

/**
 * Searches existing list for a word
 * @param {String} word
 * @returns {DataWord} Returns undefined if not found.
 */
LanguageData.prototype.findWord = function(word) {

    for (var i = 1; i <= this.VocabularyGroups; i++) {

        var found = _.find(this['group' + i], function(item) {
            return item.Name === word;
        });

        if (found) return found;
    }

    return null;
};

/**
 * Gets the GPCForm value of a word
 * @param {String} word
 * @param {Array} sortedGraphemes Array of all graphemes, sorted by descending length
 * @returns {Array}
 */
LanguageData.prototype.getGpcForm = function(word, sortedGraphemes) {

    var gpcForm = [];
    var hit = 1; // used to prevent infinite loop if word contains letters not in the list

    while (word.length > 0) {

        hit = 0;

        for (var i = 0; i < sortedGraphemes.length; i++) {

            var g = sortedGraphemes[i];

            if (word.substr(g.length * (-1)) === g) {
                gpcForm.unshift(g);
                word = word.substr(0, word.length - g.length);
                hit = 1;
                break;
            }
        }

        // If hit = 0, the last character still in the word is not in the list of graphemes.
        // We are adding it now  so the gpcForm returned will be as accurate as possible, and
        // will contain all the characters in the word.
        if (hit === 0) {
            var lastChar = word.substr(-1);
            var lastCharCode = lastChar.charCodeAt(0);
            // JS isn't very good at handling Unicode values beyond \xFFFF
            // We don't want to split up surrogate pairs which JS counts as two separate characters
            if (this.isPartOfSurrogatePair(lastCharCode)) {
                gpcForm.unshift(word.substr(-2));
                word = word.substr(0, word.length - 2);
            } else {
                gpcForm.unshift(lastChar);
                word = word.substr(0, word.length - 1);
            }
        }
    }

    return gpcForm;
};

LanguageData.prototype.isPartOfSurrogatePair = function(charCode) {
    return 0xD800 <= charCode && charCode <= 0xDFFF;
};

/**
 * Because of the way SynPhony attaches properties to the group array, the standard JSON.stringify() function
 * does not return a correct representation of the LanguageData object.
 * @param {String} langData
 * @returns {String}
 */
LanguageData.toJSON = function(langData) {

    // get the group arrays
    var n = langData["VocabularyGroups"];

    for (var a = 1; a < (n + 1); a++) {

        var group = langData['group' + a];
        var index = 'groupIndex' + a;
        langData[index] = {};

        // for each group, get the properties (contain '__')
        var keys = _.filter(_.keys(group), function(k) { return k.indexOf('__') > -1; });
        for (var i = 0; i < keys.length; i++) {
            langData[index][keys[i]] = group[keys[i]];
        }
    }

    return JSON.stringify(langData);
};

LanguageData.fromJSON = function(jsonString) {

    var langData = JSON.parse(jsonString);

    // convert the groupIndex objects back to properties of the group array
    var n = langData["VocabularyGroups"];

    for (var a = 1; a < (n + 1); a++) {

        var group = langData['group' + a];
        var index = 'groupIndex' + a;
        var keys = _.keys(langData[index]);

        for (var i = 0; i < keys.length; i++) {
            group[keys[i]] = langData[index][keys[i]];
            langData[index][keys[i]] = null;
        }
    }

    return jQuery.extend(true, new LanguageData(), langData);
};