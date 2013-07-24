/*
	Author: CORE FED
	NOTE: This file will never contain application-specific code
			Do NOT make changes without approval from OBU UX CORE FED, reach out to ssulli4@searshc.com (Scott j Sullivan), Seth.Thomas@searshc.com or Tim.Ryan@searshc.com
			This is a FED owned file	
*/
/**
 * Namespace for SHC validation functionality.
 * @class SHCVAL
 * @singleton
 */
var SHCVAL = SHCVAL || {},
	errMsgVal = '',
	errMsgOm = '';

/**
 * SHC validation utility functions
 * @singleton
 */
SHCVAL.Util = function () {
	/* private functions until you hit the public ones at the return */

	function flagText(el, status) {
		if (status === "fail") {
			el.removeClass('shcForm_Text').addClass('shcForm_TextError shcForm_Error');
			trackErrorMsg(el);
			return false;
		} else if (status === "pass") {
			el.removeClass('shcForm_TextError shcForm_Error').addClass('shcForm_Text');
			return true;
		}
	}

	function flagGroup(el, status) {
		if (status === "fail") {
			el.removeClass('shcForm_Group').addClass('shcForm_GroupError shcForm_Error');
			trackErrorMsg(el);
			return false;
		} else if (status === "pass") {
			el.removeClass('shcForm_GroupError shcForm_Error').addClass('shcForm_Group');
			return true;
		}
	}

	function trackErrorMsg(el) {
		errMsgVal = $(el).data('errorMessage');
		if (errMsgOm !== null && errMsgOm !== '') {
			errMsgOm = errMsgOm + "," + errMsgVal;
		} else {
			errMsgOm = errMsgVal;
		}
		return errMsgOm;
	}

	function showBubble(flaggedField, formID) {
		var valBubble = $('#shcForm_errorBubble'),
			ctr = flaggedField.parents('.shcForm_Container'),
			failedPos = flaggedField.offset(),
			bubbleLeft = failedPos.left,
			bubbleTop = failedPos.top,
			errorMessageText = flaggedField.data('errorMessage'),
			timedMove = '',
			previousText = valBubble.children('#errorMessage').html(errorMessageText),
			appendTo = 'body';

		if ($('#universalModal').is(':visible')) {
			// if universalModal is present, append errors at same level (inside popup div)
			// to allow conditional styles based on current modal/state visible
			appendTo = $('#universalModal').parent();
		}
		else if (ctr.length) {
			/* Allows client code to declare a positioning container (e.g., a custom modal)
			for error bubbles with "shcForm_Container" class */
			appendTo = ctr.eq(0);
			failedPos = flaggedField.position();
			bubbleLeft = failedPos.left;
			bubbleTop = failedPos.top;
		}

		valBubble.appendTo(appendTo).css({
			left: bubbleLeft,
			top: bubbleTop + flaggedField.height() + parseInt(flaggedField.css('paddingTop'), 10) + parseInt(flaggedField.css('paddingBottom'), 10) + 5
		}).fadeIn(500);
	}

	function getFailed(formID) {
		var keyCount = 0,
			allFailed = '',
			firstFailed = '',
			firstFailedY = '',
			windowPosY = '',
			el2 = '',
			el2In = '',
			el2Sel = '',
			el3 = '',
			timerHover = '',
			failNumber = 0,
			numberMessage = '',
			keyTarget = '';

		allFailed = $(formID).find('.shcForm_Error');
		failNumber = allFailed.length;

		if (failNumber !== 0) {
			if (failNumber === 1) {
				numberMessage = 'One error remains';
			} else {
				numberMessage = failNumber + ' errors remain';
			}

			/* Temporary code change for testing Regional Pricing Phase 3 committed under ECOM-240855  */
			if (!$('#shcForm_ErrorCount').length && $('#pagevalue').val() === 'undefined' && $('#pagevalue').val() !== 'Login') {
				showErrorCount(formID);
			}

			$('#remainingErrors').html(numberMessage);
			$('#shcForm_ErrorCount').fadeIn(250);

			firstFailed = $(allFailed).eq(0);
			firstFailedY = firstFailed.offset().top;
			windowPosY = $(window).scrollTop();

			if ((firstFailedY <= windowPosY) || ($('#pageValue').val() == 'BILLING')) {
				$('html,body').animate({
					scrollTop: firstFailedY - 25
				}, 'slow');
			}

			allFailed.each(function () {
				el2 = $(this);
				if (el2.is('input[type=text], input[type=password]') || el2.is('textarea')) { // changed as part of the fix for ECOM-244543
					if ($(this).attr('keytarget') === undefined) {
						if (el2.val().trim() !== '') {
							$(this).data('keyTarget', '1');
						} else {
							$(this).data('keyTarget', '2');
						}
					} else {
						$(this).data('keyTarget', $(this).attr('keytarget'));
					}
					el2.unbind('keyup.validation').bind('keyup.validation', function () {
						keyCount = $(this).val().trim().length;
						if (keyCount >= $(this).data('keyTarget')) {
							el2.unbind('keyup.validation mouseenter.validation');
							keyCount = 0;
							hideBubble($(this), formID);
						}
					}).bind('mouseenter.validation', function () {
						el3 = $(this);
						timerHover = setTimeout(function () {
							showBubble(el3, formID);
						}, 250);
						el3.bind('mouseleave.validation', function () {
							clearTimeout(timerHover);
						});
					});
					/* TODO: once we upgrade jquery in checkout, change.validation bubbles. Remove el2In and el2Sel at that point. */
				} else if (el2.hasClass('shcForm_GroupError') || el2.is('select')) {
					el2In = el2.find('input');
					el2Sel = el2.find('select');

					el2In.unbind('change.validation').bind($.q('body').hasClass('ie') ? 'propertychange' : 'change.validation', function (e) {
						e.preventDefault();
						hideBubble($(this).parents('.shcForm_GroupError'), formID);
						el2.unbind('change.validation mouseenter.validation');
						el2In.unbind('change.validation');
					});

					el2Sel.unbind('change.validation').bind('change.validation', function () {
						hideBubble($(this).parents('.shcForm_GroupError'), formID);
						el2.unbind('change.validation mouseenter.validation');
						el2In.unbind('change.validation');
					});

					el2.unbind('click.validation')
						.bind('click.validation', function (e) {
							hideBubble($(this), formID);
							el2.unbind('click.validation');
							el2In.unbind('click.validation');
						});

					el2.bind('mouseenter.validation', function () {
						el3 = $(this);
						timerHover = setTimeout(function () {
							showBubble(el3, formID);
						}, 250);
						el3.bind('mouseleave.validation', function () {
							clearTimeout(timerHover);
						});
					});

				} else if (el2.is('td')) {
					el2In = el2.find('input');
					el2In.unbind('change.validation').bind($.q('body').hasClass('ie') ? 'propertychange.validation' : 'change.validation', function (e) {
						e.preventDefault();
						hideBubble($(this).parents('.shcForm_GroupError'), formID);
						el2.unbind('change.validation mouseenter.validation');
						el2In.unbind('change.validation');
					});
				} else if (el2.is('input[type=hidden]')) {
					el2In = el2.find('input');
					el2In.unbind('change.validation')
						.bind($.q('body').hasClass('ie') ? 'propertychange' : 'change.validation', function (e) {
							e.preventDefault();
							hideBubble($(this).parents('.shcForm_GroupError'), formID);
							el2.unbind('change.validation mouseenter.validation');
							el2In.unbind('change.validation');
						});
				}
			});
		} else {
			$('#shcForm_ErrorCount').hide();
			return false;
		}
		showBubble(firstFailed, formID);
	}

	function hideBubble(flaggedField, formID) {
		var valBubble = $('#shcForm_errorBubble'),
			timedMove = '';

		valBubble.fadeOut(250);
		if (flaggedField.hasClass('shcForm_TextError')) {
			flaggedField.removeClass('shcForm_TextError shcForm_Error').addClass('shcForm_Text').unbind('.validation');
		} else if (flaggedField.hasClass('shcForm_GroupError')) {
			flaggedField.removeClass('shcForm_GroupError shcForm_Error').addClass('shcForm_Group').unbind('.validation');
		}
		if (typeof debitCheckInitialize === 'function') {
			debitCheckInitialize();
		}
		timedMove = setTimeout(function () {
			getFailed(formID);
		}, 500);
	}

	/* Public functions below */
	return {
		/**
		 * Remove shcForm class from all inputs in passed element as well as remove all error states, hide bubbles, and hide error counts.
		 * @param {jQuery} thisForm the form element to work with
		 */
		toggleFormOff: function (thisForm) {
			thisForm.find('.shcForm_Text').removeClass('shcForm shcForm_Error').unbind('.validation');
			thisForm.find('.shcForm_TextError').addClass('shcForm_Text').removeClass('shcForm shcForm_TextError shcForm_Error').unbind('.validation');
			thisForm.find('.shcForm_Group').removeClass('shcForm shcForm_Error').unbind('.validation');
			thisForm.find('.shcForm_GroupError').addClass('shcForm_Group').removeClass('shcForm shcForm_GroupError shcForm_Error').unbind('.validation');
			thisForm.find('.shcForm_CheckSet').removeClass('shcForm shcForm_Error').unbind('.validation');
			$('#shcForm_errorBubble').hide();
			$('#shcForm_ErrorCount').hide();
		},

		/**
		 * Add shcForm class to all inputs in passed element, if the element has the class shcForm_Text or shcForm_Group
		 * @param {jQuery} thisForm the form element to work with
		 */
		toggleFormOn: function (thisForm) {
			thisForm.find('.shcForm_Text').addClass('shcForm');
			thisForm.find('.shcForm_Group').addClass('shcForm');
			thisForm.find('.shcForm_CheckSet').addClass('shcForm');
		},

		/**
		 * Run validation on flagged inputs wrapped in the container and run the success callback when the form passes
		 * @param {String} formID id of the form DOM element
		 * @param {Function} [cbSuccess=$.noop] callback after successful form validation
		 * @return {Boolean} true if validations succeeds, else false
		 */
		validate: function (formID, cbSuccess) {
			var formEls = $(formID).find('.shcForm'),
				failedCount = 0,
				pass = [],
				passwords = $(formID).find('input[type=password]'),
				errMsgOm = '';

			$(formEls).each(function () {
				var el = $(this),
					elVal = el.val(),
					valType = '',
					priceValue = '',
					checkBoxes = 0,
					checkBoxesNo = 0,
					checkBoxesError = 0,
					elValClean = '';

				if (el.hasClass('shcEmpty')) {
					valType = 'shcEmpty';
				} else if (el.hasClass('shcEmptyState')) {
					valType = 'shcEmptyState';
				} else if (el.hasClass('shcEmail')) {
					valType = 'shcEmail';
				} else if (el.hasClass('shcForm_MultiEmail')) {
					valType = 'shcForm_MultiEmail';
				} else if (el.hasClass('shcPrice')) {
					valType = 'shcPrice';
				} else if (el.hasClass('shcForm_CheckSet')) {
					valType = 'shcForm_CheckSet';
				} else if (el.hasClass('shcForm_Selects')) {
					valType = 'shcForm_Selects';
				} else if (el.hasClass('shcForm_Select')) {
					valType = 'shcForm_Select';
				} else if (el.hasClass('shcZip')) {
					valType = 'shcZip';
				} else if (el.hasClass('shcName')) {
					valType = 'shcName';
				} else if (el.hasClass('shcIntZip')) {
					valType = 'shcIntZip';
				} else if (el.hasClass('shcPhone')) {
					valType = 'shcPhone';
				} else if (el.hasClass('shcPhoneAlt')) {
					valType = 'shcPhoneAlt';
				} else if (el.hasClass('shcNumber')) {
					valType = 'shcNumber';
				} else if (el.hasClass('shcNumberOpt')) {
					valType = 'shcNumberOpt';
				} else if (el.hasClass('shcPassword')) {
					valType = 'shcPassword';
				} else if (el.hasClass('shcPass')) {
					valType = 'shcPass';
				} else if (el.hasClass('shcDate')) {
					valType = 'shcDate';
				} else if (el.hasClass('shcEmptyAlpha')) {
					valType = 'shcEmptyAlpha';
				} else if (el.hasClass('shcPhoneInt')) {
					valType = 'shcPhoneInt';
				} else if (el.hasClass('shcPhoneAltInt')) {
					valType = 'shcPhoneAltInt';
				} else if (el.hasClass('shcPhoneOpt')) {
					valType = 'shcPhoneOpt';
				} else if (el.hasClass('shcAddress')) {
					valType = 'shcAddress';
				} else if (el.hasClass('shcSYWRNumber')) {
					valType = 'shcSYWRNumber';
				} else if (el.hasClass('shcSYWRMemberNumber')) {
					valType = 'shcSYWRMemberNumber';
				} else if (el.hasClass('shcHidden')) {
					valType = 'shcHidden';
				} else if (el.hasClass('shcScreenNameGuidelines')) {
					valType = 'shcScreenNameGuidelines';
				} else if (el.hasClass('shcEnterpriseId')) {
					valType = 'shcEnterpriseId';
				} else if (el.hasClass('shcSYWRMemberNumber')) {
					valType = 'shcSYWRMemberNumber';
				} else if (el.hasClass('shcMygoferId')) {
					valType = 'shcMygoferId';
				} else if (el.hasClass('shcRepeats')) {
					valType = 'shcRepeats';
				} else if (el.hasClass('shcPaymentBtn')) {
					valType = 'shcPaymentBtn';
				} else if (el.hasClass('shcAlphaNum')) {
					valType = 'shcAlphaNum';
				}else if(el.data('forcedError')===true) {
					valType = 'shcForced';
				}

				switch (valType) {
				case "shcForced":
					/* allows client code to force arbitrary field(s) into error state */
					flagText(el, 'fail');
					failedCount++;
					return true;

				case "shcEmpty":
					/* run empty validation */
					elValClean = elVal.trim();
					if (FED.Util.isEmpty(elValClean)) {
						flagText(el, 'fail');
						failedCount++;
					} else {
						flagText(el, 'pass');
					}
					return true;

				case "shcEmptyState":
					/* run empty validation for State */
					elValClean = elVal.trim();
					if (FED.Util.isEmpty(elValClean)) {
						el.data('errorMessage', 'This field cannot be empty.');
						flagText(el, 'fail');
						failedCount++;
					} else {
						flagText(el, 'pass');
					}
					return true;

				case "shcEmail":
					/* run email validation */
					if (FED.Util.isValidEmail(elVal)) {
						flagText(el, 'pass');
					} else {
						if (FED.Util.isEmpty(elVal)) {
							if (!el.data('errorMessage')) {
								el.data('errorMessage', 'Please enter your email address.');
							}
						} else {
							el.data('errorMessage', 'The email address you enter should follow this format: name@domain.com. Please try again.');
						}
						flagText(el, 'fail');
						failedCount++;
					}
					return true;

				case "shcName":
					/* make sure the user entered their 16 digit SYWR# */
					var validNameEXP = /^[a-zA-Z][a-zA-Z\'\-.]*$/;					
					var nameInput = $(this).val();
					if(nameInput.match(validNameEXP)) {
						flagText(el, 'pass');							
					} else { 					
						el.data('errorMessage','Please enter a name that doesn&#39;t contain numbers, spaces or special characters.');
						flagText(el, 'fail');
						failedCount++;
						return true;
					}
					break;
					

				case "shcForm_MultiEmail":
					/* run multiple email validation separated by ';' */
					var count, vElem, vArray = elVal.split(";");
					for (count = 0; count < vArray.length; count++) {
						vElem = vArray[count];
						if (FED.Util.isValidEmail(vElem)) {
							flagText(el, 'pass');
						} else {
							if (FED.Util.isEmpty(vElem)) {
								if (!el.data('errorMessage')) {
									el.data('errorMessage', 'Please enter email address/es.');
								}
							} else {
								el.data('errorMessage', 'The email address you enter should follow this format: name@domain.com. Please try again.');
							}
							flagText(el, 'fail');
							failedCount++;
						}
					}
					return true;

				case "shcPrice":
					/* run price validation (numeric only for now) */
					priceValue = elVal.replace(/\./g, '');
					if (FED.Util.isNumeric(priceValue)) {
						flagText(el, 'pass');
					} else {
						if (FED.Util.isEmpty(elVal)) {
							el.data('errorMessage', 'Please enter a price');
						} else {
							el.data('errorMessage', 'Please enter a valid price');
						}
						flagText(el, 'fail');
						failedCount++;
					}
					return true;

				case "shcForm_CheckSet":
					/* run at least one checked validation */
					checkBoxes = el.find('input');
					checkBoxesNo = checkBoxes.length;
					checkBoxes.each(function () {
						if (!$(this).is(':checked')) {
							checkBoxesError++;
						}
					});

					if (checkBoxesError === checkBoxesNo) {
						flagGroup(el, 'fail');
						failedCount++;
						return true;
					} else {
						flagGroup(el, 'pass');
						return true;
					}
					break;

				case "shcForm_Selects":
					/* run all required selections validation */
					el.find('select.shcForm_SelectReq').each(function () {
						if ($(this).val() === 'default' || $(this).val() === '') {
							flagGroup(el, 'fail');
							failedCount++;
							return false;
						}
						flagGroup(el, 'pass');
						return true;
					});
					break;

				case "shcForm_Select":
					/* run only one select validation */
					if (elVal === 'default' || elVal === '') {
						flagGroup(el, 'fail');
						el.data('errorMessage', 'Please select an option');
						failedCount++;
						return true;
					} else {
						flagGroup(el, 'pass');
						return true;
					}
					break;

				case "shcSYWRMemberNumber":
					/* make sure the user entered their 16 digit SYWR# */
					var sywrExp = /^[0-9]{16}$/;
					var sywrNumInput = $("#sywrMemberNumber").val();
					// remove whitespace and dashes
					sywrNumInput = sywrNumInput.replace(/ |-/g, '');
					if (sywrNumInput.match(sywrExp)) {
						flagText(el, 'pass');
					} else {
						el.data('errorMessage', 'Please enter a valid 16-digit SYWR Member Number');
						flagText(el, 'fail');
						failedCount++;
						return true;
					}
					break;

				case "shcZip":
					/* run zipcode validation */
					if (FED.Util.isValidZipcode(elVal)) {
						flagText(el, 'pass');
					} else {
						//Adding || (elVal.length !== 5) to show apt error message as per ECOM-267202
						if (FED.Util.isEmpty(elVal) || (elVal.length !== 5)) {
							el.data('errorMessage', 'Please enter your 5-digit ZIP code.');
						} else {
							el.data('errorMessage', 'The 5-digit ZIP code you enter should include only numbers.Please try again.');
						}
						flagText(el, 'fail');
						failedCount++;
					}
					return true;

				case "shcIntZip":
					/* run international zipcode validation */
					var intZipInput = $("#intZip").val();

					if (intZipInput.length >= 1) {
						flagText(el, 'pass');
					} else {
						el.data('errorMessage', 'Please enter a valid Zip/Postal code');
						flagText(el, 'fail');
						failedCount++;
					}
					return true;

				case "shcPassword":
					// run password validation
					var mediumRegex = /^(?!.*(.)\1{3})(?!.*[\s?!])((?=.*[\d])(?=.*[A-Za-z])|(?=.*[^\w\d])(?=.*[A-Za-z])).{6,15}$/
					// 6-15 characters                -  {6,15} 
					// with at least one number, 
					// one uppercase/lowercase alpha  -  (?=.*[\d])(?=.*[A-Za-z])|(?=.*[^\w\d\s])
					// no white space, ! or ?         -  (?!.*[\s!?]) 
					// no single character can 
					// repeat more than 3 times       -  (?!.*(.)\1{3})
					// and does not target any 
					// unique special characters (outside of !?)

					passInput = $("#pword_01");

					//if the alternate input field exists, use it for validation rather than the form field??
					if (passInput.length) {
						el = passInput;
					}

					if (mediumRegex.test(el.val())) {
						flagText(el, 'pass');
					} else {
						el.data('errorMessage', 'Please meet the password requirements.');
						flagText(el, 'fail');
						failedCount++;
					}

					return true;

				case "shcPass":
					/* run confirm password validation */
					passwords.each(function () {
						pass.push($(this).val());
					});
					if (pass[0] === pass[1]) {
						flagText(el, 'pass');
					} else {
						if (FED.Util.isEmpty(elVal)) {
							el.data('errorMessage', 'Please enter a password.');
						} else {
							el.data('errorMessage', 'Passwords do not match. Please try again');
						}
						flagText(el, 'fail');
						failedCount++;
					}
					return true;

				case "shcPhone":
					/* run phone validation */
					if (FED.Util.isValidPhone(elVal)) {
						flagText(el, 'pass');
					} else {
						if (FED.Util.isEmpty(elVal)) {
							el.data('errorMessage', 'Please enter your 10-digit phone number.');
						} else {
							el.data('errorMessage', 'Please enter a valid 10-digit phone number to continue');
						}
						flagText(el, 'fail');
						failedCount++;
					}
					return true;

					/* changes for ECOM-276627 */
				case "shcPhoneInt":
					/* run phone validation for international numbers */

					if (FED.Util.isValidPhone(elVal, true)) {
						flagText(el, 'pass');
					} else {
						if (FED.Util.isEmpty(elVal)) {
							el.data('errorMessage', 'Please enter your phone number.');
						} else {
							el.data('errorMessage', 'Please enter a valid phone number to continue');
						}
						flagText(el, 'fail');
						failedCount++;
					}
					return true;

				case "shcPhoneAltInt":
					/* run alt phone validation for international numbers, if empty pass, if not then validate */

					if (FED.Util.isValidPhone(elVal, true)) {
						flagText(el, 'pass');
					} else {
						if (FED.Util.isEmpty(elVal)) {
							/* if empty, still pass the validation */
							return true;
						} else {
							el.data('errorMessage', 'Please enter a valid phone number to continue');
						}
						flagText(el, 'fail');
						failedCount++;
					}
					return true;

				case "shcPhoneAlt":
					/* run alt phone validation, if empty pass, if not then validate */
					if (FED.Util.isValidPhone(elVal)) {
						flagText(el, 'pass');
					} else {
						if (FED.Util.isEmpty(elVal)) {
							/* if empty, still pass the validation */
							return true;
						} else {
							el.data('errorMessage', 'Please enter a valid 10-digit phone number to continue');
						}
						flagText(el, 'fail');
						failedCount++;
					}
					return true;

				case "shcNumber":
					/* run price validation (numeric only for now) */
					if (FED.Util.isNumeric(elVal)) {
						if (!validateStandards(el, true)) {
							flagText(el, 'fail');
							failedCount++;
						} else {
							flagText(el, 'pass');
						}
					} else {
						if (FED.Util.isEmpty(elVal)) {
							flagText(el, 'fail');
							failedCount++;
						} else {
							if (!validateStandards(el, false)) {
								flagText(el, 'fail');
								failedCount++;
							} else {
								el.data('errorMessage', 'Please enter only numbers.');
								flagText(el, 'fail');
								failedCount++;
							}
						}
					}
					return true;

				case "shcNumberOpt":
					/* run price validation (numeric only for now) */
					if (FED.Util.isNumeric(elVal) || FED.Util.isEmpty(elVal)) {
						flagText(el, 'pass');
					} else {
						el.data('errorMessage', 'Please enter only numbers.');
						flagText(el, 'fail');
						failedCount++;
					}
					return true;

				case "shcPhoneOpt":
					/* run optional phone validation */
					if (FED.Util.isEmpty(elVal) || FED.Util.isValidPhone(elVal)) {
						flagText(el, 'pass');
					} else {
						el.data('errorMessage', 'The phone number you entered is not valid.  Please enter your 10-digit phone number in this format: 5551234567');
						flagText(el, 'fail');
						failedCount++;
					}
					return true;

				case "shcDate":
					/*Date validation in autochedule page */
					if (FED.Util.isEmpty(elVal) || elVal.toLowerCase() === 'date') {
						flagText(el, 'fail');
						failedCount++;
						return false;
					} else {
						flagText(el, 'pass');
					}
					return true;

				case "shcEmptyAlpha":
					/* run empty validation, only alpha */
					elValClean = elVal.trim();
					$(this).val(elValClean);
					if (FED.Util.isEmpty(elValClean)) {
						flagText(el, 'fail');
						failedCount++;
					} else if (hasNumeric(elValClean)) {
						el.data('errorMessage', 'Numbers are not allowed. Please enter only letters.');
						flagText(el, 'fail');
						failedCount++;
					} else if (hasSpecialChars(elValClean)) {
						if (elValClean.length === 1 && hasLetter(elValClean)) {
							flagText(el, 'pass');
						} else {
							el.data('errorMessage', 'Special characters are not allowed. Please enter only letters.');
							flagText(el, 'fail');
							failedCount++;
						}
					} else {
						flagText(el, 'pass');
					}
					return true;

				case "shcSYWRNumber":
					/* To validate SYWR number post SYWR Guest Enhancement */

					if (isSYWRModified) {
						if (FED.Util.isNumeric(elVal)) {
							if (!validateStandards(el, true)) {
								flagText(el, 'fail');
								failedCount++;
							} else {
								flagText(el, 'pass');
							}
						} else {
							if (FED.Util.isEmpty(elVal)) {
								flagText(el, 'fail');
								failedCount++;
							} else {
								if (!validateStandards(el, false)) {
									flagText(el, 'fail');
									failedCount++;
								} else {
									el.data('errorMessage', 'Please enter only numbers.');
									flagText(el, 'fail');
									failedCount++;
								}
							}
						}
					} else {
						flagText(el, 'pass');
					}
					return true;

				case "shcAddress":
					/* run empty validation, not allowing %, <, > */
					elValClean = elVal.trim();
					if (el.prevAll('label:first').children('span').hasClass('fieldRequired') && (FED.Util.isEmpty(elValClean))) {
						flagText(el, 'fail');
						failedCount++;
					} else if (hasSpecialAlpha(elValClean)) {
						el.data('errorMessage', 'Special characters like %, <, >, !, *, $, ` are not allowed. Please enter a valid address.');
						flagText(el, 'fail');
						failedCount++;
					} else {
						flagText(el, 'pass');
					}
					return true;

				case "shcSYWRMemberNumber":
					/* make sure the user entered their 16 digit SYWR# */
					var sywrExp = /^[0-9]{16}$/;
					var sywrNumInput = $("#sywrMemberNumber").val();
					// remove whitespace and dashes
					sywrNumInput = sywrNumInput.replace(/ |-/g, '');
					if (sywrNumInput.match(sywrExp)) {
						flagText(el, 'pass');
					} else {
						el.data('errorMessage', 'Please enter a valid 16-digit SYWR Member Numer');
						flagText(el, 'fail');
						failedCount++;
						return true;
					}
					break;

				case "shcHidden":
					/* run empty validation, not allowing %, <, > */
					hiddenInput = el.find('input.shcHiddenInput');
					if (hiddenInput.val()) {
						flagGroup(el, 'pass');
					} else {
						flagGroup(el, 'fail');
						failedCount++;
					}
					return true;
				case "shcEnterpriseId":
					/* run Enterprise id validation */
					elValClean = elVal.trim();
					if (FED.Util.isEmpty(elValClean)) {
						el.data('errorMessage', 'Please enter your Enterprise ID');
						flagText(el, 'fail');
						failedCount++;
					} else {
						flagText(el, 'pass');
					}
					return true;

				case "shcScreenNameGuidelines":
					/* run empty validation, not allowing %, <, > */
					var el = $('input.shcScreenNameGuidelines'),
						elValue = el.val(),
						elLength = el.val().length,
						elErrorMsg = '',
						redExpToCheck = /^[0-9a-zA-Z\-_.]+$/,
						errorCount = 0;

					// check length is correct
					if (elLength < 2 || elLength > 18) {
						elErrorMsg = elErrorMsg + '2 to 18 characters. ';
						errorCount++;
					}

					// if contains spaces
					if (elValue.indexOf(' ') >= 0) {
						elErrorMsg = elErrorMsg + 'Cannot contain spaces. ';
						errorCount++;
					}

					// check against only letters and numbers, underscors, dashes and periods only
					if (!elValue.match(redExpToCheck)) {
						elErrorMsg = elErrorMsg + 'Letters, numbers, underscores, dashes &amp; periods only.  ';
						errorCount++;
					}

					// show error tooltip
					if (errorCount > 0) {
						//$('#shcForm_errorBubble').css({ 'top' : revSN.offset().top + 35, 'left' : revSN.offset().left }).fadeIn(200).children('p').html(elErrorMsg);
						el.data('errorMessage', elErrorMsg);
						flagGroup(el, 'fail');
						failedCount++;
					} else {
						flagGroup(el, 'pass');
					}
					return true;

				case "shcMygoferId":
					/* run Enterprise id validation */
					elValClean = elVal.trim();
					if (FED.Util.isEmpty(elValClean)) {
						el.data('errorMessage', 'Please enter your Mygofer user ID');
						flagText(el, 'fail');
						failedCount++;
					} else {
						flagText(el, 'pass');
					}
					return true;

				case "shcRepeats":
					/* run Enterprise id validation */
					elValClean = elVal.trim();
					idToCompareWith = el.attr('data-repeats');
					valueToCompareWith = $.trim($('#' + idToCompareWith).val());
					if (!FED.Util.isEmpty(elValClean) && elValClean === valueToCompareWith) {
						flagText(el, 'pass');
					} else {
						el.data('errorMessage', 'Your email addresses don\'t match. Please check the spelling and try again.');
						flagText(el, 'fail');
						failedCount++;
					}

					return true;

				case "shcHidden":
					/* run empty validation, not allowing %, <, > */
					hiddenInput = el.find('input.shcHiddenInput');
					if (hiddenInput.val()) {
						flagGroup(el, 'pass');
					} else {
						flagGroup(el, 'fail');
						failedCount++;
					}
					return true;
				case "shcEnterpriseId":
					/* run Enterprise id validation */
					elValClean = elVal.trim();
					if (FED.Util.isEmpty(elValClean)) {
						el.data('errorMessage', 'Please enter your Enterprise ID');
						flagText(el, 'fail');
						failedCount++;
					} else {
						flagText(el, 'pass');
					}
					return true;

				case "shcMygoferId":
					/* run Enterprise id validation */
					elValClean = elVal.trim();
					if (FED.Util.isEmpty(elValClean)) {
						el.data('errorMessage', 'Please enter your Mygofer user ID');
						flagText(el, 'fail');
						failedCount++;
					} else {
						flagText(el, 'pass');
					}
					return true;

				case "shcRepeats":
					/* run Enterprise id validation */
					elValClean = elVal.trim();
					idToCompareWith = el.attr('data-repeats');
					valueToCompareWith = $.trim($('#' + idToCompareWith).val());
					if (!FED.Util.isEmpty(elValClean) && elValClean === valueToCompareWith) {
						flagText(el, 'pass');
					} else {
						el.data('errorMessage', 'Your email addresses don\'t match. Please check the spelling and try again.');
						flagText(el, 'fail');
						failedCount++;
					}

					return true;
				case "shcPaymentBtn":
					/* run Payment Button validation */
					var paymentLength = el.find('.paymentBtnActive').length;
					if (paymentLength > 0) {
						flagGroup(el, 'pass');
					} else {
						flagGroup(el, 'fail');
						failedCount++;
					}
					return true;

				case "shcAlphaNum":
					/* run alpha numeric validation */
					elValClean = elVal.trim().replace(/\s/g, '');
					var alphaNumRegEx = new RegExp("^[a-zA-Z0-9]+$");
					if (FED.Util.isEmpty(elValClean)) {
						flagText(el, 'fail');
						failedCount++;
					} else if (!alphaNumRegEx.test(elValClean)) {
						el.data('errorMessage', 'Please provide a valid input.');
						flagText(el, 'fail');
						failedCount++;
					} else {
						flagText(el, 'pass');
					}
					return true;

				default:
					return true;
				}
			});

			if (failedCount === 0) {
				$('#shcForm_errorBubble').hide();
				$('#shcForm_ErrorCount').hide();
				if (cbSuccess) {
					// if a success callback exists, run it
					cbSuccess();
				} else {
					// return true at least
					return true;
				}
			} else {
				// validation has failed, move on to make it rain bubbles
				getFailed(formID);
				return false;
			}
		}
	};
}();