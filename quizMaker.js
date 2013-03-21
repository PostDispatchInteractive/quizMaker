var quesType = [];
var quesEffect = [];
var quesNum = 0;
var basePath = '';
var byline = '';
var sources = '';
var stltoday = true;


// jQUERY READY HANDLER
// The script must be enclosed entirely within this handler because
// stltoday.com uses .noConflict, which removes the $ variable.

jQuery(document).ready(function($) {

	$.getScript("http://images.stltoday.com/mds/00003409/content/jquery.bpopup-0.5.0.min.js");

	$('#codeOutput').hide();
	$('#quizMaker form#quiz fieldset').hide();
	$('#quizMaker form').hide();
	$('#quizMaker form#quiz button').hide();

	$('#quizMaker form li.otherURL').hide();
	$('#quizMaker form .photonote-other').hide();

	$('#quizMaker form#credits').show();
	$('#quizMaker form').submit(function () { return false; });
	$('#labelCredits').addClass('active');

	$('#addButton').click(addedCredits);

	$('#pubs').click( function(){
		if ( $(this).is(':checked') ) { 
			stltoday = true;
			$('#quizMaker form li.otherURL').hide();
			$('#quizMaker form .photonote-other').hide();
			$('#quizMaker form li.mdsURL').show();
			$('#quizMaker form .photonote-stltoday').show();
		}
		else { 
			stltoday = false;
			$('#quizMaker form li.mdsURL').hide();
			$('#quizMaker form .photonote-stltoday').hide();
			$('#quizMaker form li.otherURL').show();
			$('#quizMaker form .photonote-other').show();
		}
	});


	function outputCode(snippet) {
		$('#codeOutput').val($('#codeOutput').val()+snippet);
	}


	function addedCredits() {

		var urlValidateRegex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:(?:[^\s()<>.]+[.]?)+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;
		var mdsValidateRegex = /^(\d\d\d\d)$/;
		var bylineValidate = 'Johnny Reporter';
		var sourcesValidate = 'News service name, Website name';

		// Test to make sure they included a URL (and in the right format).

		// Is the MDS code field empty? Pop an error message and send them back to work
		if ( !$("#mdsURL").val() && stltoday == true ) {
			$('#urlPopup1').bPopup({
				onClose:function(){ $('#mdsURL').focus(); }
			});
		}
		// Is the MDS code field wrong? Pop an error message and send them back to work.
		else if ( !mdsValidateRegex.test( $("#mdsURL").val() )  && stltoday === true) {
			$('#urlPopup2').bPopup({
				onClose:function(){ $('#mdsURL').focus(); }
			});
		}
		// Is the photo directory field empty? Pop an error message and send them back to work.
		else if ( !$("#otherURL").val() && stltoday != true ) {
			$('#urlPopup3').bPopup({
				onClose:function(){ $('#otherURL').focus(); }
			});
		}
		// Is the photo directory field wrong? Pop an error message and send them back to work.
		else if ( !urlValidateRegex.test( $("#otherURL").val() ) && stltoday === false ) {
			$('#urlPopup3').bPopup({
				onClose:function(){ $('#otherURL').focus(); }
			});
		}
		// Is the byline field unchanged? Pop an error message and send them back to work.
		else if ( $("#byline").val() === bylineValidate ) {
			$('#bylineSourcesPopup').bPopup({
				onClose:function(){ $('#byline').focus(); }
			});
		}
		// Is the source field unchanged? Pop an error message and send them back to work.
		else if ( $("#sources").val() === sourcesValidate ) {
			$('#bylineSourcesPopup').bPopup({
				onClose:function(){ $('#sources').focus(); }
			});
		}


		// If it's right, proceed with building the quiz
		else {
			$('#addButton').unbind();
			byline = $('#byline').val();
			sources = $('#sources').val();
			var baseFragment = $('#mdsURL').val();
			if ( stltoday ) {
				basePath = 'http://images.stltoday.com/mds/0000' + baseFragment + '/content/';
			}
			else {
				basePath = $("#otherURL").val();
			}

			outputCode('<div id="quiz">\r\n');
			outputCode('\t<div class="spinningWheel"><span>The quiz is loading</span></div>\r\n');

			addQuestions();
		}
	}


	function addQuestions() {
		$('#quizMaker form#credits').hide();
		$('#quizMaker form#quiz fieldset#addMultiChoice').hide();
		$('#quizMaker form#quiz fieldset#addTrueFalse').hide();
		$('#quizMaker form#quiz fieldset#addMultiPhoto').hide();
		$('#quizMaker form#quiz fieldset#quesEffects').hide();
		$('#quizMaker form#quiz button').hide();
		$('#quizMaker form#quiz').show();
		$('#quizMaker form#quiz fieldset#quesType').show();
		$('#labelCredits').removeClass('active');
		$('#labelQuestions').addClass('active');


		$('#quesType input').attr('checked', false);

		$('#quesType input').click( function(){
			if ( $(this).attr('value') === 'multiple 2x2') { addMultiPhoto(); }
			else if ( $(this).attr('value') === 'multiple choice') { addMultiChoice(); }
			else if ( $(this).attr('value') === 'true/false') { addTrueFalse(); }
		});


	}


	function addMultiPhoto() {
		$('#quizMaker form#quiz fieldset#addMultiChoice').hide();
		$('#quizMaker form#quiz fieldset#addTrueFalse').hide();
		$('#quizMaker form#quiz fieldset#addMultiPhoto').show();
		$('#quizMaker form#quiz button').show();
		quesType[quesNum] = 'multiple 2x2';
		$('#addMoreButton').click(function() { checkForm('more') });
		$('#scoringButton').click(function() { checkForm('score') });
	}

	function addMultiChoice() {
		$('#quizMaker form#quiz fieldset#addTrueFalse').hide();
		$('#quizMaker form#quiz fieldset#addMultiPhoto').hide();
		$('#quizMaker form#quiz fieldset#addMultiChoice').show();
		$('#quizMaker form#quiz button').show();
		$('#quizMaker form#quiz fieldset#quesEffects').show();
		$('#quizMaker form#quiz fieldset#quesEffects .effectDissolve').hide();
		quesType[quesNum] = 'multiple choice';
		// special effects check. will add other effects in future.
		$('#quesEffects input:checkbox').click( function(){
			// did we check or uncheck?
			if ( $(this).is(':checked') ) { 
			// yes, they checked an effect. Now, which one?
				if ( $(this).attr('value') === 'effect-dissolve') { addEffectDissolve(); }
			}
			else {
				// no, they unchecked. 
				if ( $(this).attr('value') === 'effect-dissolve') { removeEffectDissolve(); }
			}
		});
		$('#addMoreButton').click(function() { checkForm('more') });
		$('#scoringButton').click(function() { checkForm('score') });
	}

	function addTrueFalse() {
		$('#quizMaker form#quiz fieldset#addMultiPhoto').hide();
		$('#quizMaker form#quiz fieldset#addMultiChoice').hide();
		$('#quizMaker form#quiz fieldset#addTrueFalse').show();
		$('#quizMaker form#quiz button').show();
		$('#quizMaker form#quiz fieldset#quesEffects').show();
		$('#quizMaker form#quiz fieldset#quesEffects .effectDissolve').hide();
		// Were they using custom labels?
		if ( $('#customLabelsCheck').is(':checked') ) { 
			$('.tfLabels').hide();
			$('.customLabels').show();
		}
		else {
			$('.tfLabels').show();
			$('.customLabels').hide();
		}
		quesType[quesNum] = 'true/false';
		// special effects check. will add other effects in future.
		$('#customLabelsCheck').click( function(){
			// did we check or uncheck?
			if ( $(this).is(':checked') ) { 
				// yes, they checked
				$('.tfLabels').hide();
				$('.customLabels').show();
			}
			else {
				// no, they unchecked. 
				$('.customLabels').val('');
				$('.tfLabels').show();
				$('.customLabels').hide();
			}
		});
		$('#quesEffects input:checkbox').click( function(){
			// did we check or uncheck?
			if ( $(this).is(':checked') ) { 
			// yes, they checked an effect. Now, which one?
				if ( $(this).attr('value') === 'effect-dissolve') { addEffectDissolve(); }
			}
			else {
				// no, they unchecked. 
				if ( $(this).attr('value') === 'effect-dissolve') { removeEffectDissolve(); }
			}
		});

		$('#addMoreButton').click(function() { checkForm('more') });
		$('#scoringButton').click(function() { checkForm('score') });
	}


	function addEffectDissolve() {
		$('#quizMaker form#quiz fieldset#quesEffects .effectDissolve').show();
		quesEffect[quesNum] = 'effect-dissolve';
	}

	function removeEffectDissolve() {
		cleanForm('quesEffects');
		$('#quizMaker form#quiz fieldset#quesEffects .effectDissolve').hide();
		quesEffect[quesNum] = null;
	}

	function checkForm(whatToDo) {
		if (quesType[quesNum] === 'multiple 2x2') {
			// make sure they included all the answers.
			if (!$('#mpAns0').val()) {
				$('#ansPopup1').bPopup({
					onClose:function(){ $('#mpAns0').focus(); }
				});
			}
			else if (!$('#mpAns1').val()) {
				$('#ansPopup1').bPopup({
					onClose:function(){ $('#mpAns1').focus(); }
				});
			}
			else if (!$('#mpAns2').val()) {
				$('#ansPopup1').bPopup({
					onClose:function(){ $('#mpAns2').focus(); }
				});
			}
			else if (!$('#mpAns3').val()) {
				$('#ansPopup1').bPopup({
					onClose:function(){ $('#mpAns3').focus(); }
				});
			}
			// ok, good, we have all the answers.
			else {
				// make sure they included photos
				if (!$('#mpPho0').val()) {
					$('#photoPopup1').bPopup({
						onClose:function(){ $('#mpPho0').focus(); }
					});
				}
				else if (!$('#mpPho1').val()) {
					$('#photoPopup1').bPopup({
						onClose:function(){ $('#mpPho1').focus(); }
					});
				}
				else if (!$('#mpPho2').val()) {
					$('#photoPopup1').bPopup({
						onClose:function(){ $('#mpPho2').focus(); }
					});
				}
				else if (!$('#mpPho3').val()) {
					$('#photoPopup1').bPopup({
						onClose:function(){ $('#mpPho3').focus(); }
					});
				}
				// ok, good, we have all the photos.
				else {
					// make sure they included extra effect information, if necessary.
					if (quesEffect[quesNum] === 'effect-dissolve' && !$('#effectDissolvePhoto').val() ) {
						$('#effectPopup1').bPopup({
							onClose:function(){ $('#effectDissolvePhoto').focus(); }
						});
					}
					// ok, good, we have all extra effect information. let's output it
					else {
						if (whatToDo === 'more') { process(); }
						else if (whatToDo === 'score') { assignScoring(); }
					}
				}
			}
		}
		else if (quesType[quesNum] === 'multiple choice') {
			// make sure they included all the answers.
			if (!$('#mcAns0').val()) {
				$('#ansPopup1').bPopup({
					onClose:function(){ $('#mcAns0').focus(); }
				});
			}
			else if (!$('#mcAns1').val()) {
				$('#ansPopup1').bPopup({
					onClose:function(){ $('#mcAns1').focus(); }
				});
			}
			else if (!$('#mcAns2').val()) {
				$('#ansPopup1').bPopup({
					onClose:function(){ $('#mcAns2').focus(); }
				});
			}
			else if (!$('#mcAns3').val()) {
				$('#ansPopup1').bPopup({
					onClose:function(){ $('#mcAns3').focus(); }
				});
			}
			// ok, good, we have all the answers.
			else {
				// make sure they included a photo
				if (!$('#mcPho0').val()) {
					$('#photoPopup2').bPopup({
						onClose:function(){ $('#mcPho0').focus(); }
					});
				}
				// ok, good, we have the photo. let's output it
				else {
					// make sure they included extra effect information, if necessary.
					if (quesEffect[quesNum] === 'effect-dissolve' && !$('#effectDissolvePhoto').val() ) {
						$('#effectPopup1').bPopup({
							onClose:function(){ $('#effectDissolvePhoto').focus(); }
						});
					}
					// ok, good, we have all extra effect information. let's output it
					else {
						if (whatToDo === 'more') { process(); }
						else if (whatToDo === 'score') { assignScoring(); }
					}
				}
			}
		}
		else if (quesType[quesNum] === 'true/false') {
			// make sure they included an answer.
			var flagTrue = $('#true').is(':checked');
			var flagFalse = $('#false').is(':checked');
			if (!flagTrue && !flagFalse) {
				$('#ansPopup2').bPopup();
			}
			// ok, good, we have the answer.
			else {
				// make sure they included a photo
				if (!$('#tfPho0').val()) {
					$('#photoPopup2').bPopup({
						onClose:function(){ $('#tfPho0').focus(); }
					});
				}
				// ok, good, we have the photo. let's output it
				else {
					// make sure they included extra effect information, if necessary.
					if (quesEffect[quesNum] === 'effect-dissolve' && !$('#effectDissolvePhoto').val() ) {
						$('#effectPopup1').bPopup({
							onClose:function(){ $('#effectDissolvePhoto').focus(); }
						});
					}
					// ok, good, we have all extra effect information. let's output it
					else {
						if (whatToDo === 'more') { process(); }
						else if (whatToDo === 'score') { assignScoring(); }
					}
				}
			}
		}
	}


	function process() {
		$('#addMoreButton').unbind();
		$('#scoringButton').unbind();
		$('#quesEffects input:checkbox').unbind();

		if (quesType[quesNum] === 'multiple 2x2') { outputMultiPhoto(); }
		else if (quesType[quesNum] === 'multiple choice') { outputMultiChoice(); }
		else if (quesType[quesNum] === 'true/false') { outputTrueFalse(); }

		addQuestions();
	}


	function outputMultiPhoto() {
		var question = $('#mpQuestion').val();
		var answer0 = $('#mpAns0').val();
		var answer1 = $('#mpAns1').val();
		var answer2 = $('#mpAns2').val();
		var answer3 = $('#mpAns3').val();
		var answerPhoto0 = $('#mpPho0').val().split("\\").pop();
		var answerPhoto1 = $('#mpPho1').val().split("\\").pop();
		var answerPhoto2 = $('#mpPho2').val().split("\\").pop();
		var answerPhoto3 = $('#mpPho3').val().split("\\").pop();
		var response = $('#mpResponse').val();
		if (quesEffect[quesNum] === 'effect-dissolve') {
			var dissolvePhoto = basePath + $('#effectDissolvePhoto').val().split("\\").pop();
			var effectClass = quesEffect[quesNum];
		}
		else { 
			var dissolvePhoto = '';
			var effectClass = '';
		}
		outputCode('\t<div class="questions multiphoto ' + effectClass + '" id="question' + quesNum + '">\r\n');
		outputCode('\t\t<div class="photos" data="' + dissolvePhoto + '">\r\n');
		outputCode('\t\t\t<img id="ques' + quesNum + 'pho0" class="correct" src="' + basePath + answerPhoto0 + '" />\r\n');
		outputCode('\t\t\t<img id="ques' + quesNum + 'pho1" class="wrong" src="' + basePath + answerPhoto1 + '" />\r\n');
		outputCode('\t\t\t<img id="ques' + quesNum + 'pho2" class="wrong" src="' + basePath + answerPhoto2 + '" />\r\n');
		outputCode('\t\t\t<img id="ques' + quesNum + 'pho3" class="wrong" src="' + basePath + answerPhoto3 + '" />\r\n');
		outputCode('\t\t</div>\r\n');
		outputCode('\t\t<div class="question">' + question + '</div>\r\n');
		outputCode('\t\t<div class="answers">\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="correct" value="correct" id="ques' + quesNum + 'ans0" name="ques' + quesNum + '" /><label for="ques' + quesNum + 'ans0">' + answer0 + '</label></div>\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="wrong" value="wrong" id="ques' + quesNum + 'ans1" name="ques' + quesNum + '" /><label for="ques' + quesNum + 'ans1">' + answer1 + '</label></div>\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="wrong" value="wrong" id="ques' + quesNum + 'ans2" name="ques' + quesNum + '" /><label for="ques' + quesNum + 'ans2">' + answer2 + '</label></div>\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="wrong" value="wrong" id="ques' + quesNum + 'ans3" name="ques' + quesNum + '" /><label for="ques' + quesNum + 'ans3">' + answer3 + '</label></div>\r\n');
		outputCode('\t\t</div>\r\n');
		outputCode('\t\t<div class="response"><span class="answeredWrong">Wrong.</span><span class="answeredCorrect">Right.</span> ' + response + '</div>\r\n');
		outputCode('\t</div>\r\n');
		quesNum++;
		cleanForm('quesEffects');
		cleanForm('addMultiPhoto');
	}

					



	function outputMultiChoice() {
		var question = $('#mcQuestion').val();
		var answer0 = $('#mcAns0').val();
		var answer1 = $('#mcAns1').val();
		var answer2 = $('#mcAns2').val();
		var answer3 = $('#mcAns3').val();
		var answerPhoto0 = $('#mcPho0').val().split("\\").pop();
		var response = $('#mcResponse').val();
		if (quesEffect[quesNum] === 'effect-dissolve') {
			var dissolvePhoto = basePath + $('#effectDissolvePhoto').val().split("\\").pop();
			var effectClass = quesEffect[quesNum];
		}
		else { 
			var dissolvePhoto = '';
			var effectClass = '';
		}
		outputCode('\t<div class="questions multichoice ' + effectClass + '" id="question'+quesNum+'">\r\n');
		outputCode('\t\t<div class="photos" data="' + dissolvePhoto + '">\r\n');
		outputCode('\t\t\t<img id="ques'+quesNum+'pho0" class="correct" src="'+basePath+answerPhoto0+'" />\r\n');
		outputCode('\t\t</div>\r\n');
		outputCode('\t\t<div class="question">' +question+ '</div>\r\n');
		outputCode('\t\t<div class="answers">\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="correct" value="correct" id="ques'+quesNum+'ans0" name="ques'+quesNum+'" /><label for="ques'+quesNum+'ans0">'+answer0+'</label></div>\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="wrong" value="wrong" id="ques'+quesNum+'ans1" name="ques'+quesNum+'" /><label for="ques'+quesNum+'ans1">'+answer1+'</label></div>\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="wrong" value="wrong" id="ques'+quesNum+'ans2" name="ques'+quesNum+'" /><label for="ques'+quesNum+'ans2">'+answer2+'</label></div>\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="wrong" value="wrong" id="ques'+quesNum+'ans3" name="ques'+quesNum+'" /><label for="ques'+quesNum+'ans3">'+answer3+'</label></div>\r\n');
		outputCode('\t\t</div>\r\n');
		outputCode('\t\t<div class="response"><span class="answeredWrong">Wrong.</span><span class="answeredCorrect">Right.</span> '+response+'</div>\r\n');
		outputCode('\t</div>\r\n');
		quesNum++;
		cleanForm('quesEffects');
		cleanForm('addMultiChoice');
	}


	function outputTrueFalse() {
		var question = $('#tfQuestion').val();
		var answer0 = $('#addTrueFalse input[name="trueFalse"]:checked').val();
		var tLabel  = $('#trueLabel').val();
		var fLabel = $('#falseLabel').val();

		if (tLabel == '' || tLabel == null) { var trueLabel = 'True' }
		else { var trueLabel = tLabel; }

		if (fLabel == '' || fLabel == null) { var falseLabel = 'False' }
		else { var falseLabel = fLabel; }

		var answerPhoto0 = $('#tfPho0').val().split("\\").pop();
		var response = $('#tfResponse').val();
		if (answer0 === 'true') {
			var answerValue0 = 'correct';
			var answerValue1 = 'wrong';
		}
		else {
			var answerValue0 = 'wrong';
			var answerValue1 = 'correct';
		}
		if (quesEffect[quesNum] === 'effect-dissolve') {
			var dissolvePhoto = basePath + $('#effectDissolvePhoto').val().split("\\").pop();
			var effectClass = quesEffect[quesNum];
		}
		else { 
			var dissolvePhoto = '';
			var effectClass = '';
		}
		outputCode('\t<div class="questions truefalse ' + effectClass + '" id="question'+quesNum+'">\r\n');
		outputCode('\t\t<div class="photos" data="' + dissolvePhoto + '">\r\n');
		outputCode('\t\t\t<img id="ques'+quesNum+'pho0" class="correct" src="'+basePath+answerPhoto0+'" />\r\n');
		outputCode('\t\t</div>\r\n');
		outputCode('\t\t<div class="question">' +question+ '</div>\r\n');
		outputCode('\t\t<div class="answers">\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="'+answerValue0+'" value="'+answerValue0+'" id="ques'+quesNum+'ans0" name="ques'+quesNum+'" /><label for="ques'+quesNum+'ans0">'+trueLabel+'</label></div>\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="'+answerValue1+'" value="'+answerValue1+'" id="ques'+quesNum+'ans1" name="ques'+quesNum+'" /><label for="ques'+quesNum+'ans1">'+falseLabel+'</label></div>\r\n');
		outputCode('\t\t</div>\r\n');
		outputCode('\t\t<div class="response"><span class="answeredWrong">Wrong.</span><span class="answeredCorrect">Right.</span> '+response+'</div>\r\n');
		outputCode('\t</div>\r\n');
		quesNum++;
		cleanForm('quesEffects');
		cleanForm('addTrueFalse');
	}


	function assignScoring() {
		$('#labelQuestions').removeClass('active');
		$('#labelScoring').addClass('active');

		$('#addMoreButton').unbind();
		$('#scoringButton').unbind();
		$('#quesEffects input:checkbox').unbind();

		if (quesType[quesNum] === 'multiple 2x2') { outputMultiPhoto(); }
		else if (quesType[quesNum] === 'multiple choice') { outputMultiChoice(); }
		else if (quesType[quesNum] === 'true/false') { outputTrueFalse(); }

		$('#quiz').hide();
		$('#assignScoring').show();
		$('<p>Your quiz has '+quesNum+' questions.</p>').insertBefore('#scoringLabels');


		// Generate the scoring response range, based on how many questions there were.

		if (quesNum > 5) {
			scoringRangeLow = Math.round(quesNum * 0.1);
			scoringRangeMedian = Math.round(quesNum * 0.5);
			scoringRangeHigh = Math.round(quesNum * 0.9);
			if ( scoringRangeHigh >= quesNum ) { scoringRangeHigh = quesNum-1; }
			if ( scoringRangeLow < 1 ) { scoringRangeLow = 1; }
			$('#scoringRange0').val(scoringRangeHigh);
			$('#scoringRange1').val( Math.round(quesNum * 0.7) );
			$('#scoringRange2').val(scoringRangeMedian);
			$('#scoringRange3').val( Math.round(quesNum * 0.3) );
			$('#scoringRange4').val(scoringRangeLow);
		}


		$('#finish').click(finish);
	}

	function finish() {
		$('#labelScoring').removeClass('active');
		$('#finish').unbind();
		$('#finish').hide();
		var judgmentImg = $('#judgment').val().split("\\").pop();
		var scoringResponse = $('#scoringResponse').val();
		var scoringRangeSize = 0;
		var scoringRange = [];
		var scoringEvaluation = [];

		// loops to cycle through all the scoring inputs
		for (x=0; x<5; x++) {
			scoringRange[x] = $('#scoringRange'+x).val();
		}
		for (x=0; x<5; x++) {
			scoringEvaluation[x] = $('#evaluation'+x).val();
			// gotta watch out for double quote marks, so use regex
			// The /g flag tells it to match all instances of "
			scoringEvaluation[x] = scoringEvaluation[x].replace(/"/g,'&quot;');
		}

		outputCode('\t<div id="scoring">\r\n');
		outputCode('\t\t<div class="photos"><img id="judgment" src="'+basePath+judgmentImg+'" /></div>\r\n');
		outputCode('\t\t<div id="response">'+scoringResponse+'</div>\r\n');
		outputCode('\t</div>\r\n');
		outputCode('</div>\r\r\n');
		outputCode('<div id="credits"><strong>QUIZ BY:</strong> '+byline+'</div>\r\n');
		outputCode('<div id="sources"><strong>SOURCES:</strong> '+sources+'</div>\r\r\n');

		outputCode('<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>\r\r\n');
		outputCode('<script type="text/javascript">\r\n');
		outputCode('\tvar totalQuestions = ' +quesNum+ ';\r\n');
		outputCode('\tvar scoringRange = [];\r\n');
		outputCode('\tvar scoringEvaluation = [];\r\n');
		outputCode('\tvar quesType = [];\r\n');

		for (x=4; x>=0; x--) {
			outputCode('\tscoringRange['+x+'] = '+scoringRange[x]+';\r\n');
		}
		for (x=4; x>=0; x--) {
			outputCode('\tscoringEvaluation['+x+'] = "'+scoringEvaluation[x]+'";\r\n');
		}

//		the quesType array is redundant and support was removed in quizReader v0.2d
//		for (x=0; x<quesNum; x++) {
//				outputCode('\tquesType['+x+'] = "'+quesType[x]+'";\r\n');
//		}

		outputCode('</script>\r\r\n');

		outputCode('<script type="text/javascript" src="http://images.stltoday.com/mds/00003409/content/quizReader.js"></script>\r\r\n');
		outputCode('<link rel="stylesheet" type="text/css" href="http://images.stltoday.com/mds/00003409/content/style.css" />\r\n');

		$('#assignScoring').hide();
		$('#codeOutput').show();
		$('<p>Please select all the code above, copy it, and paste it into a new Blox HTML asset. Then you are done!</p>').insertAfter('#codeOutput');

	}

	function cleanForm(form) {
		$(':input','#'+form).not(':button, :submit, :reset, :hidden, :checkbox, #true, #false, #trueLabel, #falseLabel').val('');
		$('#true').attr('checked', false);
		$('#false').attr('checked', false);
		$('#'+form+' input[type="checkbox"]').not('#customLabelsCheck').attr('checked', false);
	}


});
