// ===========================================================================
// ==  
// ==  TO DO LIST
// ==  
// ==  * Refactor the Dissolve effect code, so multiple photos can be added
// ==  
// ==  * Refactor the Zoom effect code. 
// ==  	- Zoom in/out radio buttons should show up as children of Dissolve, 
// ==  	  since Zoom only works with a second photo.
// ==  
// ==  * Refactor the Sound effect code, so "before" sound can be added (only "after" works now)
// ==  
// ==  * Fix Dissolve effect when used with multiphoto questions. There's one in Space Quiz.
// ==  
// ==  * Add function to check number of questions. If < 5 , reduce number of scoring range/evaluations
// ==  
// ==  
// ===========================================================================




var questions = [];
var quesNum = 0;
var basePath = '';
var byline = '';
var sources = '';
var stltoday = true;
var cover = false;
var debug = false;


// This variable and function are used for sanitizing input
var entityMap = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': '&quot;',
	"'": '&#39;',
	"/": '&#x2F;'
};
function escapeHtml(string) {
	return String(string).replace(/[&<>"'\/]/g, function (s) {
		return entityMap[s];
	});
}


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

	$('#quizMaker form .coverFields').hide();

	$('#quizMaker form#credits').show();
	$('#quizMaker form').submit(function () { return false; });
	$('#labelCredits').addClass('active');

	// preFill MDS code if in debug mode
	if ( debug ) {
		$('#mdsURL').val('3766');
	}

	// This button launches the next stage
	$('#addButton').click( addedCredits );

	// This toggles URL formats (STLtoday/MDS or other)
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

	// This toggles title screen
	$('#cover').click( function(){
		if ( $(this).is(':checked') ) { 
			cover = true;
			$('#quizMaker form .coverFields').show();
		}
		else { 
			cover = false;
			$('#quizMaker form .coverFields').hide();
		}
	});


	function outputCode(snippet) {
		$('#codeOutput').val( $('#codeOutput').val() + snippet );
	}

	// Function object creator
	function question() {
		this.quesType = false;
		this.sound = false;
		this.dissolve = false;
		this.zoomIn = false;
		this.zoomOut = false;
		this.scroll = false;
	}

	function wordCount($textField) {
		var content = $textField.val();
		var matches = content.match(/\S+\s*/g);
		var numWords = matches !== null ? matches.length : 0;
		return numWords
	}

	function countColor() {
		var numWords = wordCount( $(this) );
		var color = '#080'; 
		if ( numWords > 34 ) { color = '#A00'; } 
		else if ( numWords > 28 ) { color = '#E60'; } 
		else if ( numWords > 24 ) { color = '#BA0'; } 
		else if ( numWords > 18 ) { color = '#7A0'; } 
		$(this).siblings('.wordCount').text(numWords).css('background-color',color);
	}

	function addedCredits() {
		var urlValidateRegex = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:(?:[^\s()<>.]+[.]?)+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gi;
		var mdsValidateRegex = /^(\d\d\d\d)$/;
		var bylineValidate = 'Johnny Reporter';
		var sourcesValidate = 'News service name, Website name';

		// Test to make sure they included a URL (and in the right format).

		// Is the MDS code field empty? Pop an error message and send them back to work
		if ( !$("#mdsURL").val() && stltoday && !debug ) {
			$('#urlPopup1').bPopup({
				onClose:function(){ $('#mdsURL').focus(); }
			});
		}
		// Is the MDS code field wrong? Pop an error message and send them back to work.
		else if ( !mdsValidateRegex.test( $("#mdsURL").val() ) && stltoday && !debug ) {
			$('#urlPopup2').bPopup({
				onClose:function(){ $('#mdsURL').focus(); }
			});
		}
		// Is the photo directory field empty? Pop an error message and send them back to work.
		else if ( !$("#otherURL").val() && !stltoday && !debug) {
			$('#urlPopup3').bPopup({
				onClose:function(){ $('#otherURL').focus(); }
			});
		}
		// Is the photo directory field wrong? Pop an error message and send them back to work.
		else if ( !urlValidateRegex.test( $("#otherURL").val() ) && !stltoday && !debug ) {
			$('#urlPopup3').bPopup({
				onClose:function(){ $('#otherURL').focus(); }
			});
		}
		// Is the byline field unchanged? Pop an error message and send them back to work.
		else if ( $("#byline").val() === bylineValidate && !debug ) {
			$('#bylineSourcesPopup').bPopup({
				onClose:function(){ $('#byline').focus(); }
			});
		}
		// Is the source field unchanged? Pop an error message and send them back to work.
		else if ( $("#sources").val() === sourcesValidate && !debug ) {
			$('#bylineSourcesPopup').bPopup({
				onClose:function(){ $('#sources').focus(); }
			});
		}
		// Is there a cover image?
		else if ( !$("#coverImage").val() && cover && !debug ) {
			$('#coverPopup1').bPopup({
				onClose:function(){ $('#coverImage').focus(); }
			});
		}
		// Is there cover text?
		else if ( !$("#coverText").val() && cover && !debug ) {
			$('#coverPopup2').bPopup({
				onClose:function(){ $('#coverText').focus(); }
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

			// Output cover image code if we need one
			if ( cover ) {
				var coverPhoto = $('#coverImage').val().split("\\").pop();
				var coverText = $('#coverText').val();
				outputCode('\t<div class="cover">\r\n');
				outputCode('\t\t<img id="quizCover" src="' + basePath + coverPhoto + '" />\r\n');
				outputCode('\t\t<p>' + coverText + '</p>\r\n');
				outputCode('\t</div>\r\n');
			}

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
			// Make sure any existing event handlers are turned off, otherwise they multiply
			$('#addMoreButton').off('click');
			$('#scoringButton').off('click');
			// Create event handlers
			$('#addMoreButton').click(function() { checkForm('more') });
			$('#scoringButton').click(function() { checkForm('score') });
		});


	}


	function addMultiPhoto() {
		questions[quesNum] = new question();
		questions[quesNum].quesType = 'multiple 2x2';
		$('#quizMaker form#quiz fieldset#addMultiChoice').hide();
		$('#quizMaker form#quiz fieldset#addTrueFalse').hide();
		$('#quizMaker form#quiz fieldset#addMultiPhoto').show();
		$('#quizMaker form#quiz button').show();
		$('#quizMaker form#quiz fieldset#quesEffects').show();
		$('#quizMaker form#quiz fieldset#quesEffects ol').show();
		$('#quizMaker form#quiz fieldset#quesEffects .dissolve').hide();
		$('#quizMaker form#quiz fieldset#quesEffects .effectPicker').hide();
		if ( debug ) { 
			preFill( $('#quizMaker form#quiz fieldset#addMultiPhoto') ); 
		}

		$('#addMultiPhoto textarea').unbind();

		$('#addMultiPhoto textarea').keyup( countColor );

		$('#quesEffects input:checkbox').click( function(){
			// did we check or uncheck?
			if ( $(this).is(':checked') ) { 
			// yes, they checked an effect. Now, which one?
				if ( $(this).attr('value') === 'effect-dissolve') { addEffect('dissolve'); }
				if ( $(this).attr('value') === 'effect-sound') { addEffect('sound'); }
				if ( $(this).attr('value') === 'effect-zoom') { addEffect('zoom'); }
			}
			else {
				// no, they unchecked. 
				if ( $(this).attr('value') === 'effect-dissolve') { removeEffect('dissolve'); }
				if ( $(this).attr('value') === 'effect-sound') { removeEffect('sound'); }
				if ( $(this).attr('value') === 'effect-zoom') { removeEffect('zoom'); }
			}
		});
	}

	function addMultiChoice() {
		questions[quesNum] = new question();
		questions[quesNum].quesType = 'multiple choice';
		$('#quizMaker form#quiz fieldset#addTrueFalse').hide();
		$('#quizMaker form#quiz fieldset#addMultiPhoto').hide();
		$('#quizMaker form#quiz fieldset#addMultiChoice').show();
		$('#quizMaker form#quiz button').show();
		$('#quizMaker form#quiz fieldset#quesEffects').show();
		$('#quizMaker form#quiz fieldset#quesEffects ol').show();
		$('#quizMaker form#quiz fieldset#quesEffects .effectPicker').hide();
		// special effects check. will add other effects in future.
		if ( debug ) { 
			preFill( $('#quizMaker form#quiz fieldset#addMultiChoice') ); 
		}
		$('#quesEffects input:checkbox').click( function(){
			// did we check or uncheck?
			if ( $(this).is(':checked') ) { 
			// yes, they checked an effect. Now, which one?
				if ( $(this).attr('value') === 'effect-dissolve') { addEffect('dissolve'); }
				if ( $(this).attr('value') === 'effect-sound') { addEffect('sound'); }
				if ( $(this).attr('value') === 'effect-zoom') { addEffect('zoom'); }
			}
			else {
				// no, they unchecked. 
				if ( $(this).attr('value') === 'effect-dissolve') { removeEffect('dissolve'); }
				if ( $(this).attr('value') === 'effect-sound') { removeEffect('sound'); }
				if ( $(this).attr('value') === 'effect-zoom') { removeEffect('zoom'); }
			}
		});
	}

	function addTrueFalse() {
		questions[quesNum] = new question();
		questions[quesNum].quesType = 'true/false';
		$('#quizMaker form#quiz fieldset#addMultiPhoto').hide();
		$('#quizMaker form#quiz fieldset#addMultiChoice').hide();
		$('#quizMaker form#quiz fieldset#addTrueFalse').show();
		$('#quizMaker form#quiz button').show();
		$('#quizMaker form#quiz fieldset#quesEffects').show();
		$('#quizMaker form#quiz fieldset#quesEffects ol').show();
		$('#quizMaker form#quiz fieldset#quesEffects .effectPicker').hide();
		// Were they using custom labels?
		if ( $('#customLabelsCheck').is(':checked') ) { 
			$('.tfLabels').hide();
			$('.customLabels').show();
		}
		else {
			$('.tfLabels').show();
			$('.customLabels').hide();
		}
		if ( debug ) { 
			preFill( $('#quizMaker form#quiz fieldset#addTrueFalse') ); 
		}
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
				if ( $(this).attr('value') === 'effect-dissolve') { addEffect('dissolve'); }
				if ( $(this).attr('value') === 'effect-sound') { addEffect('sound'); }
				if ( $(this).attr('value') === 'effect-zoom') { addEffect('zoom'); }
			}
			else {
				// no, they unchecked. 
				if ( $(this).attr('value') === 'effect-dissolve') { removeEffect('dissolve'); }
				if ( $(this).attr('value') === 'effect-sound') { removeEffect('sound'); }
				if ( $(this).attr('value') === 'effect-zoom') { removeEffect('zoom'); }
			}
		});
	}

	// this code prefills the questions for when I'm doing testing.
	function preFill($fieldset) {
		var preFillAnswers = ['To get to the other side','Because he wanted to','To save his chicks','He had a death wish'];
		var preFillPhotos = ['sean-connery.jpg','nick-nolte.jpg','richard-gere.jpg','mel-gibson.jpg'];
		$fieldset.find('.field-question').val('This is a dummy question. Why did the chicken cross the road?');
		$fieldset.find('.field-response').val('This is a dummy response. Chickens are renowned for their delight in crossing roads.');
		$fieldset.find('.field-answer').each( function(index) {
			$(this).val( preFillAnswers[index] );
		});
		// multiPhoto needs several small images
		if ( $fieldset.attr('id') == 'addMultiPhoto' ) {
			$fieldset.find('.field-photo').each( function(index) {
				var theId = $(this).attr('id');
				$(this).replaceWith('<input type="text" id="' + theId + '" class="field-photo" value="' + preFillPhotos[index] + '" />');
			});
		}
		// multiChoice and trueFalse only need one
		else {
			var theId = $fieldset.find('.field-photo').attr('id');
			$fieldset.find('.field-photo').replaceWith('<input type="text" id="' + theId + '" class="field-photo" value="komodo.jpg" />');
		}
		$fieldset.find('.field-truefalse').attr('checked',true);
	}

	function addEffect(effect) {
		$('#quizMaker form#quiz fieldset#quesEffects .' + effect + '.effectPicker' ).show();
		questions[quesNum][effect] = true;
	}

	function removeEffect(effect) {
		$('#quizMaker form#quiz fieldset#quesEffects .' + effect + '.effectPicker').hide();
		questions[quesNum][effect] = false;
	}

	function checkForm(whatToDo) {
		if (questions[quesNum].quesType === 'multiple 2x2') {
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
					if (questions[quesNum].dissolve && !$('#effectDissolvePhoto').val() ) {
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
		else if (questions[quesNum].quesType === 'multiple choice') {
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
					if (questions[quesNum].dissolve && !$('#effectDissolvePhoto').val() ) {
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
		else if (questions[quesNum].quesType === 'true/false') {
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
					if (questions[quesNum].dissolve === 'effect-dissolve' && !$('#effectDissolvePhoto').val() ) {
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
		$('#addMoreButton').off('click');
		$('#scoringButton').off('click');
		$('#quesEffects input:checkbox').off('click');

		if (questions[quesNum].quesType === 'multiple 2x2') { outputMultiPhoto(); }
		else if (questions[quesNum].quesType === 'multiple choice') { outputMultiChoice(); }
		else if (questions[quesNum].quesType === 'true/false') { outputTrueFalse(); }

		addQuestions();
	}

	function outputMultiPhoto() {
		var question = escapeHtml( $('#mpQuestion').val() );
		var answer0 = escapeHtml( $('#mpAns0').val() );
		var answer1 = escapeHtml( $('#mpAns1').val() );
		var answer2 = escapeHtml( $('#mpAns2').val() );
		var answer3 = escapeHtml( $('#mpAns3').val() );
		var answerPhoto0 = $('#mpPho0').val().split("\\").pop();
		var answerPhoto1 = $('#mpPho1').val().split("\\").pop();
		var answerPhoto2 = $('#mpPho2').val().split("\\").pop();
		var answerPhoto3 = $('#mpPho3').val().split("\\").pop();
		var response = escapeHtml( $('#mpResponse').val() );
		var effectClass = '';
		var dissolvePhoto = '';
		var soundFile = '';
		if (questions[quesNum].dissolve) {
			dissolvePhoto = basePath + $('#effectDissolvePhoto').val().split("\\").pop();
			effectClass += " effect-dissolve";
		}
		else if (questions[quesNum].sound) {
			soundFile = basePath + $('#effectSoundFile').val().split("\\").pop();
			effectClass += " effect-sound";
		}
		else if (questions[quesNum].zoomIn) {
			effectClass += " effect-zoom-in";
		}
		else if (questions[quesNum].zoomOut) {
			effectClass += " effect-zoom-out";
		}
		outputCode('\t<div class="questions multiphoto' + effectClass + '" id="question' + quesNum + '">\r\n');
		outputCode('\t\t<div class="photos">\r\n');
		// THIS SECTION OF CODE NEEDS ATTENTION
		// I have not solved the problem of making a set of multiphotos fade into a single photo.
		// Probably need to wrap the multiphotos in a <div class="layer"> and make changes to CSS.
		// The Space quiz has one of these questions, and needs to be fixed with whatever solution I develop.
		//if (questions[quesNum].dissolve) {
		//	outputCode('\t\t\t<img class="layer" src="'+dissolvePhoto+'" />\r\n');
		//}
		outputCode('\t\t\t<img id="ques' + quesNum + 'pho0" class="correct" src="' + basePath + answerPhoto0 + '" />\r\n');
		outputCode('\t\t\t<img id="ques' + quesNum + 'pho1" class="wrong" src="' + basePath + answerPhoto1 + '" />\r\n');
		outputCode('\t\t\t<img id="ques' + quesNum + 'pho2" class="wrong" src="' + basePath + answerPhoto2 + '" />\r\n');
		outputCode('\t\t\t<img id="ques' + quesNum + 'pho3" class="wrong" src="' + basePath + answerPhoto3 + '" />\r\n');
		outputCode('\t\t</div>\r\n');
		if (questions[quesNum].sound) {
			outputCode('\t\t\t<div class="sounds">\r\n');
			outputCode('\t\t\t\t<audio class="after" preload="auto" src="' + soundFile + '"></audio>\r\n');
			outputCode('\t\t</div>\r\n');
		}
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
		var question = escapeHtml( $('#mcQuestion').val() );
		var answer0 = escapeHtml( $('#mcAns0').val() );
		var answer1 = escapeHtml( $('#mcAns1').val() );
		var answer2 = escapeHtml( $('#mcAns2').val() );
		var answer3 = escapeHtml( $('#mcAns3').val() );
		var answerPhoto0 = $('#mcPho0').val().split("\\").pop();
		var response = escapeHtml( $('#mcResponse').val() );
		var effectClass = '';
		var dissolvePhoto = '';
		var soundFile = '';
		if (questions[quesNum].dissolve) {
			dissolvePhoto = basePath + $('#effectDissolvePhoto').val().split("\\").pop();
			effectClass += " effect-dissolve";
		}
		else if (questions[quesNum].sound) {
			soundFile = basePath + $('#effectSoundFile').val().split("\\").pop();
			effectClass += " effect-sound";
		}
		else if (questions[quesNum].zoomIn) {
			effectClass += " effect-zoom-in";
		}
		else if (questions[quesNum].zoomOut) {
			effectClass += " effect-zoom-out";
		}
		outputCode('\t<div class="questions multichoice' + effectClass + '" id="question' + quesNum + '">\r\n');
		outputCode('\t\t<div class="photos">\r\n');
		if (questions[quesNum].dissolve) {
			outputCode('\t\t\t<img class="layer" src="' + dissolvePhoto + '" />\r\n');
		}
		outputCode('\t\t\t<img id="ques'+quesNum+'pho0" class="layer correct" src="' + basePath + answerPhoto0 + '" />\r\n');
		outputCode('\t\t</div>\r\n');
		if (questions[quesNum].sound) {
			outputCode('\t\t\t<div class="sounds">\r\n');
			outputCode('\t\t\t\t<audio class="after" preload="auto" src="' + soundFile + '"></audio>\r\n');
			outputCode('\t\t</div>\r\n');
		}
		outputCode('\t\t<div class="question">' + question + '</div>\r\n');
		outputCode('\t\t<div class="answers">\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="correct" value="correct" id="ques' + quesNum + 'ans0" name="ques' + quesNum + '" /><label for="ques' + quesNum + 'ans0">'+answer0+'</label></div>\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="wrong" value="wrong" id="ques' + quesNum + 'ans1" name="ques' + quesNum + '" /><label for="ques' + quesNum + 'ans1">'+answer1+'</label></div>\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="wrong" value="wrong" id="ques' + quesNum + 'ans2" name="ques' + quesNum + '" /><label for="ques' + quesNum + 'ans2">'+answer2+'</label></div>\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="wrong" value="wrong" id="ques' + quesNum + 'ans3" name="ques' + quesNum + '" /><label for="ques' + quesNum + 'ans3">'+answer3+'</label></div>\r\n');
		outputCode('\t\t</div>\r\n');
		outputCode('\t\t<div class="response"><span class="answeredWrong">Wrong.</span><span class="answeredCorrect">Right.</span> ' + response + '</div>\r\n');
		outputCode('\t</div>\r\n');
		quesNum++;
		cleanForm('quesEffects');
		cleanForm('addMultiChoice');
	}


	function outputTrueFalse() {
		var question = escapeHtml( $('#tfQuestion').val() );
		var answer0 = $('#addTrueFalse input[name="trueFalse"]:checked').val();
		var tLabel  = escapeHtml( $('#trueLabel').val() );
		var fLabel = escapeHtml( $('#falseLabel').val() );

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
		var effectClass = '';
		var dissolvePhoto = '';
		var soundFile = '';
		if (questions[quesNum].dissolve) {
			dissolvePhoto = basePath + $('#effectDissolvePhoto').val().split("\\").pop();
			effectClass += " effect-dissolve";
		}
		else if (questions[quesNum].sound) {
			soundFile = basePath + $('#effectSoundFile').val().split("\\").pop();
			effectClass += " effect-sound";
		}
		else if (questions[quesNum].zoomIn) {
			effectClass += " effect-zoom-in";
		}
		else if (questions[quesNum].zoomOut) {
			effectClass += " effect-zoom-out";
		}
		outputCode('\t<div class="questions truefalse' + effectClass + '" id="question' + quesNum + '">\r\n');
		outputCode('\t\t<div class="photos">\r\n');
		if (questions[quesNum].dissolve) {
			outputCode('\t\t\t<img class="layer" src="' + dissolvePhoto + '" />\r\n');
		}
		outputCode('\t\t\t<img id="ques' + quesNum + 'pho0" class="layer correct" src="' + basePath + answerPhoto0 + '" />\r\n');
		outputCode('\t\t</div>\r\n');
		if (questions[quesNum].sound) {
			outputCode('\t\t\t<div class="sounds">\r\n');
			outputCode('\t\t\t\t<audio class="after" preload="auto" src="' + soundFile + '"></audio>\r\n');
			outputCode('\t\t</div>\r\n');
		}
		outputCode('\t\t<div class="question">' + question + '</div>\r\n');
		outputCode('\t\t<div class="answers">\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="' + answerValue0 + '" value="' + answerValue0 + '" id="ques' + quesNum + 'ans0" name="ques' + quesNum + '" /><label for="ques' + quesNum + 'ans0">' + trueLabel + '</label></div>\r\n');
		outputCode('\t\t\t<div class="answerLine"><input type="radio" class="' + answerValue1 + '" value="' + answerValue1 + '" id="ques' + quesNum + 'ans1" name="ques' + quesNum + '" /><label for="ques' + quesNum + 'ans1">' + falseLabel + '</label></div>\r\n');
		outputCode('\t\t</div>\r\n');
		outputCode('\t\t<div class="response"><span class="answeredWrong">Wrong.</span><span class="answeredCorrect">Right.</span> ' + response + '</div>\r\n');
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

		if (questions[quesNum].quesType === 'multiple 2x2') { outputMultiPhoto(); }
		else if (questions[quesNum].quesType === 'multiple choice') { outputMultiChoice(); }
		else if (questions[quesNum].quesType === 'true/false') { outputTrueFalse(); }

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

		outputCode('\t<div id="scoring">\r\n');
		outputCode('\t\t<div class="photos"><img id="judgment" src="' + basePath + judgmentImg + '" /></div>\r\n');
		outputCode('\t\t<div id="response">' + scoringResponse + '</div>\r\n');
		outputCode('\t</div>\r\n');
		outputCode('</div>\r\r\n');
		outputCode('<div id="credits"><strong>QUIZ BY:</strong> ' + byline + '</div>\r\n');
		outputCode('<div id="sources"><strong>SOURCES:</strong> ' + sources + '</div>\r\r\n');

		// no longer explicitly including this
//		outputCode('<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>\r\r\n');
		outputCode('<script type="text/javascript">\r\n');
		outputCode('\tvar totalQuestions = ' + quesNum + ';\r\n');
		outputCode('\tvar scoringRange = [];\r\n');
		outputCode('\tvar scoringEvaluation = [];\r\n');

		// loops to cycle through all the scoring inputs
		$('.scoringRange').each( function(index) {
			thisRange = $(this).val();
			outputCode('\tscoringRange[' + index + '] = ' + thisRange + ';\r\n');

		});
		$('.evaluation').each( function(index) {
			thisEvaluation = escapeHtml( $(this).val() );
			outputCode('\tscoringEvaluation[' + index + '] = "' + thisEvaluation + '";\r\n');
		});

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
