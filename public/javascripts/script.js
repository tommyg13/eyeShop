$.ajaxPrefilter(function( options, original_Options, jqXHR ) {
    options.async = true;
});

$(document).ready(function () {
    var url = window.location.href;

if(url==="https://eye-shop-gkazikas.c9users.io/checkout" || url ==="https://eye-shop.herokuapp.com/checkout") {
    
   $(".cartDrop").removeClass("dropdown")
   $(".cartDrop a").removeAttr('data-toggle').css("cursor","default");
}
    $("a[href='#top']").click(function() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
});
$(document).on('click', '.cartDrop .dropdown-menu', function (e) {
  e.stopPropagation();
});    
$(".1").css("color","blue");
$("body").on("click",".add",function(e) {
        var url=$(this).data("id");
    
    $.ajax({
       type:"GET",
       url:"/add-to-cart/"+url,
       data: {},
       success: function(data){ 
           animateProduct($("img."+url) , $("#cart"));
        updateCart(data);
     }
     
    });

});

   var filter = $("#filter");
  $(filter).on("submit",function(event) {

    // Stop the browser from submitting the form.
    event.preventDefault();
    var formData = $(filter).serialize();
    // Submit the form using AJAX.
    $.ajax({
      type: "POST",
      url: $(filter).attr("action"),
      data: formData,
      success: function(response) {
        $(".products").html("");  
        $(".pag").hide();
            if(response.length <1) $(".products").append("<p>Κανένα αποτέλεμσα</p>")  
            else {
        for(var i=0; i<response.length; i++) {
            var results="";
            results += 
            "<div class='prodCont animated slideInUp'><a href=/product/"+
            response[i]._id+   
            " ><img class='prodImg "+
           response[i]._id+
            " 'src="+
            response[i].url+ 
            " ></a><p class='prodTitle'><strong>"+
            response[i].brand+
            " </p></strong><p class='prodModel'>"+
            response[i].model +
            "</p><p class='prodPrice'>τιμή: "+
            response[i].price +
            "€</p><button class='add btn btn-danger' data-id='"+response[i]._id+"' ><i class='fa fa-shopping-basket'></i> Προσθήκη στο καλάθι</button></div>";

             $(".products").append(results);
        }
}
      }
    });
  });
  
  $("body").on("click",".query",(function(e) {
    var type=$(this).data("type");
    $.ajax({
      type: "get",
      url: "/query/"+type,
      data: {},
      success: function(response) {
            $(".products").html(""); 
            if(type !=="all")$(".pag").hide();
            else {
                $(".pag").show();
                $(".1").css("color","blue").siblings().css("color","black");
            }
            
        for(var i=0; i<response.length; i++) {
            var results="";
            results += 
            "<div class='prodCont animated slideInUp'><a href=/product/"+
            response[i]._id+   
            " ><img class='prodImg "+
            response[i]._id+
            " 'src="+
            response[i].url+ 
            " ></a><p class='prodTitle'><strong>"+
            response[i].brand+
            "</strong></p><p class='prodModel'>"+
            response[i].model +
            "<p class='prodPrice'>τιμή: "+
            response[i].price +
            "€</p><button class='add btn btn-danger' data-id='"+response[i]._id+"' ><i class='fa fa-shopping-basket'></i> Προσθήκη στο καλάθι</button></div>";

             $(".products").append(results);   
        }
        $("#filter").attr("action","/search/"+type);
      }
    });
  }));
  
  $("body").on("click",".pag a",function(e){
      var number=$(this).text();
      var currPag=$(this).attr("class");
$("."+currPag).css("color","blue").siblings().css("color","black");      
      e.preventDefault();
    $.ajax({
       type:"Get",
       url:"/pagination/"+number,
       data: {},
       success: function(response){ 
             $(".products").html("");  
         for(var i=0; i<response.length; i++) {
            var results="";
            results += 
            "<div class='prodCont animated slideInRight'><a href=/product/"+
            response[i]._id+   
            " ><img class='prodImg "+
            response[i]._id+ 
            " ' src="+
            response[i].url+ 
            " ></a><p class='prodTitle'><strong>"+
            response[i].brand+
            "</strong></p><p class='prodModel'>"+
            response[i].model +
            "<p class='prodPrice'>τιμή: "+
            response[i].price +
            "€</p><button class='add btn btn-danger' data-id='"+response[i]._id+"' ><i class='fa fa-shopping-basket'></i> Προσθήκη στο καλάθι</button></div>";

             $(".products").append(results);   
        }
       }
    });      
  });

    // Get the form.
    var form = $('#contForm');
    // Set up an event listener for the contact form.
$(form).submit(function(event) {
    // Stop the browser from submitting the form.
    event.preventDefault();

// Serialize the form data.
var formData = $(form).serialize();
// Submit the form using AJAX.
$.ajax({
    type: 'POST',
    url: $(form).attr('action'),
    data: formData,
      success: function(response) {
          $(".formMessages").html("");
   if(response.message !=="all goood"){
       $(".formMessages").append("<p class='alert alert-danger'>"+response.message+ "</p>");
          $(".alert-danger").fadeTo(2000, 500).slideUp(500, function(){
               $(".alert-danger").slideUp(1200);
    });   
   } else {
      $(".formMessages").append("<p class='alert alert-success'>Message sent</p>");
        $("#contForm input, #contForm textarea").val("")      
          $(".alert-success").fadeTo(2000, 500).slideUp(500, function(){
               $(".alert-success").slideUp(1200);
    });      
   }    
}});
});

   $("body").on("click",".rem",function(e){
         var url=$(this).data("url");
        
$.ajax({
   type: "GET",
   url: "/clear/"+url,
   data: {},
   success: function(data){
       updateCart(data,"remove");
       
   }});
   });

   $(".quant").on("click",function(e){
         var url=$(this).data("url");
         var classN=$(this).parent().parent().data("id");
    e.preventDefault();
$.ajax({
   type: "GET",
   url: url,
   data: {},
   success: function(data){
if($(".navBar .badge").text()==="1"){
   window.location.href="/cart";        
}  
if(data.items[classN]===undefined) {
    
    $(".cartCont").find("[data-id='" + classN + "']").parent().remove();
    $("span."+classN).text("σύνολο: "+newPrice+"€");
   //$("#"+classN).load(location.href + " #"+classN);
  $(".total p strong").text("σύνολο: " +data.totalPrice+"€");
   $(".navBar").load(location.href + " .navBar");
} else { 
var totalPrice=data.totalPrice;
var newQty=data.items[classN].qty;
var newPrice=data.items[classN].price;
$("input."+classN).val(newQty);
$("span."+classN).text("σύνολο: "+newPrice+"€");
   //$("#"+classN).load(location.href + " #"+classN);
  $(".total p strong").text("σύνολο: " +totalPrice+"€");
   $(".navBar").load(location.href + " .navBar");
   }
   }
 });      
   });
    
});


// function addToCart() {
//             $("body").on("click",".add",function(e) {
//     var url=$(this).data("id");
//     $.ajax({
//       type:"Get",
//       url:"/add-to-cart/"+url,
//       data: {},
//       success: function(data){
                 
//          updateCart(data);
//       }
//     });
// });
// }
function animateProduct(image,cart){


var image_offset = image.offset();
$("body").append('<img src="' + image.attr('src') + '" id="temp" style="width:200px; position: absolute; z-index:9999; top:'+image_offset.top+'px; left:'+image_offset.left+'px" />');
var cart_offset = cart.position();
cart_offset.left+=1550;
var params = {
top : cart_offset.top + 'px',
left : cart_offset.left + 'px',
opacity : 0.0,
width : cart.width(),
height : cart.height()
};
$('#temp').animate(params, 600, false, function () {
$('#temp').remove();
});
}
 
function updateCart(data,helper) {
    if(helper===undefined || data.length===0){
    $(".navBar").load(location.href + " .navBar");
    }
    else {
$(".cartDiv").empty();
  $(".badge").text(data.length);
          var total=0;     
  for(var i=0; i<data.length; i++) {
     
      total+=(data[i].price);
            var results="";
            results +=          
      "<div class='cartbody'><img src='" 
      +data[i].item.url +
      " '/><div class='cartinfo'><span>"
      +data[i].item.brand +
      "</span><span>"
      +data[i].item.model + 
      "</span><span>"
      +data[i].item.price + 
      " € x " 
      +data[i].qty +
      "</span></div><a class='rem' data-url='"
      +data[i].item._id + 
      " '><i class='fa fa-times' aria-hidden='true'></i></a></div>";
      $(".cartDiv").append(results);
        } 
        $(".totalQty").text(total +"€");
    }
   
 }
 $( document ).ajaxComplete(function( event, request, settings ) {
          $("a[href='#top']").click(function() {
  $("html, body").animate({ scrollTop: 0 }, 900);
  return false;
});
});