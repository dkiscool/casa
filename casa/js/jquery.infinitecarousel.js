/*
 * jQuery infinitecarousel plugin
 * @author admin@catchmyfame.com - http://www.catchmyfame.com
 * @version 1.0.1
 * @date July 31, 2009
 * @category jQuery plugin
 * @copyright (c) 2009 admin@catchmyfame.com (www.catchmyfame.com)
 * @license CC Attribution-No Derivative Works 3.0 - http://creativecommons.org/licenses/by-nd/3.0/
 */

(function($){
	$.fn.extend({ 
		infiniteCarousel: function(options)
		{
			var defaults = 
			{
				transitionSpeed : 1500,
				displayTime : 6000,
				textholderHeight : .2,
				displayProgressBar : 1
			};
		var options = $.extend(defaults, options);
	
    		return this.each(function() {
    			var randID = Math.round(Math.random()*100000000);
				var o=options;
				var obj = $(this);

				var numImages = $('img', obj).length; // Number of images
				var imgHeight = $('img:first', obj).height();
				var imgWidth = $('img:first', obj).width();
				var autopilot = 1;
			
				$('p', obj).hide(); // Hide any text paragraphs in the carousel
				$(obj).width(imgWidth).height(imgHeight);
			
				// Build progress bar
				if(o.displayProgressBar)
				{
					$(obj).append('<div id="progress'+randID+'" style="position:absolute;bottom:0;background:#bbb;left:'+$(obj).css('paddingLeft')+'"></div>');
					$('#progress'+randID).width(imgWidth).height(5).css('opacity','.5');
				}
			
				// Move last image and stick it on the front
				$(obj).css({'overflow':'hidden','position':'relative'});
				$('li:last', obj).prependTo($('ul', obj));
				$('ul', obj).css('left',-imgWidth+'px');
			
				// Build textholder div thats as wide as the carousel and 20%-25% of the height
				$(obj).append('<div id="textholder'+randID+'" class="textholder" style="position:absolute;bottom:0px;margin-bottom:'+-imgHeight*o.textholderHeight+'px;left:'+$(obj).css('paddingLeft')+'"></div>');
				var correctTHWidth = parseInt($('#textholder'+randID).css('paddingTop'));
				var correctTHHeight = parseInt($('#textholder'+randID).css('paddingRight'));
				$('#textholder'+randID).width(imgWidth-(correctTHWidth * 1)).height((imgHeight*o.textholderHeight)-(correctTHHeight * 2)).css({'backgroundColor':'#fff','opacity':'0.5'});
				showtext($('li:eq(1) p', obj).html());
			
				// Prev/next button(img) 
				html = '<div id="btn_rt'+randID+'" style="position:absolute;right:0;top:'+((imgHeight/2)-15)+'px"><a href="javascript:void(0);"><img style="border:none;margin-right:2px" src="http://birdiscool.s3.amazonaws.com/haywardhawks/rt.png" /></a></div>';
				html += '<div id="btn_lt'+randID+'" style="position:absolute;left:0;top:'+((imgHeight/2)-15)+'px"><a href="javascript:void(0);"><img style="border:none;margin-left:2px" src="http://birdiscool.s3.amazonaws.com/haywardhawks/lt.png" /></a></div>';
				$(obj).append(html);
			
				// Pause/play button(img)	
				html = '<a href="javascript:void(0);"><img id="pause_btn'+randID+'" src="http://birdiscool.s3.amazonaws.com/haywardhawks/pause.png" style="position:absolute;top:3px;right:3px;border:none" alt="Pause" /></a>';
				html += '<a href="javascript:void(0);"><img id="play_btn'+randID+'" src="http://birdiscool.s3.amazonaws.com/haywardhawks/play.png" style="position:absolute;top:3px;right:3px;border:none;display:none;" alt="Play" /></a>';
				$(obj).append(html);
				$('#pause_btn'+randID).css('opacity','.5').hover(function(){$(this).animate({opacity:'1'},250)},function(){$(this).animate({opacity:'.5'},250)});
				$('#pause_btn'+randID).click(function(){
					autopilot = 0;
					$('#progress'+randID).stop().fadeOut();
					clearTimeout(clearInt);
					$('#pause_btn'+randID).fadeOut(250);
					$('#play_btn'+randID).fadeIn(250);
					showminmax();
				});
				$('#play_btn'+randID).css('opacity','.5').hover(function(){$(this).animate({opacity:'1'},250)},function(){$(this).animate({opacity:'.5'},250)});
				$('#play_btn'+randID).click(function(){
					autopilot = 1;
					anim('next');
					$('#play_btn'+randID).hide();
					clearInt=setInterval(function(){anim('next');},o.displayTime+o.transitionSpeed);
					setTimeout(function(){$('#pause_btn'+randID).show();$('#progress'+randID).fadeIn().width(imgWidth).height(5);},o.transitionSpeed);
				});
				
				// Left and right arrow image button actions
				$('#btn_rt'+randID).css('opacity','.75').click(function(){
					autopilot = 0;
					$('#progress'+randID).stop().fadeOut();
					anim('next');
					setTimeout(function(){$('#play_btn'+randID).fadeIn(250);},o.transitionSpeed);
					clearTimeout(clearInt);
				}).hover(function(){$(this).animate({opacity:'1'},250)},function(){$(this).animate({opacity:'.75'},250)});
				$('#btn_lt'+randID).css('opacity','.75').click(function(){
					autopilot = 0;
					$('#progress'+randID).stop().fadeOut();
					anim('prev');
					setTimeout(function(){$('#play_btn'+randID).fadeIn(250);},o.transitionSpeed);
					clearTimeout(clearInt);
				}).hover(function(){$(this).animate({opacity:'1'},250)},function(){$(this).animate({opacity:'.75'},250)});
			
				function showtext(t)
				{
					// the text will always be the text of the second list item (if it exists)
					if(t != null)
					{
						$('#textholder'+randID).html(t).animate({marginBottom:'0px'},500); // Raise textholder
						showminmax();
					}
				}
				function showminmax()
				{
						if(!autopilot)
						{
							html = '<img style="position:absolute;top:2px;right:18px;display:none;cursor:pointer" src="/js/infiniteCarousel/images/down.png" title="Minimize" alt="minimize" id="min" /><img style="position:absolute;top:2px;right:18px;display:none;cursor:pointer" src="/js/infiniteCarousel/images/up.png" title="Maximize" alt="maximize" id="max" />';
							html += '<img style="position:absolute;top:2px;right:6px;display:none;cursor:pointer" src="/js/infiniteCarousel/images/close.png" title="Close" alt="close" id="close" />';
							$('#textholder'+randID).append(html);
							$('#min').fadeIn(250).click(function(){$('#textholder'+randID).animate({marginBottom:(-imgHeight*o.textholderHeight)-(correctTHHeight * 2)+24+'px'},500,function(){$("#min,#max").toggle();});});
							$('#max').click(function(){$('#textholder'+randID).animate({marginBottom:'0px'},500,function(){$("#min,#max").toggle();});});
							$('#close').fadeIn(250).click(function(){$('#textholder'+randID).animate({marginBottom:(-imgHeight*o.textholderHeight)-(correctTHHeight * 2)+'px'},500);});
						}
				}
				function anim(direction)
				{
					// Fade left/right arrows out when transitioning
					$('#btn_rt'+randID).fadeOut(500);
					$('#btn_lt'+randID).fadeOut(500);
					
					// animate textholder out of frame
					$('#textholder'+randID).animate({marginBottom:(-imgHeight*o.textholderHeight)-(correctTHHeight * 2)+'px'},500);					

					//?? Fade out play/pause?
					$('#pause_btn'+randID).fadeOut(250);
					$('#play_btn'+randID).fadeOut(250);
			
					if(direction == "next")
					{
						// Copy leftmost (first) li and insert it after the last li
						$('li:first', obj).clone().insertAfter($('li:last', obj));	
						// Update width and left position of ul and animate ul to the left
						$('ul', obj)
							.width(imgWidth*(numImages+1))
							.animate({left:-imgWidth*2},o.transitionSpeed,function(){
								$('li:first', obj).remove();
								$('ul', obj).css('left',-imgWidth+'px').width(imgWidth*numImages);
								$('#btn_rt'+randID).fadeIn(500);
								$('#btn_lt'+randID).fadeIn(500);
								if(autopilot) $('#pause_btn'+randID).fadeIn(250);
								showtext($('li:eq(1) p', obj).html());
								if(autopilot)
								{
									$('#progress'+randID).width(imgWidth).height(5);
									$('#progress'+randID).animate({'width':0},o.displayTime,function(){
										$('#pause_btn'+randID).fadeOut(50);
										setTimeout(function(){$('#pause_btn'+randID).fadeIn(250)},o.transitionSpeed)
									});
								}
							});
					}
					if(direction == "prev")
					{
						// Copy rightmost (last) li and insert it after the first li
						$('li:last', obj).clone().insertBefore($('li:first', obj));
						// Update width and left position of ul and animate ul to the right
						$('ul', obj)
							.width(imgWidth*(numImages+1))
							.css('left',-imgWidth*2+'px')
							.animate({left:-imgWidth},o.transitionSpeed,function(){
								$('li:last', obj).remove();
								$('ul', obj).width(imgWidth*numImages);
								$('#btn_rt'+randID).fadeIn(500);
								$('#btn_lt'+randID).fadeIn(500);
								if(autopilot) $('#pause_btn'+randID).fadeIn(250);
								showtext($('li:eq(1) p', obj).html());
							});
					}
				}
				var clearInt = setInterval(function(){anim('next');},o.displayTime+o.transitionSpeed);
				$('#progress'+randID).animate({'width':0},o.displayTime+o.transitionSpeed,function(){
					$('#pause_btn'+randID).fadeOut(100);
					setTimeout(function(){$('#pause_btn'+randID).fadeIn(250)},o.transitionSpeed)
				});
  		});
    	}
	});
})(jQuery);


