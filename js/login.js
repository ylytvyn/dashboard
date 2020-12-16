'use strict';

(function($) {
    const MESSAGES = {
        noUsername: 'There is no user with such username found. Please, try again.',
        wrongPassword: 'Your password is wrong. Please, try again.',
        emptyFields: 'Please, fill all fields to proceed authorization :)',
        yourPass: 'Your password is: ',
        yourUserNameWrong: `Can't help with password, cause no user detected.`
    };

    const USERS = [
        {
            name: 'Admin',
            password: 'Qwerty'
        },
        {
            name: 'Batman',
            password: 'Joker'
        }
    ];

    let loggedUser = localStorage.getItem('loggedUser');
    
    if (loggedUser) {
        $('body').addClass('success');
    }
    
    // Validate and save user
    $('.login__button').click(function() {
        let username = $('#username').val(),
            password = $('#password').val();

        $('.login__error').remove();
        $('.login__block').removeClass('invalid');

        if (username === '' || password === '') {
            showWarning(MESSAGES.emptyFields);
            return;
        }

        let findedUser = findUser(username);

        if (!findedUser) {
            generateError('#username', MESSAGES.noUsername);
            return;
        }

        if (findedUser.password === password) {
            $('body').addClass('success');
            localStorage.setItem('loggedUser', true);
        } else {
            generateError('#password', MESSAGES.wrongPassword);
        }
        
    });

    // Show Password
    $('.login__show-pass').click(function() {
        let password = $(this).parents('.login__block')
                              .find('.login__field');
        
        password.attr('type', 'text');

        setTimeout(() => {
            password.attr('type', 'password');
        }, 1000);
    });

    // Tooltip Password
    $('.login__forgot').mouseenter(function() {
        let userName = $('#username').val(),
            message,
            findedUser = findUser(userName);

        message = findedUser ? MESSAGES.yourPass + findedUser.password : MESSAGES.yourUserNameWrong;

        $(this).append(`<span>${message}</span>`);
    });

    $('.login__forgot').mouseleave(function() {
        $(this).find('span').remove();
    });

    // Functions
    function findUser(name) {
        let user;

        $.each(USERS, (i, item) => {
            if (item.name === name) {
                user = item;
                return;
            }
        })

        return user;
    }

    function generateError(item, msg) {
        let elem = document.createElement('span');

        $(elem).addClass('login__error')
               .text(msg);

        $(elem).insertAfter(item);

        $(item).parents('.login__block')
               .addClass('invalid');
    }

    function showWarning(msg) {
        $('<div />').addClass('dialog-overlay')
                    .appendTo('body');
        
        $('<div />').addClass('dialog')
                    .html(`<p>${msg}</p>`)
                    .appendTo('body');

        setTimeout(() => {
            $('.dialog-overlay, .dialog').remove();
        }, 1500);
    }

})(jQuery);