
$(document).ready(function(){
 


var com_num;   
var modal = document.getElementById('myModal_upload');
var socket = io();


     
//upload post
$('#upload_feedData').on('click', function(e) {
    e.preventDefault();
     // Get form
    var form = $('#fileUploadForm')[0];

    // Create an FormData object 
    var data = new FormData(form);
      
   
     $.ajax({
      type: "POST",
      enctype: 'multipart/form-data',
      url: "/upload",
      data: data,
      processData: false,
      contentType: false,
     
      success: function (data) {
          //handle sockets
           var postSocketData = {};
           postSocketData.postImage = data[0].postImage;
           postSocketData._id = data[0]._id;
           postSocketData.first_name = data[0].postedBy.first_name;
           postSocketData.photo = data[0].postedBy.photo;
           postSocketData.username = data[0].postedBy.username;
           //emit new post to server
           socket.emit('newPost', postSocketData);//emit to the server
            //display toast message when done uploading
            var x = document.getElementById("toastBar");
             x.className = "show";
             setTimeout(function() {
                 x.className = x.className.replace("show", ""); 
             }, 3000);
             
             //emit a notification
             socket.emit('newPost_Uploaded', postSocketData);
                      //console.log(postSocketData);
        
           //remove data and close modal
          $("#feed_des").val("");
          $("#fileupload").val("");
          $("#click_to_upload").css("display","block");
          $("#mySelectedImage").css("display","none");
          $("#upload_feedData").css("display","none");
          modal.style.display = "none";
      },
      error: function (e) {

          console.log("ERROR : ", e);

      }
  });
  //close the modal
  modal.style.display = "none";
});

 
 
 

//listen to new post
socket.on('newPost', function(postSocketData){
   
   var html = '';
             
   html += '<figure id="figure'+ postSocketData._id +'">';
   html += '<img src="'+ postSocketData.postImage + '" id="'+ postSocketData._id +'" class="uploaded_img">';
   html += '<a style="float:right;color:#bdbdbd;padding:3px;cursor:pointer;" id="feed_option" class="feed_option"><i class="far fa-star"></i></a>';
   html += '</figure>';
   $("#columns").prepend(html);
             
    
   
 });
 

//listen to new post notification
socket.on('newPost_Uploaded', function(postSocketData){
      var html = '';
      
      html += '<div class="post_notif" id="post_notif">';
      html += '<img src="'+ postSocketData.photo +'" style="width:50px;height:50px;border-radius:50px;float:left;">';
      html += '<br><span style="padding-left:15px;">New Post by <a href="/profile/'+ postSocketData.username +'" style="text-decoration:none;">'+ postSocketData.first_name +'</a></span>';
      html += '</div>';
      
      //show notification div
      $("#post_notifications").css("display", "block");
      $("#post_notifications").append(html);
      
       //remove notification
        setTimeout(function() {
                   $("#post_notifications").css("display", "none");
        }, 5000);   
});
        
        
//open modal for commenting
$(document).on('click', ".uploaded_img", function(){
  	var post_id = $(this).attr("id");
  	openModal(post_id);
	   //connect user
   socket.on('connect', function() {
         console.log("user connected");

   });
  
  //emit the join event
  socket.emit('join', post_id, function() {
      console.log("user has joined this post");
  });
});

//open modal function
function openModal(post_id) {
       	  //show loader
    $("#loading_modal").css("display","block");
    modalContent(post_id);
     	//go to the top of the div
    document.getElementById('view_feed_Modal').scrollIntoView(true);
  	 //ajax call to display data
    $.ajax({
    			type: 'get',
    			url: '/comments/' + post_id,
    			success: function(data){
   				com_num = data.Comments.length;
   				//display data per post clicked on
   				showPostData(data, post_id);
  			 //remove loader
       $("#loading_modal").css("display","none");
     
  			},
  			error: function(){
  				  alert("Something went wrong");
  			}
  		});

}
        
function modalContent(post_id){
   	  $("#menu").css("display", "none");
     	$("#columns").css("display", "none");
     	$(".action-buttons").css("display", "none");
     	$(".view_feed_Modal").css("display", "block");
     	
     	
     	//profile
     	$(".profile-sec1").css("display", "none");
     	$(".profile-menus").css("display", "none");
     	//end
     	
     	
     	$(".back_modal").attr("id", post_id);
     	$(".comment_text").attr("id", post_id);
     	$(".likeBtn").attr("id", post_id);
     	$(".dislikeBtn").attr("id", post_id);
}       
        
//comment on post
$(document).on('keypress', ".comment_text", function(event) {
   if(event.which === 13 || event.keyCode === 13) {
       var post_id = $(this).attr("id");
       var comment_text = $(".comment_text").val();
      
       var first_name = $("#users_first_name").val();
       var users_username = $("#users_username").val();
       var img = $("#users_photo").attr("src");
       
       //comment number
   
         //emit data to sever
         socket.emit('createComment', {
             first_name: first_name,
             img: img,
             comment_text: comment_text,
             post_id: post_id,
             users_username: users_username,
             com_num: (com_num === 0 || com_num >=1 ? ++com_num : com_num++)
         }, function(){
             
         });
         
         submitComment(comment_text,post_id );
         //clear input field
         $(".comment_text").val("");
                
       return false;
   } 
   return true;
});
        
function submitComment(comment_text, post_id){
        var data = {};
        data.comment_text = comment_text;
         $.ajax({
         			type: 'post',
         			url: '/comments/' + post_id,
         			data: data,
         			success: function(data){
         			    
         				   
         			},
       			error: function(){
       				alert("Something went wrong");
       			}
       		});
            
                
}       
       
        
function showPostData(data, post_id) {
     //check if post belongs to user
     //display edit and delete buttons for post
     if(data.postedBy._id === $("#users_id").val()){
         var groupBtn = '';
     
          groupBtn += ' <a style="float:right;color:#bdbdbd;cursor:pointer;padding:3px;" id="'+ post_id +'" class="delete_post"><i class="fas fa-trash"></i></a> ';
          groupBtn += ' <a style="float:right;color:#bdbdbd;cursor:pointer;padding:3px;margin-right:15px;" id="'+ post_id +'" class="edit_post"  href="/editPost/'+ post_id +'"><i class="fas fa-pencil-alt"></i></a>';
           
           $(".c").append(groupBtn);  
       //console.log(data.postedBy._id);           
     }          
    //display post image
    $("#i").html('<img src="'+ data.postImage +'" style="width:100%;">');
    $("#comment_Num").html('<i class="far fa-comment"></i> '+ data.Comments.length +' Comment');
    //$("#likeNum").html(data.Likes.length);
    //console.log(data.Likes);
    //check if there is data 
    if(data.Likes.length > 0){
       data.Likes.forEach(function(content){
         console.log(content.Post_id);
          $("#likeNum").text(data.Likes.length);
           //check if user has commented
           if((content.likedBy._id === $("#users_id").val()) && (content.Post_id === post_id)) {
              //user has liked post
              //change class name and color and text and display number 
              $(".likeBtn").css("color", "#ff4444");
              $("#like_text").text("unlike");
              $(".likeBtn").attr("class", "dislikeBtn");
           } 
       });
    } else {
     //change class name and color and text and display number 
              $(".dislikeBtn").css("color", "#01579b");
              $("#like_text").text("like");
              $("#likeNum").text(data.Likes.length);
              $(".dislikeBtn").attr("class", "likeBtn");
    }
    
    var a = '';
        a += 'Posted By';
        a += '<a href="/profile/'+ data.postedBy.username +'" style="text-decoration:none;"> '+ data.postedBy.first_name +' </a>';
    
    $("#post_belongs_to").html(a);
    //console.log(data.createdAt);

     $("#time_post").html(moment(data.createdAt).fromNow());//display time stamp 
    //display comments
    data.Comments.forEach(function(content) {
       // console.log(content);
         
        var html = ''; 
         
        html += '<div style="margin-bottom:50px;" id="comment'+ content._id +'">';
        //check if comment belongs to user signed up
        if($("#users_id").val() === content.commentedBy._id) {
              html += '<span id="'+ content._id +'" class="del_com"><i class="fas fa-trash"></i></span>';
        }
        html += '<img src="'+ content.commentedBy.photo +'"><br>';
        html += '<span><a href="/profile/'+ content.commentedBy.username +'">'+ content.commentedBy.first_name + '</a></span><br><br>';
        html += '<span>'+ content.comment +'</span>';
        html += '</div>';
        
      
        
       return $("#c_1").append(html);
        
    });
}

// //edit post
$(document).on('click', '.delete_post', function() {
    var post_id = $(this).attr("id");
    
    //alert(post_id);
});

$(document).on('click', '.del_com', function() {
   
   var comment_id = $(this).attr("id");
   //delete comment
   $("#comment"+comment_id).fadeOut();
   
   //ajax call
   $.ajax({
         			type: 'post',
         			url: '/comment/' + comment_id + '/delete?_method=DELETE',
         			success: function(data){
         			    console.log(data);
         			    $("#comment"+comment_id).fadeOut();
         			},
         			error: function(){
         				alert("Something went wrong");
         			}
       });
});


$(document).on('click', '.dislikeBtn', function() {
   var post_id = $(this).attr("id");
   var likeNum = parseInt($("#likeNum").text());
   
   //alert(likeNum);
   dislikeDisplay(likeNum);
   
   //ajax call
   $.ajax({
         			type: 'post',
         			url: '/unlike/' + post_id + '?_method=DELETE',
         			success: function(data){
         			    console.log(data);
         			},
         			error: function(){
         				alert("Something went wrong");
         			}
       });
   
});


$(document).on('click', '.likeBtn', function() {
   var post_id = $(this).attr("id");
   var likeNum = parseInt($("#likeNum").text());
   
   //alert(likeNum);
   likeDisplay(likeNum);
   
   
  //console.log($(".dislikeBtn").html());
   //send
   //ajax call
   $.ajax({
         			type: 'post',
         			url: '/like/' + post_id,
         			success: function(data){
         			    console.log(data);
         			},
         			error: function(){
         				alert("Something went wrong");
         			}
       });
});


function dislikeDisplay(likeNum) {
  //change class name and color and text and decrement number 
   $(".dislikeBtn").css("color", "#01579b");
   $("#like_text").text("like");
   likeNum--;
   $("#likeNum").text(likeNum);
   $(".dislikeBtn").attr("class", "likeBtn");
   
   
}

function likeDisplay(likeNum) {
  //change class name and color and text and increment number 
   $(".likeBtn").css("color", "#ff4444");
   $("#like_text").text("unlike");
   likeNum++;
   $("#likeNum").text(likeNum);
   $(".likeBtn").attr("class", "dislikeBtn");
}

//listen to event from server for new comment
socket.on('newComment', function(data) {
  //console.log(data.first_name); 
  //console.log(data.post_id); 
  //send data to client side
   //display comment
       var html = ''; 
         
        html += '<div style="margin-bottom:50px;">';
        html += '<span id="del_com" class="del_com"><i class="fas fa-trash"></i></span>';
        html += '<img src="'+ data.img +'"><br>';
        html += '<span><a href="/profile/'+ data.users_username +'">'+ data.first_name + '</a></span><br><br>';
        html += '<span>'+ data.comment_text +'</span>';
        html += '</div>';
        
        $("#c_1").append(html);
        //increase comment number
        $("#comment_Num").html('<i class="far fa-comment"></i> '+ data.com_num +' Comment');
        
});


$(document).on('click', '.followBtn', function(e) {
    e.preventDefault();
    var id = $(this).attr("id");
    
    //toggle follow btn
    $(".followBtn").text("unfollow");
    $(".followBtn").attr("class", "unfollowBtn");
    //ajax call
     $.ajax({
         			type: 'post',
         			url: '/follow/' + id,
         			success: function(data){
         			    console.log(data);
         			},
         			error: function(){
         				alert("Something went wrong");
         			}
       });
    
    
});

$(document).on('click', '.unfollowBtn', function(e) {
    e.preventDefault();
    var id = $(this).attr("id");
    
    //toggle unfollow btn
    $(".unfollowBtn").text("follow");
    $(".unfollowBtn").attr("class", "followBtn");
     //ajax call
     $.ajax({
         			type: 'post',
         			url: '/unfollow/' + id + '?_method=DELETE',
         			success: function(data){
         			    console.log(data);
         			},
         			error: function(){
         				alert("Something went wrong");
         			}
       });
    
});
      
      
      
      


        
});






