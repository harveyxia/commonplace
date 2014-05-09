$(document).ready(function () {
    // auto expand text area
    $('.new-quote').on( 'keyup', 'textarea', function (e){
        $(this).css('height', 'auto' );
        $(this).height( this.scrollHeight );
    });
    // $('.new-quote').find( 'textarea' ).keyup(function() {
    //     });
});