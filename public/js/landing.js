$(document).ready(function(){
   //focus mouse pointer on first name
   $('#fname').focus();
   $('#body').css("background-color" , "#000"); //change background color when page loads
   
   $('#howitworksBtn').on('click', function(){
      $('#landing').fadeOut(() => {
          $('#body').css("background-color" , "#fff");
             $('#howitworks').fadeIn(() => {});
      });
   });
   
  $('#loginbtn').on('click', function(){
      window.location.href = "/login";
  });
   
   $('#signupbtn').on('click', function(){
      window.location.href = "/";
   });
   
 //learn more action
  $('a[href*="#"]').on('click', function(event) {
    var target = $(this.getAttribute('href'));
    if( target.length ) {
        event.preventDefault();
        $('html, body').stop().animate({
            scrollTop: target.offset().top
        }, 1000);
    }
  });
  
  $('.section2').fadeIn(1000).delay(10000);
   
});