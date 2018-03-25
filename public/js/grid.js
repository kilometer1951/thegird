
$(document).ready(function(){
   
// Get the modal
var modal = document.getElementById('myModal_upload');

// Get the button that opens the modal
var btn = document.getElementById("upload");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close_modalupload")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}
    
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
    $("#feed_des").val("");
        $("#fileupload").val("");
        $("#click_to_upload").css("display","block");
        $("#mySelectedImage").css("display","none");
        $("#upload_feedData").css("display","none");
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        $("#feed_des").val("");
        $("#fileupload").val("");
        $("#click_to_upload").css("display","block");
        $("#mySelectedImage").css("display","none");
        $("#upload_feedData").css("display","none");
    }
}
//end modal 
    
//openand close drop down and actions
$('#dropdownbtn').on('click', function(e){
    e.stopPropagation(); 
    $('.dropdown-menu').css("display", "block");
});


//close any open menu
$(document).click(function(){
    $('.dropdown-menu').css("display", "none");
});

    
$('#menu_body_segment_fav').on('click', function(){
     window.location.href = "/favorites";
});

$('#menu_body_segment_fc').on('click', function(){
     window.location.href = "/fashionchannel";
});
    
    
// ///////done

    
// //profile actions
// $('#feed').on('click', function(){
//     history.pushState(null, null, '/feed');
//     $('a').removeClass('selected');
//     $(this).addClass('selected');
//     $('#columns_profile').fadeIn()
//     $('#favorites_div').fadeOut();
    
// });

// $('#fav').on('click', function(){
//     history.pushState(null, null, '/favorites');
//     $('a').removeClass('selected');
//     $(this).addClass('selected');
//     $('#favorites_div').fadeIn()
//     $('#columns_profile').fadeOut();

// });

    
 

//open message div
$('#newMessage').on('click', function() {
    window.location.href="/message/newMessage"; 
});

$('#message_close_div').on('click', function() {
   $('#message').css("display", "none"); 
});

//go back
$('#message_back').on('click', function() {
   $('#message_sec2').fadeIn();
   $('#message_sec3').fadeOut();
   $('#message_back').fadeOut();
});

//select a user
$('div#message_users').on('click', function() {
    //select the text in the div
    var userToMessageName = $(this).text();
   $('#message_sec2').fadeOut();
   $('#message_sec3').fadeIn();
   $('#userToMessageName').text(userToMessageName);
   //select the image in the div
   var img = $("img:first",this).attr("src");
   $("#userTomessage_img").attr("src",img);
   
   //display close button
   $('#message_back').fadeIn();
   
});

//search from message pupop menu
$('#search_users').on('keyup', function() {
    
});

    
    
    
    
    
//reload page on click on browser navigation buttons
$(window).on('popstate', function() {
  location.reload(true);
});

$('#new_messagebtn').on('click', function() {
   $('#connection_with_user').fadeOut();
   $('#back_1').fadeIn();
   $('#search_for_users_new_message').fadeIn();
   
});
$('#back_1').on('click', function() {
   $('#connection_with_user').fadeIn();
   $('#back_1').fadeOut();
   $('#search_for_users_new_message').fadeOut();
   
});

   

//logout
 $('.logoutDiv').on('click', function(){
     
    window.location.href = "/logout";
 });
  
    
      
      
//logout
$(document).on('click', '.back_modal', function(){
    
    var id = $(this).attr("id");
    
    $("#menu").css("display", "block");
	$("#columns").css("display", "block");
	$(".action-buttons").css("display", "block");
	$(".view_feed_Modal").css("display", "none");
	
	
	//remove modal data
	$("#c_1").html("");
	$("#i").html('');

	
      $(".dislikeBtn").css("color", "#01579b");
      $("#like_text").text("like");
      $("#likeNum").text(0);
      $(".dislikeBtn").attr("class", "likeBtn");
      
      
      	
 	//profile
 	$(".profile-sec1").css("display", "block");
 	$(".profile-menus").css("display", "block");
 	$(".edit_post").css("display", "none");
 	$(".delete_post").css("display", "none");
 	//end
    //scroll back to the div
 	document.getElementById('figure'+id).scrollIntoView(true);
    
});
      

      
      
      
});






