     $(document).ready(function() {
         

        $('#loading').show();
 
        //Original ajax request for loading first posts 
     //check what page you are on
     if(window.location.href === "https://webdevbootcamp-kilometer.c9users.io/" || window.location.href === "https://webdevbootcamp-kilometer.c9users.io/#_=_" || window.location.href === "https://webdevbootcamp-kilometer.c9users.io/#"){
        $.ajax({
            url: "/infiniteScroll",
            type: "POST",
            cache:false,
            success: function(data) {
                data.forEach(function(content){
                   // console.log(content.postedBy._id);
                    var html = '';
                   html += '<figure id="figure' + content._id + '"><img src="' + content.postImage + '" id="'+ content._id +'" class="uploaded_img">';
                   html += ' </figure>';
                   $("#columns").append(html);
                   $('#loading').hide();
                  // console.log(content);
                });
               
            }
        });
       
    //   $(window).scroll(function() {
    //       var page = $('.columns').find('.nextPage').val();
    //         var noMorePosts = $('.columns').find('.noMorePosts').val();
    //       if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    //           $.ajax({
    //         url: "/infiniteScroll",
    //         type: "POST",
    //         data: "page=" + page,
    //         cache:false,
    //         success: function(data) {
    //             data.forEach(function(content){
    //               // console.log(content.postedBy._id);
    //                 var html = '';
    //               html += '<figure id="figure' + content._id + '"><img src="' + content.postImage + '" id="'+ content._id +'" class="uploaded_img">';
    //               html += ' </figure>';
    //               $("#columns").append(html);
    //               $('#loading').hide();
    //               // console.log(content);
    //               $('.columns').find('.nextPage').remove(); //Removes current .nextpage 
    //               $('.columns').find('.noMorePosts').remove(); //Removes current .nextpage 
                   
                   
    //             });
               
    //         }
    //     }); 
    //       }
    //     });
    
     }else {
                  
                //   var i = $(location).attr('pathname');
                //   console.log(i);
          var display_users_post = $("#display_users_post").val();
          $.ajax({
            url: '/profile/'+ display_users_post,
            type: "post",
            cache:false,
            success: function(data) {
                data.forEach(function(content){
                  // console.log(content.postedBy._id);
                    var html = '';
                  html += '<figure id="figure' + content._id + '"><img src="' + content.postImage + '" id="'+ content._id +'" class="uploaded_img">';
                  html += ' </figure>';
                  $("#columns").append(html);
                  $('#loading').hide();
                  // console.log(content);
                });
               
            }
        });
     }
});