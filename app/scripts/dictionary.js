/* jshint devel:true */
/*jshint unused:false*/

'use strict';

function isWhiteSpace(text) {
  return text.trim() === '';
}

function Dictionary(name, code, lang, letterToWord) {
  this.name = name;
  this.code = code;
  this.lang = lang;
  this._letterToWord = letterToWord;
}

Dictionary.prototype.getWord = function(letter){

  var lowercased = letter.toLowerCase();
  return (lowercased in this._letterToWord) ? this._letterToWord[lowercased]
       : isWhiteSpace(lowercased) ? null
       : letter;
};

var dictionaryList = [
  new Dictionary('NATO', 'NATO', 'en-US', {
    'a': 'Alfa',
    'b': 'Bravo',
    'c': 'Charlie',
    'd': 'Delta',
    'e': 'Echo',
    'f': 'Foxtrot',
    'g': 'Golf',
    'h': 'Hotel',
    'i': 'India',
    'j': 'Juliet',
    'k': 'Kilo',
    'l': 'Lima',
    'm': 'Mike',
    'n': 'November',
    'o': 'Oscar',
    'p': 'Papa',
    'q': 'Quebec',
    'r': 'Romeo',
    's': 'Sierra',
    't': 'Tango',
    'u': 'Uniform',
    'v': 'Victor',
    'w': 'Whiskey',
    'x': 'X-ray',
    'y': 'Yankee',
    'z': 'Zulu',
    '0': 'Zero',
    '1': 'One',
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine',
    ' ': 'Space',
    '.': 'Dot / Period / Full Stop',
    ',': 'Comma',
    ';': 'Semicolon',
    ':': 'Colon',
    '?': 'Question Mark',
    '!': 'Exclamation Mark',
    '@': 'At Sign',
    '&': 'Ampersand',
    '\"': 'Double Quotation Mark',
    '\'': 'Apostrophe / Single Quotation Mark / Prime',
    '-': 'Dash / Minus Sign',
    '/': 'Forward Slash',
    '\\': 'Backslash',
    '(': 'Left Round Bracket / Parenthesis',
    ')': 'Right Round Bracket / Parenthesis',
    '[': 'Left Square Bracket',
    ']': 'Right Square Bracket',
    '{': 'Left Curly Bracket',
    '}': 'Right Curly Bracket',
    '<': 'Left Angle Bracket / Less-Than Sign',
    '>': 'Right Angle Bracket / Greater-Than Sign',
    '|': 'Vertical Bar / Pipe',
    '°': 'Degree Symbol',
    '*': 'Asterisk / Star',
    '+': 'Plus Sign',
    '=': 'Equal Sign',
    '#': 'Number Sign / Pound Sign / Hash',
    '§': 'Section Sign',
    '$': 'Dollar Sign',
    '€': 'Euro Sign',
    '~': 'Tilde',
    '_': 'Underscore',
    '%': 'Percent Sign',
    '^': 'Caret'
    }),
  new Dictionary('Italia', 'ITALIA', 'it-IT', {
    'a': 'Ancona',
    'b': 'Bologna',
    'c': 'Catania',
    'd': 'Domodossola',
    'e': 'Empoli',
    'f': 'Firenze',
    'g': 'Genova',
    'h': 'Hotel',
    'i': 'Imola',
    'j': 'Joker',
    'k': 'Kappa',
    'l': 'Livorno',
    'm': 'Milano',
    'n': 'Napoli',
    'o': 'Otranto',
    'p': 'Palermo',
    'q': 'Quaderno',
    'r': 'Roma',
    's': 'Savona',
    't': 'Torino',
    'u': 'Udine',
    'v': 'Venezia',
    'w': 'Washington',
    'x': 'Xilofono',
    'y': 'Ipsilon',
    'z': 'Zara',
    '0': 'Zero',
    '1': 'Uno',
    '2': 'Due',
    '3': 'Tre',
    '4': 'Quattro',
    '5': 'Cinque',
    '6': 'Sei',
    '7': 'Sette',
    '8': 'Otto',
    '9': 'Nove',
    ' ': 'Spazio',
    '!': 'Punto esclamativo',
    '?': 'Punto interrogativo',
    ':': 'Due punti',
    ';': 'Punto e virgola',
    ',': 'Virgola',
    '&': 'E commerciale',
    '|': 'Barretta verticale',
    '/': 'Barra',
    '\\': 'Barra retroversa',
    '*': 'Asterisco',
    '.': 'Punto',
    '#': 'Cancelletto',
    '@': 'Chiocciola',
    '\"': 'Virgolette',
    '\'': 'Apostrofo',
    '^': 'Cappelletto',
    '~': 'Tilde',
    '+': 'Piu',
    '-': 'Meno',
    '_': 'Sottolineato',
    '$': 'Dollaro',
    '%': 'Percento',
    '=': 'Uguale',
    '<': 'Minore',
    '>': 'Maggiore',
    '(': 'Parentesi tonda sinistra',
    ')': 'Parentesi tonda destra',
    '[': 'Parentesi quadra sinistra',
    ']': 'Parentesi quadra destra',
    '{': 'Parentesi graffe sinistra',
    '}': 'Parenetesi graffe destra',
    '°': 'Grado'
  }),
  new Dictionary('Navy', 'NAVY', 'en-US', {
    'a': 'Apples',
    'b': 'Butter',
    'c': 'Charlie',
    'd': 'Duff',
    'e': 'Edward',
    'f': 'Freddy',
    'g': 'George',
    'h': 'Harry',
    'i': 'Ink',
    'j': 'Johnnie',
    'k': 'King',
    'l': 'London',
    'm': 'Monkey',
    'n': 'Nuts',
    'o': 'Orange',
    'p': 'Pudding',
    'q': 'Queenie',
    'r': 'Robert',
    's': 'Sugar',
    't': 'Tommy',
    'u': 'Uncle',
    'v': 'Vinegar',
    'w': 'Willie',
    'x': 'Xerxes',
    'y': 'Yellow',
    'z': 'Zebra',
    '0': 'Zero',
    '1': 'One',
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine',
    ' ': 'Space',
    '.': 'Dot / Period / Full Stop',
    ',': 'Comma',
    ';': 'Semicolon',
    ':': 'Colon',
    '?': 'Question Mark',
    '!': 'Exclamation Mark',
    '@': 'At Sign',
    '&': 'Ampersand',
    '\"': 'Double Quotation Mark',
    '\'': 'Apostrophe / Single Quotation Mark / Prime',
    '-': 'Dash / Minus Sign',
    '/': 'Forward Slash',
    '\\': 'Backslash',
    '(': 'Left Round Bracket / Parenthesis',
    ')': 'Right Round Bracket / Parenthesis',
    '[': 'Left Square Bracket',
    ']': 'Right Square Bracket',
    '{': 'Left Curly Bracket',
    '}': 'Right Curly Bracket',
    '<': 'Left Angle Bracket / Less-Than Sign',
    '>': 'Right Angle Bracket / Greater-Than Sign',
    '|': 'Vertical Bar / Pipe',
    '°': 'Degree Symbol',
    '*': 'Asterisk / Star',
    '+': 'Plus Sign',
    '=': 'Equal Sign',
    '#': 'Number Sign / Pound Sign / Hash',
    '§': 'Section Sign',
    '$': 'Dollar Sign',
    '€': 'Euro Sign',
    '~': 'Tilde',
    '_': 'Underscore',
    '%': 'Percent Sign',
    '^': 'Caret'
  })
];

var dictionaryByCode = {};
_.each(dictionaryList, function(dictionary) {
  dictionaryByCode[dictionary.code] = dictionary;
});
