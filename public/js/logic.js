$(".add-user").submit(function(event){
    alert("Customer added Successfully");
});

$(".trns-history").hide();
$(".success").hide();
$(".make-t").hide();

$("#btn-his").click(function(){
    $(".trns-history").toggle();
    $(".s-pay").toggle();
    $(".make-t").toggle();
    $(".show-t").toggle();
});

    var sender_ac;
    var recievr_ac;

    $("#senders").change(function()
    {
        sender_ac=$(this).val(); 
    });
    $("#recievers").change(function()
    {
        recievr_ac=$(this).val(); 
    });

    // console.log(amounttosend);
    $("#btn").click(function(){
        
        var amounttosend=$("input").val();
       
        var data={
            account_se:sender_ac,
            account_re:recievr_ac,
            amounttosend:amounttosend
        };
        
        // console.log(this);
    
        console.log(data);
    
        var obj= JSON.stringify(data);

        $.ajax({
            method:"post",
            url: "/pay",
            dataType: "json",
            data: {
                o: obj
            }
        });

        $(".success").fadeIn(500);

        $(".sender").fadeOut(100);
        $(".payh1").fadeOut(100);
        
        
            $("#senders").val("0"); 
      
      
            $("#recievers").val("0"); 
            
            $("input").val("");
    });

    $(".hide-c").hide();

    $(".cstmr").mouseover(function(){
        $(".hide-c").fadeIn(300);
    });
   
    $(".cstmr").mouseleave(function(){
         $(".hide-c").fadeOut(200);
     }); 

     $(".hide-t").hide();

    $(".trns").mouseover(function(){
        $(".hide-t").fadeIn(300);
    });
   
    $(".trns").mouseleave(function(){
         $(".hide-t").fadeOut(200);
     }); 

     $(".make-tr-hide").hide();

     $(".make-tr").mouseover(function(){
        $(".make-tr-hide").fadeIn(300);
    });
   
    $(".make-tr").mouseleave(function(){
         $(".make-tr-hide").fadeOut(200);
     }); 