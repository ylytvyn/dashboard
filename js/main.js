'use strict';

(function($){
	$(document).ready(function(){
		// Users
		var users = [
			{
				username: 'Admin',
				password: 'Qwerty'
			},
			{
				username: 'Joker',
				password: 'Batman'
			}
		],
		alerts = {
			wrongUsername: 'Please, fill right Username first',
			tipPassword: 'Your password is ',
			emptyFields: 'Please fill all fields to proceed authorization',
			noUsername: 'There is no user with such Username found. Please, try again',
			wrongPassword: 'Your password is wrong. PLease, try again'
		};

		// Show password
		$('.login__show-pass').click(function() {
			var elem = $(this).parents('.login__block').find('.login__field');

			elem.attr('type', 'text');

			setTimeout(() => {
				elem.attr('type', 'password');
			}, 3000);
		});

		// Forgot password
		$('.login__forgot').mouseenter(function() {
			var user = $('#username').val(),
				rightUser,
				message;

			rightUser = findUserByUsername(user);

			if (rightUser) {
				message = alerts.tipPassword + rightUser.password;
			} else {
				message = alerts.wrongUsername;
			}

			$(this).append(`<span>${message}</span>`);
		});

		$('.login__forgot').mouseleave(function() {
			$(this).find('span').remove();
		});

		// Validate user
		$('.login__button').click(function() {
			var usernameVal = $('#username').val(),
				passwordVal = $('#password').val(),
				rightUser;

			$('.login__error').remove();
			$('.login__block').removeClass('invalid');

			if (usernameVal == '' || passwordVal == '') {
				showWarning(alerts.emptyFields);
				return;
			}

			rightUser = findUserByUsername(usernameVal);

			if (!rightUser) {
				generateError('#username', alerts.noUsername);

				return;
			}

			if (rightUser.password == passwordVal) {
				$('.login, .dashboard').animate({'top': '-100vh'}, 1500);
			} else {
				generateError('#password', alerts.wrongPassword);
			}
		});

		// Generate error
		function generateError(elem, message) {
			var span = document.createElement('span');

			$(span).addClass('login__error').text(message);
			$(span).insertAfter(elem);

			$(elem).parents('.login__block').addClass('invalid');
		};

		// Show warning message
		function showWarning(message) {
			$('<div/>').addClass('dialog-overlay').appendTo('body');
			$('<div/>').addClass('dialog').html(`<p>${message}</p>`).appendTo('body');

			setTimeout(function(){
				$('.dialog, .dialog-overlay').remove();
			}, 3000);
		}

		// Find user
		function findUserByUsername(userValue) {
			var user;

			$.each(users, (i, item) => {
				if (item.username == userValue) {
					user = item;
					return false;
				}
			});

			return user;
		}
	});
})(jQuery);
