jQuery.noConflict();

jQuery( document ).ready(function($) {
    $('.marketplace', '.home-hero').addClass('selected');
    $('.carousel', '.referral-hero').addClass('selected');
    $('.hero-nav a', '.home-hero').each(function() {
       $(this).on('click', function() {
           var anchorClass = $(this).attr('class').split(" ")[0];
           $('.home-hero .selected').removeClass('selected');
           $('.home-hero .' + anchorClass).addClass('selected');

            if($(this).hasClass('traffic')) {    
                $('.traffic .first .percentage').fadeIn(1000, function() {
                    $('.traffic .third .percentage').fadeIn(1000, function() {
                        $('.traffic .second .percentage').fadeIn(1000);
                    }); 
                });              
            }
       });
    });
    
    $('.marketplace .image-holder img:nth-child(2)', '.home-hero').hide();
    $('.marketplace .image-holder.second', '.home-hero').cycle({
        'timeout': 5000
        });
    $('.marketplace .image-holder.first', '.home-hero').cycle({
        'delay': 2000,
        'timeout': 5000
        });
    $('.marketplace .image-holder.third', '.home-hero').cycle({
        'delay': 4000,
        'timeout': 5000
        });
});