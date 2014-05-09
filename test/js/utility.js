$(document).ready(function () {
    console.log('sdfasdf')
    // auto adjust the height of
    $('.new-quote').on( 'keyup', 'textarea', function (e){
        $(this).css('height', 'auto' );
        $(this).height( this.scrollHeight );
        console.log(this.scrollHeight);
    });
    // $('.new-quote').find( 'textarea' ).keyup(function() {
    //     });
});