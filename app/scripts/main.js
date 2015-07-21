/* jshint devel:true */
/* global EventEmitter2 */
/* global isWhiteSpace */
/* global dictionaryList */
/* global dictionaryByCode */

// Load voices
speechSynthesis.getVoices();

$(function() {
'use strict';

var __slice = [].slice;


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

  setText: function(newText) {
    this.text = newText;
    this.emitter.emit('change');
  },

  getText: function() {
    return this.text;
  },

  setDictionary: function(newDictionary) {
    this.dictionary = newDictionary;
    this.emitter.emit('change');
    this.stop();
  },

  getDictionary: function() {
    return this.dictionary;
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
    var self = this;

    this.uid++;
    var speakId = this.uid;

    this.stop();

    if (this.uid % 2 === 0) {
      // don't run the same string twice (chrome bug)
      text += ' ';
    }

    var utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.getVoices().forEach(function(voice) {
      if (self.dictionary.lang === voice.lang) {
        utterance.lang = voice.lang;
      }
    });

    utterance.rate = 0.8;
    utterance.pitch = 1;
    _.assign(utterance, options);

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
    if (!isWhiteSpace(letter)) {
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
      if (!isWhiteSpace(letter)) {
        var word = this.getWord(letter);
        words.push(word);
      }
    }

    var text = words.join(', ');
    this.speak(text, options);
  },

  getWord: function(letter) {
    return this.dictionary.getWord(letter);
  }
};

var $input = $('#input');
var $output = $('#spelling');
var $mainPlayer = $('#main-player');
var $dictionaryChooser = $('#dictionary-chooser');
var $dictionaryChooserBtn = $('#dictionary-chooser-btn');

var spellingTemplate = _.template($('#spelling-template').html());
var dropdownItemTemplate = _.template($('#dropdown-item-template').html());

var initialDictionaryCode = localStorage.getItem('dictionaryCode') || dictionaryList[0].code;
var initialInputText = localStorage.getItem('inputText') || '';

$input.val(initialInputText);

var speller = new Speller(dictionaryByCode[initialDictionaryCode], initialInputText);
speller.emitter.on('change', function() {
  localStorage.setItem('dictionaryCode', speller.getDictionary().code);
  localStorage.setItem('inputText', speller.getText());
  refreshSpelling();
});

$dictionaryChooserBtn.text(speller.getDictionary().name);
$mainPlayer.show();

_.each(dictionaryList, function(dictionary) {
  var dropdownItem = dropdownItemTemplate({label: dictionary.name, value: dictionary.code});
  $dictionaryChooser.append(dropdownItem);
});

$dictionaryChooser.on('click', 'a', function(e) {
  e.preventDefault();
  var $this = $(this);

  var code = $this.data('value');
  var dictionary = dictionaryByCode[code];
  $dictionaryChooserBtn.text(dictionary.name);

  speller.setDictionary(dictionary);
});

$input.on('keyup keydown', function() {
  var inputText = $input.val();
  speller.setText(inputText);
});
$input.trigger('keyup');

function refreshSpelling() {
  var letters = __slice.call(speller.getText());

  $output.html(_.map(letters, function(letter, index) {
    var word = speller.getWord(letter);
    if (word == null) {
      return '';
    } else {
      return spellingTemplate({
        index: index,
        letter: letter,
        word: word
      });
    }
  }).join('\n'));
}

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