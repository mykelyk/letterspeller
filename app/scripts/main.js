/* jshint devel:true */
/* global EventEmitter2 */

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
  this._state = this.STOPPED;
  this.emitter = new EventEmitter2();
}

Speller.prototype = {
  SPEAKING: 'speaking',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  uid: 0,

  _isWhiteSpace: function(text) {
    return text.trim() === '';
  },

  setState: function(newState) {
    console.log(this._state, '->', newState);
    var oldState = this._state;
    if (oldState === newState || newState === this.PAUSED && oldState === this.STOPPED) {
      return;
    }

    this._state = newState;
    if (newState === this.SPEAKING && oldState === this.STOPPED) {
      this.emitter.emit('play');
    }
    if (newState === this.SPEAKING && oldState === this.PAUSED) {
      this.emitter.emit('resume');
    }
    if (newState === this.STOPPED) {
      this.emitter.emit('stop');
    }
    if (newState === this.PAUSED) {
      this.emitter.emit('pause');
    }
  },

  getState: function() {
    return this._state;
  },

  speak: function(text, options) {
    this.uid++;
    var speakId = this.uid;

    this.stop();

    if (this.uid % 2 === 0) {
      // don't run the same string twice (chrome bug)
      text += ' ';
    }

    var utterance = new SpeechSynthesisUtterance(text);
    utterance.voiceURI = 'native';
    _.assign(utterance, options);

    var self = this;
    utterance.onend = function(e) {
      console.log('onend', e);
      if (speakId === self.uid) {
        self.setState(self.STOPPED);
      }
    };

    console.log('speak', text, options);
    this.setState(this.SPEAKING);
    speechSynthesis.speak(utterance);
  },

  resume: function() {
    this.setState(this.SPEAKING);
    speechSynthesis.resume();
  },

  pause: function() {
    this.setState(this.PAUSED);
    speechSynthesis.pause();
  },

  stop: function() {
    this.setState(this.STOPPED);
    speechSynthesis.cancel();
  },

  spellLetter: function(letter, options) {
    if (!this._isWhiteSpace(letter)) {
      var word = this.getWord(letter);
      this.speak(word, options);
    }
  },

  spellAt: function(index, length, options) {
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
  var $this = $(this);
  var index = $this.data('index');

  $this.removeClass('play');
  $this.addClass('stop');

  speller.stop();

  speller.emitter.once('stop', function() {
    $this.removeClass('stop');
    $this.addClass('play');
  });

  speller.spellAt(index);
});

$output.on('click', 'button.simple-player.stop', function(e) {
  e.preventDefault();
  var $this = $(this);

  $this.removeClass('stop');
  $this.addClass('play');

  speller.stop();
});


$mainPlayer.on('click', 'button.play', function(e) {
  e.preventDefault();
  var $this = $(this);

  $this.removeClass('play');
  $this.addClass('pause');


  if (speller.getState() !== speller.PAUSED) {
    speller.stop();
  }

  speller.emitter.once('stop', function() {
    $this.removeClass('pause');
    $this.addClass('play');
  });

  if (speller.getState() === speller.PAUSED) {
    speller.resume();
  } else {
    speller.spellAt();
  }
});

$mainPlayer.on('click', 'button.pause', function(e) {
  e.preventDefault();
  var $this = $(this);

  $this.removeClass('pause');
  $this.addClass('play');

  speller.pause();
});

$mainPlayer.on('click', 'button.stop', function(e) {
  e.preventDefault();
  speller.stop();
});

});