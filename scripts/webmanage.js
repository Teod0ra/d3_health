/**
 * Created by Teodora on 13.05.2016.
 */

$(document).ready(function () {

    $("#navHome").click(function () {
        window.location.href = "../pocetna.html";
    });
    $("#zdravje").click(function () {
        window.location.href = "zdravje.html";

    });
    $("#vakcinacii").click(function () {
        window.location.href = "vakcini.html";
    });
    $("#zastita_patista").click(function () {
        window.location.href = "patista.html";
    });
    $("#test").click(function () {
        window.location.href = "test.html";
    });

});
jQuery(document).ready(function () {
    var offset = 220;
    var duration = 500;
    jQuery(window).scroll(function () {
        if (jQuery(this).scrollTop() > offset) {
            jQuery('.crunchify-top').fadeIn(duration);
        } else {
            jQuery('.crunchify-top').fadeOut(duration);
        }
    });

    jQuery('.crunchify-top').click(function (event) {
        event.preventDefault();
        jQuery('html, body').animate({scrollTop: 0}, duration);
        return false;
    })
});
