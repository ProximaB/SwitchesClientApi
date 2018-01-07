
// -----------------------------------------
//
// kod wyrzygany przez Bozia z flashboard.pl
// pytania: michal@flashboard.pl
// 
// -----------------------------------------


var speed = 7;

var vector_x;
var vector_y;

var center_x = 0; 
var center_y = 0; 
var mouse_x = 0; 
var mouse_y = 0;
var counter = 0;
var clock = 0;
var bullets_array = [];
var end_game = 0;



var img = $('.hero');
var world = $('.world');
var gas_sprite = $('.gas');

if(img.length > 0){
    var offset = img.offset();
    function mouse(evt){
         center_x = offset.left + (img.width()/2);
         center_y = offset.top + (img.height()/2);
         mouse_x = evt.pageX; 
         mouse_y = evt.pageY;
    }
    $(document).mousemove(mouse);
}

    function game(){
        var bullet_counter = 1;

        function requestGame() {
            clock += 1;
            counter = Math.round(clock*1.6/10)/10;
            if(counter%1 == 0){
                var end = '.0';
            }else{
                var end = '';
            }
            $('h3').text(counter+end);

            if(clock == 100){
                animateBullet(1); 
            }

            if(clock % 600 == 0){
                bullet_counter++;
                animateBullet(bullet_counter); 
            }

		  requestAnimationFrame(requestGame);
		}
		requestGame();
    }


    function fly(){
        var pos_x = 0;
        var pos_y = 0;


        function requestFly() {

            pos_x += (mouse_x - center_x - pos_x) / 10;
            pos_y += (mouse_y - center_y - pos_y) / 10;

            var radians = Math.atan2(pos_x, pos_y);
            var degree = (radians * (180 / Math.PI) * -1); 
            
            vector_x = -Math.sin(radians);
            vector_y = -Math.cos(radians);

            if(end_game != 1){
                img.css('-moz-transform', 'rotate('+degree+'deg)');
                img.css('-webkit-transform', 'rotate('+degree+'deg)');
                img.css('-o-transform', 'rotate('+degree+'deg)');
                img.css('-ms-transform', 'rotate('+degree+'deg)');            
            }


            gas_sprite.css('left',  '+=' + vector_x * speed + 'px');
            gas_sprite.css('top',  '+=' + vector_y * speed + 'px'); 

		  requestAnimationFrame(requestFly);
		}
		requestFly();
    }



    function animateCloud(cloud){
        var cl = $('.cloud' + cloud);

        cl.css('left', Math.round(Math.random()*world.width()));
        cl.css('top', Math.round(Math.random()*world.height()));

        function requestAnimateCloud() {

            cl.css('left',  '+=' + vector_x*speed + 'px');
            cl.css('top',  '+=' + vector_y*speed + 'px');  

            if(cl.offset().left > world.width()) {
                cl.css('left', 0 - cl.width());
                cl.css('top',  '+=' + Math.round(300-Math.random()*600) + 'px');
                //cl.css('opacity', 0.1+Math.random()*0.6);
            }
            if(cl.offset().left < 0 - cl.width()){
                cl.css('left', world.width());
                cl.css('top',  '+=' + Math.round(300-Math.random()*600) + 'px');           
                //cl.css('opacity', 0.1+Math.random()*0.6);
            } 
            if(cl.offset().top > world.height()){
                cl.css('top', 0 - cl.height());
                cl.css('left',  '+=' + Math.round(300-Math.random()*600) + 'px');     
                //cl.css('opacity', 0.1+Math.random()*0.6);             
            } 
            if(cl.offset().top < 0 - cl.height()){
                cl.css('top', world.height());  
                cl.css('left',  '+=' + Math.round(300-Math.random()*600) + 'px');  
                //cl.css('opacity', 0.1+Math.random()*0.6);
            }      
		    globalID = requestAnimationFrame(requestAnimateCloud);
		}
		requestAnimateCloud();
    }



    function animateBullet(blt){

        world.append( '<img class="bullet bullet'+blt+'" src="img/bullet.png" /> ' );

        var bullet = $('.bullet' + blt);

        bullets_array.push(blt);
        // console.log(bullets_array);

        bullet.css('top', -10);
        bullet.css('left', Math.random()*world.width());
        
        var world_center_x = world.width()/2; 
        var world_center_y = world.height()/2;

        var radians = 0;
        var mem = 0;
        var curve = 0;
        var bullet_speed = speed;
        var max_speed = 7.6 + Math.random()*2;
        var curve_speed = 0.024 + blt*0.003;
        curve_speed = Math.round(curve_speed*1000)/1000;
        
        function requestAnimateBullet() {
            if(end_game == 1) speed = bullet_speed = max_speed = 0;

            var offset = bullet.offset();
            var bullet_x = (offset.left) + (bullet.width()/2);
            var bullet_y = (offset.top) + (bullet.height()/2);

            if(bullet_speed < max_speed) bullet_speed += 0.004;

            radians = Math.atan2(world_center_x - bullet_x, world_center_y - bullet_y);

            if(mem - radians > 0.0001){
                curve = curve - curve_speed;
            }else if(mem - radians < -0.0001){
                curve = curve + curve_speed;
            }

            mem = radians;

            var degree = (curve * (180 / Math.PI) * -1); 

            var bullet_vector_x = Math.sin(curve);
            var bullet_vector_y = Math.cos(curve);

            bullet.css('left',  '+=' + (bullet_vector_x*bullet_speed + vector_x*speed ) + 'px');
            bullet.css('top',  '+=' + ( bullet_vector_y*bullet_speed + vector_y*speed ) + 'px'); 

            if(clock % 5 == 0 && end_game != 1) addGas(bullet);

            bullet.css('-moz-transform', 'rotate('+degree+'deg)');
            bullet.css('-webkit-transform', 'rotate('+degree+'deg)');
            bullet.css('-o-transform', 'rotate('+degree+'deg)');
            bullet.css('-ms-transform', 'rotate('+degree+'deg)');

            var explosion_dist = Math.sqrt(Math.pow(world_center_x - bullet_x,2)+Math.pow(world_center_y - bullet_y,2));

            if(explosion_dist < 18 && end_game == 0){
                end_game = 1;
                bullet.remove();

				$.post( "save.php", { scores: counter })
				  .done(function( data ) {
				    // alert( "Data Loaded: " + data );
				});  
                
                alert('BOOM! \nTwój wynik to: '+counter);           
                window.location.reload();
  
            }

		    requestAnimationFrame(requestAnimateBullet);
		}
		requestAnimateBullet();

    }

    function addGas(blt){
                // var gas_sprite = $('.gas');

                var gas_sprite_x = gas_sprite.offset().left;
                var gas_sprite_y = gas_sprite.offset().top;

                var rckt_x = blt.offset().left;
                var rckt_y = blt.offset().top;

                gas_sprite.append( "<div></div>" );
                var g =  $('.gas div:last-child');
                g.css('left', rckt_x-gas_sprite_x);
                g.css('top', rckt_y-gas_sprite_y);

                setTimeout(function(){
                    g.remove();
                }, 800)
    }




// $(document).ready(function() {
    
    fly();
    
    for (i=1;i<=6;i++) { 
        animateCloud(i); 
    }

    game();
     
// });

