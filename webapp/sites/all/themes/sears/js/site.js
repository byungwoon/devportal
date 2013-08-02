jQuery.noConflict();

jQuery( document ).ready(function($) {

    var default_value = 'Search Here';
    var search_form = $('#search-block-form');
    var search_form_input = $('#search-block-form input.form-text');
    
    search_form_input.val(default_value);
    search_form_input.on('focus', function() {
        var v = $(this).val();
        if(v == default_value) {
            $(this).val('');
        }
    });
    search_form_input.on('blur', function() {
        var v = $(this).val();
        if(v == '') {
            $(this).val(default_value);
        }
    });

    search_form.submit(function(e) {
        if(search_form_input.val() === default_value) {
            e.preventDefault();
        }
    });
    
    // for IE, since it doesn't recognize "placeholder"
    
    var login_form = $('#user-login-form');
    var login_form_name = $('#user-login-form #edit-name');
    var login_form_password = $('#user-login-form #edit-pass');
    var default_login_name = 'Username';
    var default_login_password = 'Password';

    login_form_name.val(default_login_name);
    login_form_password.val(default_login_password);
    
    login_form_name.on('focus', function() {
        var v = $(this).val();
        if(v == default_login_name) {
            $(this).val('');
        }
    });
    login_form_name.on('blur', function() {
        var v = $(this).val();
        if(v == '') {
            $(this).val(default_login_name);
        }
    }); 
    
    login_form_password.on('focus', function() {
        var v = $(this).val();
        if(v == default_login_password) {
            $(this).val('');
        }
    });
    login_form_password.on('blur', function() {
        var v = $(this).val();
        if(v == '') {
            $(this).val(default_login_password);
        }
    });       
    
    login_form.submit(function(e) {
        if(login_form_name.val() == default_login_name) {
            login_form_name.val('');
        }
        if(login_form_password.val() == default_login_password) {
            login_form_password.val('');
            
        }
    });
});