/* jshint devel:true */

$(function() {
'use strict';

var __slice = [].slice;

var dictionary = {
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
};

function Speller(dictionary, text) {
  this.dictionary = dictionary;
  this.text = text;
  this.state = this.STOPPED;
}

Speller.prototype = {
  SPEAKING: 'speaking',
  PAUSED: 'paused',
  STOPPED: 'stopped',

  _isWhiteSpace: function(text) {
    return text.trim() === '';
  },

  speak: function(text, options) {
    this.stop();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.voiceURI = 'native';
    _.assign(utterance, options);

    var onend = utterance.onend;
    var self = this;
    utterance.onend = function(e) {
      console.log('onend', e);
      self.state = this.STOPPED;

      if (onend) {
        return onend(e);
      }
    };

    console.log('speak', text, options);
    self.state = this.SPEAKING;
    speechSynthesis.speak(utterance);
  },

  resume: function() {
    this.state = this.SPEAKING;
    speechSynthesis.resume();
  },

  pause: function() {
    this.state = this.PAUSED;
    speechSynthesis.pause();
  },

  stop: function() {
    this.state = this.STOPPED;
    speechSynthesis.cancel();
  },

  spellLetter: function(letter, options) {
    if (!this._isWhiteSpace(letter)) {
      var word = this.getWord(letter);
      this.speak(word, options);
    }
  },

  spellAt: function(index, length, options) {
    console.log(index, length);
    if (index == null) {
      index = 0;
      if (length == null) {
        length = this.text.length;
      }
    } else if (length == null) {
      length = 1;
    }

    var words = [];
    for (var i = 0; i < length; i++) {
      var letter = this.text[index + i];
      if (!this._isWhiteSpace(letter)) {
        var word = this.getWord(letter);
        words.push(word);
      }
    }

    var text = words.join(', ');
    this.speak(text, options);
  },

  getWord: function(letter) {
    var lowercased = letter.toLowerCase();
    return (lowercased in this.dictionary) ? this.dictionary[lowercased]
         : this._isWhiteSpace(lowercased) ? null
         : letter;
  }
};

var $container = $('#container');
var $input = $('#input');
var $output = $('#output');
var $mainPlayer = $('#main-player');

var template = _.template($('#output-template').html());

var speller = new Speller(dictionary, '');

$input.on('keyup keydown', function() {
  speller = new Speller(dictionary, $input.val());
  var letters = __slice.call(speller.text);

  $output.html($.map(letters, function(letter, index) {
    var word = speller.getWord(letter);
    if (word == null) {
      return '';
    } else {
      return template({
        index: index,
        letter: letter,
        word: word
      });
    }
  }).join('\n'));
});
$input.trigger('keyup');

$output.on('click', 'button.simple-player.play', function(e) {
  e.preventDefault();
  speller.stop()

  var $this = $(this);
  var index = $this.data('index');

  speller.spellAt(index, null, {
    onend: function() {
      $this.removeClass('stop');
      $this.addClass('play');
    }
  });

  $this.removeClass('play');
  $this.addClass('stop');
});

$output.on('click', 'button.simple-player.stop', function(e) {
  e.preventDefault();
  speller.stop();
});


$mainPlayer.on('click', 'button.play', function(e) {
  e.preventDefault();

  var $this = $(this);
  $this.removeClass('play');
  $this.addClass('pause');

  if (speller.state === this.PAUSED) {
    speller.resume();
  } else {
    speller.spellAt(null, null, {
      onend: function() {
        $this.removeClass('pause');
        $this.addClass('play');
      }
    });
  }
});

$mainPlayer.on('click', 'button.pause', function(e) {
  e.preventDefault();

  var $this = $(this);
  $this.removeClass('pause');
  $this.addClass('play');

  speller.pause()
});

$mainPlayer.on('click', 'button.stop', function(e) {
  e.preventDefault();
  speller.stop();
});

});