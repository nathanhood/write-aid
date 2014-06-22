/* jshint unused:false */

'use strict';

function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){//defaulting to html
  $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
}

(function(){

  $(document).ready(init);

  function init(){
    $('.resizable').resizable({
      aspectRatio: true
    });
    $('.draggable').draggable();
    $('#board').on('mousedown', '.resizable', resize);
    $('#board').on('mousedown', '.draggable', drag);
    $('#board').on('mousedown', '.draggable', zCounter);
    $('#board').on('click', '.sticky-note-title, .sticky-note-text', editNoteTitle);
    $('#board').on('blur', '.sticky-note-title-edit, .sticky-note-text-edit', saveNoteTitle);
    $('.sticky-note-title-edit, .sticky-note-text-edit').keypress(enterSaveNoteTitle);
    $('#search-word').click(getDefinition);
    $('#search-word').click(getRelatedWords);
    $('#search-word').click(getWordExample);
    $('#search-rhymes').click(getRhymes);
    /* Random Poetry */
    $('#find-random-poetry').click(getRandomNouns);
    $('#find-random-poetry').click(getRandomVerbs);
    $('#find-random-poetry').click(getRandomAdjectives);
    $('#find-random-poetry').click(getRandomAdverbs);
    $('#find-random-poetry').click(getRandomAuxiliaries);
    $('#find-random-poetry').click(getRandomPrepositions);
    /* Dynamically Generating Notes */
    $('.bt-menu-trigger').click(menuZIndex);
    $('#notes').click(appendNoteContainer);
    $('#bt-menu').on('click', '.yellow', addYellowNote);
    $('#bt-menu').on('click', '.blue', addBlueNote);
    $('#bt-menu').on('click', '.green', addGreenNote);
    $('#board').on('click', '.sticky-note-delete', removeNote);
    $('#bt-menu').on('click', '.bt-overlay', removeNoteContainer);

    /* Dynamically Generating Images */
    $('#images').click(appendImageContainer);
    $('#bt-menu').on('click', '#choose-upload-image', chooseFile);
    $('#board').on('click', '.image-delete', removeImage);
    $('#bt-menu').on('click', '.bt-overlay', removeImageContainer);

    /* Dynamically Generating Audio */
    $('#audio').click(appendAudioContainer);
    $('#bt-menu').on('click', '#choose-upload-audio', chooseFile);
    $('#bt-menu').on('click', '.bt-overlay', removeAudioContainer);
    $('#board').on('click', '.audio-delete', removeAudio);

    /* Dynamically Generating Words */
    /* Random Poetry */
    $('#random-poetry').click(getRandomNouns);
    $('#random-poetry').click(getRandomVerbs);
    $('#random-poetry').click(getRandomAdjectives);
    $('#random-poetry').click(getRandomAdverbs);
    $('#random-poetry').click(getRandomAuxiliaries);
    $('#random-poetry').click(getRandomPrepositions);
    $('#random-poetry').click(getRandomPronouns);
    $('#random-poetry').click(getArticles);
    $('#random-poetry').click(hideMenu);
    $('#board').on('click', '.word-delete', removeWord);
    $('#random-poetry').click(toggleContainer);
  }

  function menuZIndex(){
    $('.bt-menu').css('z-index', counter);
  }

  function chooseFile(event){
    $('#bt-menu').removeClass('bt-menu-close');
    $('#bt-menu').addClass('bt-menu-open');
    event.stopPropagation();
  }

  /* ================= DRAFT =============== */
  



  /* ================= RANDOM POETRY ============= */

  /* Random Poetry API calls - wordnik */

  function toggleContainer(){
    $('#random-words').slideToggle('slow');
  }

  function removeWord(){
    $(this).parent('.word').remove();
  }

  function hideMenu(){
    $('#bt-menu').removeClass('bt-menu-open');
    $('#bt-menu').addClass('bt-menu-close');
  }

  function getArticles(){
    for(var i = 0; i < 2; i++){
      let div = $('<div class="word article draggable">').text('the');
      div = $(div).append('<div class="word-delete">');
      $('#prepositions-container').append(div);
    }
    for(var j = 0; j < 2; j++){
      let div = $('<div class="word article draggable">').text('an');
      div = $(div).append('<div class="word-delete">');
      $('#auxiliaries-container').append(div);
    }
    for(var y = 0; y < 2; y++){
      let div = $('<div class="word article draggable">').text('a');
      div = $(div).append('<div class="word-delete">');
      $('#adverbs-container').append(div);
    }

  }

  function getRandomNouns(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=noun&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=14&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word noun draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#nouns-container').append(div);
      });
    });
  }

  function getRandomVerbs(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=verb&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word verb draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#verbs-container').append(div);
      });
    });
  }

  function getRandomAdjectives(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=adjective&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=5&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word adjective draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#adjectives-container').append(div);
      });
    });
  }

  function getRandomAdverbs(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=adverb&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word adverb draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#adverbs-container').append(div);
      });
    });
  }

  function getRandomPronouns(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=pronoun&minCorpusCount=10000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=4&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word pronoun draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#pronouns-container').append(div);
      });
    });
  }

  function getRandomAuxiliaries(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=auxiliary-verb&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word auxiliary draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#auxiliaries-container').append(div);
      });
    });
  }

  function getRandomPrepositions(){
    var url = `http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=false&includePartOfSpeech=preposition&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=16&limit=2&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      data.forEach(obj=>{
        var div = $('<div class="word preposition draggable">').text(obj.word);
        div = $(div).append('<div class="word-delete">');
        $('#prepositions-container').append(div);
      });
    });
  }



/* ================== AUDIO ================= */

  function appendAudioContainer(){
    var boardId = $('#board').attr('data-id');
    ajax(`/boards/${boardId}/audioContainer`, 'POST', null, html=>{
      $('.bt-overlay').append(html);
      $('#audio-container').slideToggle('slow');
    });
  }

  function removeAudioContainer(){
    $('#audio-container').remove();
  }

  function removeAudio(){
    var filePath = $(this).next('audio').attr('src');
    console.log(filePath);
    ajax(`/boards/removeDirFile`, 'POST', 'filePath='+filePath, ()=>{
      $(this).parents('.audio-container').remove();
    });
  }


/* =============== IMAGES ==================== */

  function removeImage(){
    var filePath = $(this).next('img').attr('src');
    console.log(filePath);
    ajax(`/boards/removeDirFile`, 'POST', 'filePath='+filePath, ()=>{
      $(this).parents('.image-container').remove();
    });
  }

  // <form>
  // <h3>Add Image URL</h3>
  // <input class='form-control', type='text'>
  // <button class='action-button', id='url-image', style='margin-top: 10px;'>Add Online Image</button>
  // </form>

  function appendImageContainer(){
    var boardId = $('#board').attr('data-id');
    ajax(`/boards/${boardId}/imageContainer`, 'POST', null, html=>{
      $('.bt-overlay').append(html);
      $('#image-container').slideToggle('slow');
    });
  }

  function removeImageContainer(){
    $('#image-container').remove();
  }




  /* ============== STICKY NOTES =============== */

  function removeNote(){
    $(this).parents('.sticky-note').remove();
  }

  function removeNoteContainer(){
    $('#note-container').remove();
  }

  function addGreenNote(event){
    $('#note-container').remove();
    var note = `<div class='sticky-note green draggable', style='top: 70px; left: 160px;'>
                <div class='sticky-note-inner'>
                <div class='sticky-note-delete'></div>
                <h2 class='sticky-note-title'>Click Here</h2>
                <textarea class='hidden sticky-note-title-edit', resize=none, maxlength='40'></textarea>
                </div>
                </div>`;
    $('#board').append(note);
    $('.draggable').draggable();
    event.preventDefault();
  }

  function addBlueNote(event){
    $('#note-container').remove();
    var note = `<div class='sticky-note blue draggable', style='top: 70px; left: 160px;'>
                <div class='sticky-note-inner'>
                <div class='sticky-note-delete'></div>
                <h2 class='sticky-note-title'>Click Here</h2>
                <textarea class='hidden sticky-note-title-edit', resize=none, maxlength='40'></textarea>
                </div>
                </div>`;
    $('#board').append(note);
    $('.draggable').draggable();
    event.preventDefault();
  }

  function addYellowNote(event){
    $('#note-container').remove();
    var note = `<div class='sticky-note yellow draggable', style='top: 70px; left: 160px;'>
                <div class='sticky-note-inner'>
                <div class='sticky-note-delete'></div>
                <h2 class='sticky-note-title'>Click Here</h2>
                <textarea class='hidden sticky-note-title-edit', resize=none, maxlength='40'></textarea>
                </div>
                </div>`;
    $('#board').append(note);
    $('.draggable').draggable();
    event.preventDefault();
  }

  function appendNoteContainer(){
    var container = `<div id='note-container'>
                      <div class='inner-container'>
                      <a href='#'><div class='sticky-note yellow'></div></a>
                      <a href='#'><div class='sticky-note blue'></div></a>
                      <a href='#'><div class='sticky-note green'></div></a>
                      </div>
                      </div>`;
    $('.bt-overlay').append(container);
    $('#note-container').slideToggle('slow');
  }




  /* Refresh draggable/resizable methods every mousedown - Dynamically created elements work now */

  function drag(){
    $('.draggable').draggable();
  }

  function resize(){
    $('.resizable').resizable({
      aspectRatio: true
    });
  }

  /* Sticky Note Functionality Below */

  var counter = 0;
  function zCounter(){
    counter++;
    $(this).css('z-index', counter);
  }

  function editNoteTitle(){
    $(this).addClass('hidden');
    $(this).next('textarea').removeClass('hidden');
    $(this).next('textarea').val($(this).text()).focus();
    var background = $(this).parent().css('background-color');
    $(this).next('textarea').css('background-color', background);
  }

  function saveNoteTitle(){
    $(this).addClass('hidden');
    $(this).prev().removeClass('hidden');
    $(this).prev().text($(this).val());
  }

  function enterSaveNoteTitle(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode === 13){
      $(this).addClass('hidden');
      $(this).prev().removeClass('hidden');
      $(this).prev().text($(this).val());
    }
  }


  /* Wordnik API Below */

  function getDefinition(){
    var word = $('#word').val().trim().toLowerCase();
    var url = `http://api.wordnik.com:80/v4/word.json/${word}/definitions?limit=10&includeRelated=false&sourceDictionaries=ahd&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      console.log(data);
    });
  }

  function getRelatedWords(){
    var word = $('#word').val().trim().toLowerCase();
    var url = `http://api.wordnik.com:80/v4/word.json/${word}/relatedWords?useCanonical=false&limitPerRelationshipType=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      console.log(data);
    });
  }

  function getWordExample(){
    var word = $('#word').val().trim().toLowerCase();
    var url = `http://api.wordnik.com:80/v4/word.json/${word}/topExample?useCanonical=false&limitPerRelationshipType=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5`;
    $.getJSON(url, function(data){
      console.log(data);
    });
  }



  /* RhymeBrain Below */

  function getRhymes(){
    var word = $('#word').val().trim().toLowerCase();
    var url = `http://rhymebrain.com/talk?function=getRhymes&maxResults=20&word=${word}&jsonp=RhymeBrainResponse`;
    $.getJSON(url, function(data){
      console.log(data);
    });
  }


})();
