jQuery.noConflict();

jQuery( document ).ready(function($) {

    var search_form = $('.navbar .search-container input.form-text');
    search_form.val('Search Here');
    search_form.on('focus', function() {
        var v = $(this).val();
        if(v == 'Search Here') {
            $(this).val('');
        }
    });
    search_form.on('blur', function() {
        var v = $(this).val();
        if(v == '') {
            $(this).val('Search Here');
        }
    });

    $('.form-text').addClass('shcForm_Text');
    $('input[type=password]').addClass('shcPassword');
    $('#edit-field-contact-phone-number-und-0-value').addClass('shcPhone');
    $('#edit-mail').addClass('shcEmail');
});    