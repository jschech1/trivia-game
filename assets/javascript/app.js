$(document).ready(function(){
  
    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);
    
  })
  
  var trivia = {
    // trivia variables
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId : '',
    // questions options and answers
    questions: {
      q1: "How many consecutive Super Bowl appreances did the Bills make in the 1990's?",
      q2: "How many of those Super Bowl appreances did the Bills win?",
      q3: "Who is the Buffalo Bills all-time leading rusher?",
      q4: "What year did the Bills form?",
      q5: "Who is the Buffalo Bills current head coach?",
      q6: "The Bills recently ended their years long playoff drought. How long did it last?",
      q7: "Who of the following is NOT a top 5 Bills passing quarterback of all time?",
      q8: "Which Buffalo Bills head coach has the highest winning percentage while coaching?",
      q9: "Which team did the Buffalo Bills play twice in the Super Bowl?",
      q10: "Who leads the Bills in receiving touchdowns?"
    },
    options: {
      q1: ['2', '4', '3', '0'],
      q2: ['0', '1', '3', '4'],
      q3: ['OJ Simpson', 'LeSean McCoy', 'Fred Jackson', 'Thurman Thomas'],
      q4: ['1965', '1960', '1981', '1975'],
      q5: ['Marv Levy','Sean McDermott','Chan Galley','Doug Marone'],
      q6: ['10 years','17 years', '8 years','19 years'],
      q7: ['Joe Ferguson', 'Jim Kelly', 'Doug Flutie','Ryan Fitzpatrick'],
      q8: ['Lou Saban','Wade Phillips','Marv Levy','Bill Bellichick'],
      q9: ['Washington Redskins','New York Giants','New England Patriots','Dallas Cowboys'],
      q10: ['Eric Moulds','Andre Reed','James Lofton','Don Beebe']
    },
    answers: {
      q1: '4',
      q2: '0',
      q3: 'Thurman Thomas',
      q4: '1960',
      q5: 'Sean McDermott',
      q6: '17 years',
      q7: 'Doug Flutie',
      q8: 'Lou Saban',
      q9: 'Dallas Cowboys',
      q10: 'Andre Reed'
    },
    // trivia methods
    // initialize game
    startGame: function(){
      // restart game results
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      // show game section
      $('#game').show();
      
      //  empty last results
      $('#results').html('');
      
      // show timer
      $('#timer').text(trivia.timer);
      
      // remove start button
      $('#start').hide();
  
      $('#remaining-time').show();
      
      // ask first question
      trivia.nextQuestion();
      
    },
    // loop through and display questions and options 
    nextQuestion : function(){
      
      // set timer to 10 seconds each question
      trivia.timer = 10;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
    
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 3000);
      }
      
      // index questions
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      // current question array
      var questionOptions = Object.values(trivia.options)[trivia.currentSet];
      
      // creates guess options in the html
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
      })
      
    },
    // decrement counter 
    timerRunning : function(){
      // if timer still has time left and there are still questions left to ask
      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
          if(trivia.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }
      // the time has run out, run result
      else if(trivia.timer === -1){
        trivia.unanswered++;
        trivia.result = false;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 3000);
        $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }
      // if all the questions have been shown end the game, show results
      else if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        // adds results of game (correct, incorrect, unanswered) to the page
        $('#results')
          .html('<h3>Thank you for playing!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unaswered: '+ trivia.unanswered +'</p>'+
          '<p>Please play again!</p>');
        
        // hide game sction
        $('#game').hide();
        
        // show start button
        $('#start').show();
      }
      
    },
    // option clicked
    guessChecker : function() {
      
      // timer ID for gameResult setTimeout
      var resultId;
      
      // the answer to the current question being asked
      var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
      
      // if the text of the option picked matches the answer of the current question, increment correct
      if($(this).text() === currentAnswer){
        // turn button green for correct
        $(this).addClass('btn-success').removeClass('btn-info');
        
        trivia.correct++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 3000);
        $('#results').html('<h3>Correct Answer!</h3>');
      }
      // else the user picked the wrong option, increment incorrect
      else{
        // turn button clicked red for incorrect
        $(this).addClass('btn-danger').removeClass('btn-info');
        
        trivia.incorrect++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 3000);
        $('#results').html('<h3>Nope! The answer was '+ currentAnswer +'</h3>');
      }
      
    },
    // remove previous question results and options
    guessResult : function(){
      
      // increment to next question set
      trivia.currentSet++;
      
      // remove the options and results
      $('.option').remove();
      $('#results h3').remove();
      
      // begin next question
      trivia.nextQuestion();
       
    }
  
  }