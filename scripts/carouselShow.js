/**
 * Created by Teodora on 17.09.2016.
 */
$(document).ready(function(){
    $('#showCarousel').on("click", function(){
        console.log('tetette');
        $('#carouselExamples').fadeIn();
        $('html,body').animate({
                scrollTop: $("#carouselExamples").offset().top},
            2000);
    })
});