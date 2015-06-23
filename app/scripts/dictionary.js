function isWhiteSpace(text) {
  return text.trim() === '';
}

function Dictionary(name, code, letterToWord) {
  this.name = name;
  this.code = code;
  this._letterToWord = letterToWord;
}

Dictionary.prototype.getWord = function(letter){

  var lowercased = letter.toLowerCase();
  return (lowercased in this._letterToWord) ? this._letterToWord[lowercased]
       : isWhiteSpace(lowercased) ? null
       : letter;
}

var dictionaryList = [
  new Dictionary('Italia', 'IT', {
    a: 'Ancona',
    b: 'Bologna',
    c: 'Catania',
    d: 'Domodossola',
    e: 'Empoli',
    f: 'Firenze',
    g: 'Genova',
    h: 'Hotel',
    i: 'Imola',
    j: 'Joker',
    k: 'Kappa',
    l: 'Livorno',
    m: 'Milano',
    n: 'Napoli',
    o: 'Otranto',
    p: 'Palermo',
    q: 'Quaderno',
    r: 'Roma',
    s: 'Savona',
    t: 'Torino',
    u: 'Udine',
    v: 'Venezia',
    w: 'Washington',
    x: 'Xilofono',
    y: 'Ipsilon',
    z: 'Zara',
    0: 'Zero',
    1: 'One',
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    8: 'Eight',
    9: 'Nine'
  }),
  new Dictionary('NATO', 'US', {
    a: 'Alfa',
    b: 'Bravo',
    c: 'Charlie',
    d: 'Delta',
    e: 'Echo',
    f: 'Foxtrot',
    g: 'Golf',
    h: 'Hotel',
    i: 'India',
    j: 'Juliet',
    k: 'Kilo',
    l: 'Lima',
    m: 'Mike',
    n: 'November',
    o: 'Oscar',
    p: 'Papa',
    q: 'Quebec',
    r: 'Romeo',
    s: 'Sierra',
    t: 'Tango',
    u: 'Uniform',
    v: 'Victor',
    w: 'Whiskey',
    x: 'X-ray',
    y: 'Yankee',
    z: 'Zulu',
    0: 'Zero',
    1: 'One',
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    8: 'Eight',
    9: 'Nine'
    }),
  new Dictionary('Navy', 'US', {
    a: 'Apples',
    b: 'Butter',
    c: 'Charlie',
    d: 'Duff',
    e: 'Edward',
    f: 'Freddy',
    g: 'George',
    h: 'Harry',
    i: 'Ink',
    j: 'Johnnie',
    k: 'King',
    l: 'London',
    m: 'Monkey',
    n: 'Nuts',
    o: 'Orange',
    p: 'Pudding',
    q: 'Queenie',
    r: 'Robert',
    s: 'Sugar',
    t: 'Tommy',
    u: 'Uncle',
    v: 'Vinegar',
    w: 'Willie',
    x: 'Xerxes',
    y: 'Yellow',
    z: 'Zebra',
    0: 'Zero',
    1: 'One',
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    8: 'Eight',
    9: 'Nine'
  })
];


