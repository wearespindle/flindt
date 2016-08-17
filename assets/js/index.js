'use strict';

var $ = require('jquery');

class App {

    constructor() {
        this.events();
    }

    events() {
        $('.show--modal').on('click', () => {
            $('.overlay').toggleClass('show');
            $('.modal--wrapper').toggleClass('show');
        });

        $('.modal--close').on('click', () => {
            $('.modal--wrapper').toggleClass('show');
            $('.overlay').toggleClass('show');
            return false;
        });

        $('.range-input-list li').on('click', function() {
            $(this).parent().parent().find('input').val($(this).text());
        });

        $('.feedback-form--range').on('change', function() {
            $(this).parent().find('.range-input-list-output > span').html($(this).val());
        });

        $('body').on('click', '.feedback-form--row-button', function() {
            var $tr    = $(this).closest('.feedback-form--row');
            var $clone = $tr.clone();
            $clone.find('textarea').val('');
            $tr.after($clone);
        });
    }
}

$(() => new App());
