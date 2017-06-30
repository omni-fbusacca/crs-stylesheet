 
 function initInfoCarousel() {
 $('.js-carousel').slick({
    dots: true,
    autoplay: true
  });
 }
 
 /**
 * MP-VIDEO Component
 */

function pauseCarousel(){
  $('.js-carousel').slick('slickPause');
}


var mp_video = function () {

        var $body = $('body'),
            playingClass = 'mp-video-playing',
            backdropClass = 'mp-video__backdrop',
            $closeHandle = $('.mp-video__close-handle'),
            $videoOverlay = $('.mp-video').find('.video-overlay');

        var loadYTapiScripts = function () {
            var tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";

            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        };

        var handlePlayClick = function () {
            $('.mp-video__play-handle').on('click', function () {
                           
                
                $('.info-carousel .slick-prev').addClass('hide').removeClass('show');
                $('.info-carousel .slick-next').addClass('hide').removeClass('show');
                
                pauseCarousel();
                setTimeout(pauseCarousel, 1000);
                $('.mp-video__close-handle').show();
                
                var video = $(this).parent('.carousel-text').prev('.container-video-carousel').find('.mp-video-player').data('video');
                //$(this).parent('.container').find('.mp-video-player').append('<iframe id="mp-video-player" src="' +  video + '" frameborder="0" allowfullscreen></iframe>');


                $('<iframe id="mp-video-player" src="' +  video + '" frameborder="0" allowfullscreen></iframe>').ready(function(){
                    $videoOverlay.fadeIn(1000);
                }).appendTo($(this).parent('.carousel-text').prev('.container-video-carousel').find('.mp-video-player'));

                ytPlayer = new YT.Player('mp-video-player', {
                    playerVars: { 'autoplay': 0},
                    events: {
                        'onReady':function(event){
                           
                            var embedCode = event.target.getVideoEmbedCode();

                            /* Non abilito autoplay su mobile */
                            if (!isMobile.any()) {
                                event.target.playVideo();
                            }
                            $closeHandle.removeClass('hidden');
                            
                            var video_data = event.target.getVideoData();
                            var video_name = video_data.title.replace(/\s+/g, '-');
                            //Populate digitalData
                            try {
                                digitalData.page.pageInfo.videoName = video_name; 
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                });          
            });
        };

        var handleCloseClick = function() {
            $body.on('click', '.mp-video__close-handle', function () {
                $('.js-carousel').slick('slickPlay');
                $('.mp-video__close-handle').hide();
                
                var width = $(window).width();
                

                if (width > 999) {
                  $('.info-carousel .slick-prev').addClass('show').removeClass('hide');
                  $('.info-carousel .slick-next').addClass('show').removeClass('hide');
                }
                
                ytPlayer.destroy();

                $videoOverlay.hide();

                $('#mp-video-player').addClass('hidden');
                $closeHandle.addClass('hidden');
                
                console.log('video end');
                try {
                  _satellite.track('videoEnd');
                } catch (e) {
                  console.log(e);
                };
            });
        };

        loadYTapiScripts();
        handlePlayClick();
        handleCloseClick();
    };



function initSmallCarousel() {

    $('.js-small-carousel .third-box').clone().appendTo($('.js-small-carousel .js-third-wrap')).removeClass('third-box');
    $('.js-small-carousel .js-third-wrap').addClass('hidden-box');

    doSmallCarousel();


    var resizeTimer;
    $(window).on('resize', function (e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            doSmallCarousel();
        });
    });
}


function doSmallCarousel(){
    var width = $(window).width();

    if ((width > 767) && (width < 1000)) {

        if($('.js-small-carousel').hasClass('slick-slider') == false) {

            $('.js-small-carousel .third-box').addClass('hidden-box');
            $('.js-small-carousel .js-third-wrap').removeClass('hidden-box');

            $('.js-small-carousel .home-story-box').removeClass('height-355');

            $('.js-small-carousel').slick({
                dots: true,
                autoplay: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplaySpeed: 2000
            });

            $('.home-main-carousel .slick-dots').append("<div class='pause-play-container'><span class='btnPause'><span class='icon-pause'></span></span><span class='btnPlay' style='display:none;'><span class='icon-play'></span></span></div>");


            $('.js-small-carousel .btnPause').off('click').on('click', function () {
                $(this).hide();
                $('.js-small-carousel .btnPlay').show();
                $('.js-small-carousel').slick('slickPause');

            });

            $('.js-small-carousel .btnPlay').off('click').on('click', function () {
                $(this).hide();
                $('.js-small-carousel .btnPause').show();
                $('.js-small-carousel').slick('slickPlay');

            });
        }
    }

    if ((width > 1000)  || (width <= 767)){

        if($('.js-small-carousel').hasClass('slick-slider')){
            $('.js-small-carousel').slick('unslick');
        }

        $('.js-small-carousel .third-box').removeClass('hidden-box');
        $('.js-small-carousel .js-third-wrap').addClass('hidden-box');

        $('.js-small-carousel .one-third .home-story-box').addClass('height-355');

        $('.js-small-carousel .pause-play-container').remove();
    }
}

function initHeader() {

     checkIsDevice();
     $('.js-hamburger-menu').on('click',function(){
         if($(this).hasClass('selected')){
             $(this).removeClass('selected');
             $('.main-navigation.nav-desktop').removeClass('menu-mobile-open');
             $('#overlay-megamenu').removeClass('opened');
             $('body, html').removeClass('fixed-nav-open');
             setTimeout(function(){
                 resetNavMobile();
             },300);
         }else{
             var pTop = $('.main-navigation.nav-desktop .wrap-level.first-level').innerHeight();
             $('.js-upper-link-mobile').css('padding-top', pTop);

             $(this).addClass('selected');
             $('.main-navigation.nav-desktop').addClass('menu-mobile-open');
             $('#overlay-megamenu').addClass('opened');
             $('body, html').addClass('fixed-nav-open');
         }
     });

     $(window).resize(function(){
         waitForFinalEvent(function(){
             checkIsDevice();
         }, 500, "checkIsDevice");
     });
 }


 function checkIsDevice(){
     if($(window).width() < 999 || $('body').hasClass('mobile-device')){
         initNavMobile();

         if($('.main-navigation .main-nav-first-level.active').length > 0){
             closeMegaMenu();
         }
     }else{
         setClickDesktop();
         setHeightMegamenu();

         if($('body').hasClass('fixed-nav-open')){
             closeMenuMobile();
         }
     }
 }



 function closeMenuMobile(){
     $('.main-navigation.nav-desktop .wrap-level').removeClass('move-in').removeClass('move-out').removeClass('overflow-visible');
     $('.main-navigation.nav-desktope').removeClass('menu-mobile-open');
     $('#overlay-megamenu').removeClass('opened');
     $('.js-hamburger-menu').removeClass('selected');
     $('.js-upper-link-mobile').removeAttr('style');
     $('.main-navigation.nav-desktop').removeClass('menu-mobile-open');
     $('body, html').removeClass('fixed-nav-open');
 }


 function setClickDesktop(){
     $('.js-upper-link-mobile').removeAttr('style');

     $('.main-navigation.nav-desktop .item-with-submenu .main-nav-first-level').off('click').on('click', function(e){
         e.preventDefault();
         if($(this).hasClass('active')){
             closeMegaMenu();
         }else{
             $('header').off('click');
             openMegaMenu($(this).closest('.item-with-submenu'));

             $(".dot-point").dotdotdot({
                 ellipsis: '... ',
                 watch: "window",
                 wrap: 'letter'
             });
         }
     });
 }


 function setHeightMegamenu(){
     // var maxHeight = -1;

     // $('.main-nav-sub-menu').removeAttr('style');

     // $('.main-nav-sub-menu').each(function() {
     //     maxHeight = maxHeight > $(this).innerHeight() ? maxHeight : $(this).innerHeight();
     // });

     // $('.main-nav-sub-menu').each(function() {
     //     $(this).css('height',maxHeight);
     // });
     setTimeout(function(){
         var submenuPosition = $('header').height();
         $('.main-nav-sub-menu').css({'top':submenuPosition + 'px'});
    },200);
 }


 function openMegaMenu($btn){
     $('.main-navigation.nav-desktop .main-nav-first-level').removeClass('active');
     $('.main-navigation.nav-desktop .item-with-submenu .main-nav-first-level').removeClass('active');
     $('.main-navigation.nav-desktop .item-with-submenu .main-nav-sub-menu').removeClass('active');

     $('.main-navigation.nav-desktop .main-nav-first-level').removeClass('active');
     $btn.find('.main-nav-first-level').addClass('active');
     $btn.find('.main-nav-sub-menu').addClass('active');
     $('#overlay-megamenu').addClass('opened').on('click',function(){
         closeMegaMenu();
     })


     setTimeout(function(){
         $('header').on('click',function(e){
            if ($(e.target).parents(".second-menu-link").size() || $(e.target).parents(".third-menu").size()) {}
            else { 
              closeMegaMenu();
            }
         });
     },200);


 }

 function closeMegaMenu(){
     $('.main-navigation.nav-desktop .main-nav-first-level').removeClass('active');
     $('.main-navigation.nav-desktop .item-with-submenu .main-nav-first-level').removeClass('active');
     $('.main-navigation.nav-desktop .item-with-submenu .main-nav-sub-menu').removeClass('active');
     $('#overlay-megamenu').removeClass('opened').off('click');
     $('header').off('click');
 }

 function resetNavMobile(){
     //$('.main-navbar-mobile li.dropdown-item').removeClass('active');
     $('.main-navigation.nav-desktop .wrap-level').removeClass('move-in').removeClass('move-out').removeClass('overflow-visible');
     $('.main-navigation.nav-desktope').removeClass('menu-mobile-open');
     $('#overlay-megamenu').removeClass('opened');
     $('.js-hamburger-menu').removeClass('selected');
     $('.js-upper-link-mobile').removeAttr('style');

     var pTop = $('.main-navigation.nav-desktop .wrap-level.first-level').innerHeight();
     $('.js-upper-link-mobile').css('padding-top', pTop);
 }

 function initNavMobile(){

     $('.main-navigation.nav-desktop .main-nav-sub-menu').removeAttr('style');

     $('.main-navigation.nav-desktop .item-with-submenu .main-nav-first-level').off('click');

     $('.main-navigation.nav-desktop li.item-with-submenu > a').off('click').on('click',function(e){
         e.stopPropagation();

         var levelTop = $(this).closest('.wrap-level');
         var levelNext = $(this).next('.wrap-level');


         if(levelNext.hasClass('second-level')){
             //$(this).parent('li').addClass('active');

             levelTop.addClass('overflow-visible').addClass('move-out');
             levelNext.addClass('move-in');
         }

         var pTop = levelNext.children().innerHeight();
         $('.js-upper-link-mobile').css('padding-top', pTop);


     });

     $('.main-navigation.nav-desktop .second-menu-link .link-third-level').off('click').on('click',function(e) {
         e.stopPropagation();

         var levelTop = $(this).closest('.wrap-level');
         var levelNext = $(this).closest('.second-menu-link').next('.wrap-level');


         if (levelNext.hasClass('third-level')) {
             //$(this).parent('li').addClass('active');

             levelTop.addClass('overflow-visible').addClass('move-out');
             levelNext.addClass('move-in');
         }

         var pTop = levelNext.children().innerHeight();
         $('.js-upper-link-mobile').css('padding-top', pTop);
     });


     $('.main-navigation.nav-desktop .js-btn-back-level').off('click').on('click',function(e){
         e.stopPropagation();


         if($('.main-navigation.nav-desktop .second-level.move-in').hasClass('move-out') == false){
             /* Secondo livello */
             //$('.main-navigation.nav-desktop .first-level .wrap-tablet > ul > li.dropdown-item').removeClass('active');

             var levelNow = $('.main-navigation.nav-desktop .second-level.move-in');
             var levelTop = levelNow.parent().closest('.wrap-level');


             levelTop.removeClass('move-out');

             setTimeout(function(){
                 levelNow.removeClass('move-in');
                 levelTop.removeClass('overflow-visible');
             },300);
         }else{
             /* Terzo livello */
             //$('.main-navigation.nav-desktop .second-level > ul > li.dropdown-item').removeClass('active');
             var levelNow = $('.main-navigation.nav-desktop .third-level.move-in');
             var levelTop = levelNow.parent().closest('.wrap-level');

             levelTop.removeClass('move-out');

             setTimeout(function(){
                 levelNow.removeClass('move-in');
                 levelTop.removeClass('overflow-visible');
             },300);
         }

         var pTop = levelTop.children().innerHeight();
         $('.js-upper-link-mobile').css('padding-top', pTop);

     })
 }


 function initSearchOverlay(){
    $(".item-search a .icon-search-01, .js-search-menu").on("click",function(){
        $(".overlay-search").addClass("opened");
    });
    $(".overlay-search-input .btn-close").on("click",function(){
        $(".overlay-search").removeClass("opened");
    });
 }
 function initAppendMobile(){
    if($(".upper-link .nav.navbar-nav li").length <=0){
        $(".upper-header-nav ul li").each(function(){
            $(this).clone().appendTo($(".upper-link .nav.navbar-nav"));
                $(".nav.navbar-nav .item-location").remove();
                $(".nav.navbar-nav .item-search").remove();
        });
    }
 }
function initCountTextarea (){
     var text_max = 500;
    $('.textarea_feedback').html(text_max);

    $('#textarea').keyup(function() {
        var text_length = $('#textarea').val().length;
        var text_remaining = text_max - text_length;

        $('.textarea_feedback').html(text_remaining);
    });
}
function initThreeSteps() {
    $(".three-steps .single-step").on('click',function () {

        $(this).addClass('opened').siblings().removeClass('opened'); 

    });
};
function initTabs() {
    $('.tabs-container li span').click(function () {
        var tab_id = $(this).parent('li').attr('data-tab');

        $('.tabs-container li').removeClass('current');
        $('.tab-content-product').removeClass('current');

        $('.tabs-container li span').removeClass('current');
        $(this).addClass('current');
        $("#" + tab_id).addClass('current');
    });

    $('.select-tab').change(function () {
        $('.tab-content-product').removeClass('current');
        $('#' + $(this).val()).addClass('current');
    });
}

function initChangeImgProduct() {
/*
    $('#products-thumbs').on( "click", "img", function() {
        $('#products-large-image').attr('src', $(this).attr('data-large'));
    });
*/
}


function initMobileProductCarouselOnResize() {
    var resizeTimer;
    $(window).on('resize', function (e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
           initMobileProductCarousel();
        });
    });
}


function initMobileProductCarousel() {
    var width = $(window).width();

    var carouselExist = $('.js-mobile-product-carousel .slick-slide').length;

    if ((width < 767) && (carouselExist <= 0) ) {

        $('.js-mobile-product-carousel').slick({
            dots: true,
            autoplay: true,
            arrows: false
        });
        setTimeout(function(){
            $('.product-mobile-carousel .slick-slide').each(function(){
                $(this).magnifik();
                var $element = $(this);
                var openingEvent = 'magnifik:opening';
                var closedEvent = 'magnifik:close';
                $element.on(openingEvent, function(event) {
                    $('.js-mobile-product-carousel').slick('slickPause');
                });
                $element.on(closedEvent, function(event) {
                    $('.js-mobile-product-carousel').slick('slickPlay');
                });
            });
        },200);
    }

    if ((width > 767) && (carouselExist > 0) ) {
        $('.js-mobile-product-carousel').slick('unslick');
    }
}

function initZoomImage (){
//initiate the plugin and pass the id of the div containing gallery images
    $("#products-large-image").elevateZoom({gallery:'products-thumbs'
                                            , cursor: 'pointer'
                                            , galleryActiveClass: 'active'
                                            , imageCrossfade: true
                                            , zoomWindowOffetx: -10
                                            // , zoomWindowWidth: 390
                                            // , zoomWindowHeight: 390
                                        });

    //pass the images to Fancybox
    $("#products-large-image").bind("click", function(e) {
      var ez =   $('#products-large-image').data('elevateZoom');
        $.fancybox(ez.getGalleryList());
      return false;
    });
}

function initShareOverlay() {
	jQuery(".overlay-share").on("click",function() {
		jQuery(".overlay-share-box").addClass("opened");
	});
	jQuery(".social-share-box .close-btn").on("click",function() {
		jQuery(".overlay-share-box").removeClass("opened");
	});
}
function initMediaVideo() {
	$(".current-video").each(function(){
		$(this).on("click",function(){
			var thisAttrVideo = $(this).attr("data-video");
			var iframe = document.createElement("iframe");
		    iframe.setAttribute("src", "//www.youtube.com/embed/" + thisAttrVideo + "?enablejsapi=1&amp;modestbranding=1&amp;autoplay=1&amp;showinfo=0&amp;rel=0");
		    iframe.setAttribute("frameborder", "0");
		    iframe.setAttribute("allowfullscreen","1");
		    iframe.setAttribute("id", "youtube-iframe");
		 	if($("#youtube-iframe").length > -1 ){
		 		$("#youtube-iframe").remove();
		 		$('.media-container-video[data-video-container='+thisAttrVideo+']').append(iframe);
		 	}
		 	else{
				$('.media-container-video[data-video-container='+thisAttrVideo+']').append(iframe);

			}
		});
	});
	$(".video-modal .icon-close").each(function(){
		$(this).on("click",function(){
			$("#youtube-iframe").remove();
		});
	});
	$(document).on("click",function (e) {
		var $videoModal = $('.video-modal');
  		if ($videoModal.is(e.target)){
  			$("#youtube-iframe").remove();
  		}
	});
}

function initComparisonCarousel() {
	/* Globals */
	//console.clear();
	var slider_container = $('.comparison-carousel-box');
	var carousel_options = {
		infinite: false,
		slidesToShow: 3,
		slidesToScroll: 1,
		speed: 300,
		responsive: [{
			breakpoint: 1000,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
				infinite: false
				}
			},
			{
			breakpoint: 768,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
			}
		]
	};

	/* Functions - Methods */

	function construct_slider(element, options){
		$element = $(element);
		var slider = $element.slick(options);
		$slider = $(slider);


	return $slider;
	}

	function checkUncheck(slider) {
		$slider = $(slider);
		$slider.slick('slickUnfilter');
		var slide_arr = [];
		var slide_str = '';


		$('.hide-products-checkbox').each(function(){
			var check = $(this).prop('checked');
			var slide = $(this).attr('data-hide-item');
			if(!check) {
				slide_arr.push(slide);
			}
		});
		if(slide_arr != []) {
			var lngth = slide_arr.length;
			$(slide_arr).each(function(key, value){
				if((key + 1) == lngth){
					slide_str += value;
				}
				else {
					slide_str += value + ', ';
				}
			});
			$slider.slick('slickFilter',':not(' + slide_str + ')');
		}
	}

	function setHeights() {
		var win_wid = $(window).width();
		if(win_wid >= 768) {
			var the_highest = null;
			$('.comparison-box-image-section').height('initial');
			$('.comparison-box-image-section').each(function(key, value){
				// $(this).css({'background':'#f00'});
				// alert('Go on..');
				if(key == 0){
					the_highest = $(this);
				}
				else if( $(the_highest).height() < $(this).height() ) {
					the_highest = $(this);
				}
				//console.log(the_highest);
			});

			$('.comparison-box-image-section').height( $(the_highest).height() );

			$('.comparison-box-filters-section').each(function(key, value){

				$('.comparison-filter-box').each(function(key, value){
					if(key == 0){
						the_highest = $(this);
					}
					else if( $(the_highest).height() < $(this).height() ) {
						the_highest = $(this);
					}
				});

				$('.comparison-filter-box').height( $(the_highest).height() );
			});

			$('.comporation-wrapper-left .comparison-box-filters-section > .category-box').each(function(){
				var rows = $(this).find('[data-category-row]').length;
				var category_number = $(this).data('box-category');
					var the_highest = null;
				/*console.log(rows);*/
				for(var i = 0; i < rows; i++) {
					$('.prod-comparison-left.category_' + category_number + ' [data-category-row="' + (i+1) + '"], .prod-comparison-left[data-box-category="' + category_number + '"] [data-category-row="' + (i+1) + '"]').each(function(key, value){
						// console.log( $(this) + ' cat ---> ' + category_number + ' row ---> ' + (i+1) );

						if(key == 0){
							the_highest = $(this);
						}
						else if( $(the_highest).height() < $(this).height() ) {
							the_highest = $(this);
						}

					// console.log( $(the_highest).height() );

					});
					$('.prod-comparison-left.category_' + category_number + ', .prod-comparison-left[data-box-category="' + category_number + '"]').find('[data-category-row="' + (i+1) + '"]').css({'height':$(the_highest).height() + 'px'});
				}
			});

			// Old Back up
			// $('.comporation-wrapper-left .comparison-box-filters-section > .category-box').each(function(){
			// 	var rows = $(this).find('[data-category-row]').length;
			// 	/*console.log(rows);*/
			// 	var example = $(this);
			// 	$('.prod-comparison-left.category_' + $(this).data('box-category')).each(function(){
			// 		var copy = $(this);
			// 		for(var i = 0; i < rows; i++) {
			// 			$(copy).children('.category-inner-wrap').children('[data-category-row="' + (i+1) + '"]').css({'height':$(example).children('.category-inner-wrap').children('[data-category-row="' + (i+1) + '"]').height() +'px' });
			// 		}
			// 	});
			//
			//
			// });

		}
		else {
			$('.comparison-box-image-section').height('initial');
			$('.prod-comparison-left.category_' + $(this).data('box-category')).css({'height':'auto', 'min-height':'26px'});
			$('[data-category-row]').css({'height':'auto', 'min-height':'26px'});
		}
	}


	/* Bindings */

	function bindElements() {
		$('.comparison-carousel-box .remove-slide').click(function(){
			$element = $(this);

			var indx = $element.closest('.comparison-box').attr('id');
			var indx = indx.replace('prod-','');
			$('#c' + indx).prop('checked',false);
			checkUncheck(slider_container);
			checkboxCounter();
		});


		$('.hide-products-checkbox').change(function(){
			checkUncheck(slider_container);
			checkboxCounter();
		});

		// $('.comporation-wrapper-left .icon-close').click(function(){
		$('.icon-close:not([data-dismiss="modal-custom"])').click(function(){
			var target = $(this).data('target');
			if($(this).hasClass('category-closed')) {
				$(target).slideDown(300);
				$(target).closest('.prod-comparison-left').addClass('side-lined');
				$(target).parent().children('.icon-close').removeClass('category-closed');
			}
			else {
				$(target).slideUp(300);
				$(target).closest('.prod-comparison-left').removeClass('side-lined');
				$(target).parent().children('.icon-close').addClass('category-closed');
			}
		});

		// $('.comparison-carousel-box .icon-close').click(function(){
		// 	var target = $(this).parent().children('.category-inner-wrap');
		// 	$(target).slideToggle(300);
		// 	$(this).toggleClass('category-closed');
		// 	setHeights();
		// });

		// $(slider_container).on('init',
		// setHeights()
		// );
	}
	function checkboxCounter(){
		var totalCheckbox = $('.hide-products-checkbox:checked').length;
		$('.comporation-wrapper-left .comparison-box-filters-section .icon-close').each(function(){
			var target = $(this).data('target');
			if($(this).hasClass('category-closed')) {
				$('.comparison-carousel-box .slick-slide '+target).hide();
				$('.comparison-carousel-box .slick-slide '+target).closest(".category-box").removeClass('side-lined');
				$('.comparison-carousel-box .slick-slide '+target).closest(".category-box").find('.icon-close').addClass('category-closed');
				setHeights();
			}
			else{
				$('.comparison-carousel-box .slick-slide '+target).show();
				$('.comparison-carousel-box .slick-slide '+target).closest(".category-box").addClass('side-lined');
				$('.comparison-carousel-box .slick-slide '+target).closest(".category-box").find('.icon-close').removeClass('category-closed');
				setHeights();
			}
		});
	}
	$(document).ready(function(){
		$slider = construct_slider( slider_container, carousel_options);
		bindElements();
		setTimeout(function(){
             setHeights()
         },50);
	});

	var TO = false;
	$(window).resize(function(){
	 if(TO !== false)
	    { clearTimeout(TO); }
	 TO = setTimeout(setHeights, 1500);
	});

}

function initHearingAid() {

    $(document).ready(function(){
        $('[name="image-step-1-check"]').val($('.image-step-1-check').val());

        $('[name="bar-step-2-check"]').val($('.bar-step-2-check').val());

        $('[name="image-step-3-check"]').val($('.image-step-3-check').val());

        $('[name="bar-step-4-check"]').val($('.bar-step-4-check').val());

        $('[name="image-step-5-check"]').val($('.image-step-5-check').val());
    });

    /* Questionaire Globals */

    $('[data-current-question-page][data-question-page] .pagination-bar a').click(function(event) {
        event.preventDefault();
        if( !$(this).hasClass('deactivate') ) {
            var destination = $(this).data('direction-question');
            var currentpage = $(this).closest('[data-question-page]').data('question-page');

            if( destination != 'final' ) {

                $('[data-question-page="' + currentpage + '"]').attr('data-current-question-page', false).fadeOut(100, function(){
                    $('[data-question-page="' + destination + '"]').attr('data-current-question-page', true).fadeIn(100, function(){
                        $('body, html').animate({scrollTop: ($('[data-question-page="' + destination + '"] .aid-finder-profile').offset().top - 80) });
                    });
                });
            }
            else {
                window.location.href = $(this).attr('href');
            }
        }
    });

    $('[data-step-type="bar"] .one-of-five-xs .hearing-step-input-box').hover(function(){
        var page = $(this).closest('[data-question-page]').data('question-page');
        var valore = $(this).find('.bar-step-' + page + '-check').val();
        for(var i=0;i < valore;i++){
            $('#bar-step-' + page + '-check' + ( i + 1 ) ).addClass('check-hovered');
        }
    }, function(){
        var page = $(this).closest('[data-question-page]').data('question-page');
        $('.bar-step-' + page + '-check').removeClass('check-hovered');
    });


    $('.step-check').change(function(){
        var type = $(this).closest('[data-question-page]').data('step-type');
        var page = $(this).closest('[data-question-page]').data('question-page');
        if(type=='image') {
            var inp_array = [];
            $('.' + type + '-step-' + page + '-check').each(function(){
                if($(this).prop('checked') == true){
                    inp_array.push( $(this).val() );
                }
            });
            $('[name="' + type + '-step-' + page + '-check"]').val(inp_array);
            if(inp_array.length != 0){
                $('[data-question-page="' + page + '"] .next-question').removeClass('deactivate');
            }
            else {
                $('[data-question-page="' + page + '"] .next-question').addClass('deactivate');
            }
        }
        else if(type=='bar') {
            $('.' + type + '-step-' + page + '-check').prop("checked", false);
            var valore = $(this).val();
            for(var i=0;i < valore;i++){
                $('#' + type + '-step-' + page + '-check' + ( i + 1 ) ).prop("checked", true);
            }
            $('[name="' + type + '-step-' + page + '-check"]').val(valore);
            if(valore != []){
                $('[data-question-page="' + page + '"] .next-question').removeClass('deactivate');
            }
            else {
                $('[data-question-page="' + page + '"] .next-question').addClass('deactivate');
            }
        }
    });
}

function initFaqAccordion() {

    $('.faq-accordion-question').click(function () {
        if (!$(this).hasClass('question-open')) {
            $($(this).data('parent')).find('.faq-accordion-answer').removeClass('answer-open').slideUp(300);
            $('.answer-body.text-completed').removeClass('opened');
            $($(this).data('target')).addClass('answer-open');
            $($(this).data('target')).slideDown(300);
            $('.faq-accordion-question').removeClass('question-open');
            $(this).addClass('question-open');
            $($(this).data('target')).find('.answer-body.dot-point').trigger('update');
            if($('.faq-accordion-answer.answer-open').find('.answer-body.dot-point').hasClass('is-truncated')){
                $('.faq-accordion-answer.answer-open .js-expand-link').show();
            }else{
                $('.faq-accordion-answer.answer-open .js-expand-link, .faq-accordion-answer.answer-open .js-collapse-link').hide();
            }
        }
        else {
            $(this).parent().find('.faq-accordion-answer').removeClass('answer-open').slideUp(300);
            $(this).removeClass('question-open');
        }
    });


    $('.js-expand-link').on('click',function(e){
        e.preventDefault();

        var wrapper =  $(this).closest('.right-text-section');
        wrapper.find('.answer-body.dot-point').addClass('opened').trigger("destroy");

        $('.faq-accordion-answer.answer-open .js-collapse-link').show();
        $(this).hide();
    });

    $('.js-collapse-link').on('click',function(e){
        e.preventDefault();

        var wrapper =  $(this).closest('.right-text-section');
        wrapper.find('.answer-body.dot-point').removeClass('opened');
        initEllipsis();

        $('.faq-accordion-answer.answer-open .js-expand-link').show();
        $(this).hide();
    });


    $('#search-criteria').keyup(function(event){
        if(event.keyCode == 13){
            $(".js-btn-search-faq").trigger('click');
            $('.js-btn-search-faq').focus();
        }
    });

    var source = createSuggestion();
    initSearchFaq(source);

    initFaqFilter();


    setTimeout(checkExpand, 500);

    $(window).resize(function () {
        waitForFinalEvent(function(){
            checkExpand();
        }, 500, "checkExpand");
    });


    initPaginatorFaq();
}


function checkExpand(){
    if($('.faq-accordion-answer.answer-open').find('.answer-body.dot-point').hasClass('is-truncated')){
        $('.faq-accordion-answer.answer-open .js-expand-link').show();
    }else{
        $('.faq-accordion-answer.answer-open .js-expand-link, .faq-accordion-answer.answer-open .js-collapse-link').hide();
    }
}


function createSuggestion(){
    var source = [];

    $.each($('.js-faq-question'),function(){
        var text = $(this).text().replace(/"/g, '\"');
        source.push(text.trim());
    });

    return source;
}


function initSearchFaq(source) {
    var numeroCaratteriMinimo = 1;

    $('#search-criteria').typeahead({
        hint: true,
        highlight: true,
        minLength: 1
    },
    {
        name: 'source',
        source: substringMatcher(source)
    });


    $('.js-btn-search-faq').on('click',function(){
        $(".js-filter-faq .filter-container .filter-tab li.active").removeClass('active');
        var txt = $('#search-criteria').val();

        var conto = 0;
        if(txt != ""){
            if (txt.length > numeroCaratteriMinimo - 1) {
                $('.faq-accordion-container').hide().removeClass('filtered')

                $('.faq-accordion-container').each(function () {
                    if ($(this).text().toUpperCase().indexOf(txt.toUpperCase()) != -1) {
                        $(this).show().addClass('filtered');
                        conto++
                    }
                });

                // evidenzia il testo cercato
                var options = {
                    "ignoreJoiners": true,
                    "separateWordSearch": false
                };
                $(".faq-accordion-container").unmark().mark(txt, options);
            } else {
                $('.faq-accordion-container').show().addClass('filtered');
            }


            if(conto > 0){
                $('.faq-no-results').addClass('hide');
                initPaginatorFaq();
                gotoPageFaq(1);


            }else{
                $('.js-faq-pagination').addClass('hide');
                $('.faq-no-results .word-search').html('<strong>'+ txt +'</strong>');
                $('.faq-no-results').removeClass('hide');
            }

            slidePageToFaq();
        }
    });
}


function slidePageToFaq(){
    if($('body').hasClass('mobile-device')){
        $('html, body').animate({
            scrollTop: $('.js-filter-faq').offset().top - $('header').innerHeight()
        }, 400);
    }else{
        $('html, body').animate({

            scrollTop: $('.js-filter-faq').offset().top
        }, 400);
    }
}

var substringMatcher = function(strs) {
    return function findMatches(q, cb) {
        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function(i, str) {
            if (substrRegex.test(str)) {
                matches.push(str);
            }
        });

        cb(matches);
    };
};




function initFaqFilter(){
    var a = $(".js-filter-faq .filter-container .filter-tab").height();

    $(".js-filter-faq .filter-container .filter-tab li").css({height: a + "px"});
    $(".js-filter-faq .filter-container .filter-tab li span").css({height: a + "px"});
    $(".js-filter-faq").each(function () {
        var b = $(this).attr("data-category");
        if (typeof b !== typeof undefined && b !== false) {
            $(this).css({"padding-bottom": "30px"})
        }
    });
    $(".js-filter-faq .filter-container .filter-tab li span").click(function () {
        if ($(this).parent("li").hasClass("active")) {
        } else {
            var b = $(this).parent("li").attr("data-tab-category");
            $(".js-filter-faq .filter-container li").removeClass("active");
            $(this).parent("li").addClass("active");
            setTimeout(function () {
                checkDataFaqActive()
            }, 200)
        }
    });
    $(".js-filter-faq .select-tab-filter").change(function () {
        $(this).find(":selected").addClass("selected").siblings("option").removeClass("selected");
        setTimeout(function () {
            MobilecheckDataFaqActive()
        }, 200)
    })
}


function checkDataFaqActive() {
    $(".faq-accordion-container").unmark().removeAttr('style');
    $('#search-criteria').val('');
    $('.faq-no-results').addClass('hide');

    var a = $(".js-filter-faq .filter-container .filter-tab li.active").attr("data-tab-category");
    if(a == 'show-all'){
        $(".faq-accordion-container").removeClass('hide').removeClass('filtered');
    }else{
        $(".faq-accordion-container").each(function () {
            if ($(this).attr("data-category")) {
                if ($(this).attr("data-category").indexOf(a) >= 0) {
                    $(this).removeClass('hide').addClass('filtered');
                } else {
                    $(this).addClass('hide').removeClass('filtered');
                }
            }
        });
    }

    initPaginatorFaq();
    gotoPageFaq(1);
}



function MobilecheckDataFaqActive() {
    $(".faq-accordion-container").unmark().removeAttr('style');
    $('#search-criteria').val('');
    $('.faq-no-results').addClass('hide');

    var a = $(".js-filter-faq .select-tab-filter option.selected").attr("data-tab-category");
    if (a == "show-all") {
        $(".js-filter-faq").css({visibility: "visible"});
        $(".js-filter-faq").css({height: "auto"});
        $(".js-filter-faq").css({"padding-bottom": "30px"})
    } else {

        $(".js-filter-faq").each(function () {
            if ($(this).attr("data-category")) {
                if ($(this).attr("data-category").indexOf(a) >= 0) {
                    $(this).css({visibility: "visible"});
                    $(this).css({height: "auto"});
                    $(this).css({"padding-bottom": "30px"})
                } else {
                    $(this).css({visibility: "hidden"});
                    $(this).css({height: "0"});
                    $(this).css({"padding-bottom": "0px"})
                }
            }
        })
    }

    if(a == 'show-all'){
        $(".faq-accordion-container").removeClass('hide').removeClass('filtered');
    }else{
        $(".faq-accordion-container").each(function () {
            if ($(this).attr("data-category")) {
                if ($(this).attr("data-category").indexOf(a) >= 0) {
                    $(this).removeClass('hide').addClass('filtered');
                } else {
                    $(this).addClass('hide').removeClass('filtered');
                }
            }
        });
    }

    initPaginatorFaq();
    gotoPageFaq(1);
}

function initPaginatorFaq(){
    var faqForPage = 15;
    var totFaq = $('.faq-accordion-container').length;
    if($('.faq-accordion-container.filtered').length > 0){
        totFaq = $('.faq-accordion-container.filtered').length;
    }
    var pag = Math.ceil(totFaq/faqForPage);

    if(pag > 1){
        $('.js-faq-pagination').removeClass('hide');

        $('.js-faq-pagination .numbers').empty();

        for(var i=0;i< pag;i++){
            var linkPag = '<a href="#" class="page-link">'+ (i+1) +'</a>';
            $('.js-faq-pagination .numbers').append(linkPag);
        }

        $('.js-faq-pagination .numbers .page-link:eq(0)').addClass('current-page');

        if($('.faq-accordion-container.filtered').length > 0){
            for(var k=faqForPage;k < totFaq;k++){
                $('.faq-accordion-container.filtered:eq('+ k +')').addClass('hide');
            }
        }else{
            for(var k=faqForPage;k < totFaq;k++){
                $('.faq-accordion-container:eq('+ k +')').addClass('hide');
            }
        }

        $('.js-faq-pagination .numbers .page-link').off('click').on('click',function(e){
            e.preventDefault();

            $('.js-faq-pagination .numbers .page-link').removeClass('current-page');
            gotoPageFaq($(this).text());
            slidePageToFaq();
        });

        $('.js-faq-pagination .previous-link').off('click').on('click',function(e){
            e.preventDefault();

            if(!$(this).hasClass('deactivate')){
                var pageNow = $('.js-faq-pagination .numbers .page-link.current-page');
                var indexNow = pageNow.index();
                var totFaq = $('.js-faq-pagination .numbers .page-link').length-1;

                if(indexNow > 0){

                    $('.js-faq-pagination .numbers .page-link').removeClass('current-page');
                    $('.js-faq-pagination .previous-link, .js-faq-pagination .mobile-prev').removeClass('deactivate');
                    gotoPageFaq(indexNow);
                    slidePageToFaq();

                    if($('.js-faq-pagination .numbers .page-link.current-page').index() < 1){
                        $('.js-faq-pagination .previous-link, .js-faq-pagination .mobile-prev').addClass('deactivate');
                    }
                }
            }
        });

        $('.js-faq-pagination .next-link').off('click').on('click',function(e){
            e.preventDefault();

            if(!$(this).hasClass('deactivate')){
                var pageNow = $('.js-faq-pagination .numbers .page-link.current-page');
                var indexNow = pageNow.index();
                var totFaq = $('.js-faq-pagination .numbers .page-link').length-1;

                if((indexNow+1) <= totFaq){

                    $('.js-faq-pagination .numbers .page-link').removeClass('current-page');
                    $('.js-faq-pagination .next-link, .js-faq-pagination .mobile-next').removeClass('deactivate');
                    gotoPageFaq(indexNow+2);
                    slidePageToFaq();

                    if((indexNow+1) == totFaq){
                        $('.js-faq-pagination .next-link, .js-faq-pagination .mobile-next').addClass('deactivate');
                    }
                }
            }
        });


        $('.js-faq-pagination .mobile-next').off('click').on('click',function(e){
            e.preventDefault();
            $('.js-faq-pagination .next-link').trigger('click');
        });

        $('.js-faq-pagination .mobile-prev').off('click').on('click',function(e){
            e.preventDefault();
            $('.js-faq-pagination .previous-link').trigger('click');
        });

    }else{
        $('.js-faq-pagination').addClass('hide');
    }

}


function gotoPageFaq(pageSelected){
    var faqForPage = 15;
    var startFaq = faqForPage * (pageSelected-1);
    var totFaq = startFaq+faqForPage;

    $('.js-faq-pagination .numbers .page-link:eq('+ (pageSelected-1) +')').addClass('current-page');

    $('.faq-accordion-container').addClass('hide');
    if($('.faq-accordion-container.filtered').length > 0){
        for(var k=startFaq;k < totFaq;k++){
            $('.faq-accordion-container.filtered:eq('+ k +')').removeClass('hide');
        }
    }else{
        for(var k=startFaq;k < totFaq;k++){
            $('.faq-accordion-container:eq('+ k +')').removeClass('hide');
        }
    }

    if($('.js-faq-pagination .numbers .page-link.current-page').index() > 0){
        $('.js-faq-pagination .previous-link, .js-faq-pagination .mobile-prev').removeClass('deactivate');
    }else{
        $('.js-faq-pagination .previous-link, .js-faq-pagination .mobile-prev').addClass('deactivate');
    }

    if($('.js-faq-pagination .numbers .page-link.current-page').index() < ($('.js-faq-pagination .numbers .page-link').length-1)){
        $('.js-faq-pagination .next-link, .js-faq-pagination .mobile-next').removeClass('deactivate');
    }else{
        $('.js-faq-pagination .next-link, .js-faq-pagination .mobile-next').addClass('deactivate');
    }
}



function blogCounter(){
	$(".modal-blog-wrapper").each(function(){
		var $this = $(this);
		var blogApprovalCounter = $this.closest(".portlet-journal-content").find(".modal-blog-submitted").length;
		var blogContent = $this.closest(".portlet-journal-content").find(".blog-counter").text();
		$this.closest(".portlet-journal-content").find(".blog-counter").text(blogApprovalCounter);
	});
}
function blogcomment(){
	$(".comment-thank-you-page").hide();
	$(".comment-form-wrapper").hide();
	$(".insert-comment-wrapper").show();
	$(".wrapper-add-comment").show();
	if($(".modal-blog-submitted").length > 0){
		$(".wrapper-no-comment").hide();
		$(".wrapper-comments").show();
	}
	else{
		$(".wrapper-no-comment").show();
		$(".wrapper-comments").hide();
	}
	$(".insert-comment").click(function(){
		$(".comment-form-wrapper").show();
		$(".insert-comment-wrapper").hide();
		$(".wrapper-add-comment").hide();
	});
}
function modalReset(){
	$(".modal-blog-wrapper .icon-close").click(function(){
		blogcomment();
	});
}
function scrollModalComment (){
	$(".modal-blog-wrapper").animate({ scrollTop: 0 }, 250);
}

function detailStorebar() {
	$('.detail-store-bar a[href*="#"]:not([href="#"])').click(function() {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			$(".detail-store-bar a").removeClass("active-bar");
			var activeList = $(this).addClass("active-bar").text();
			$(".mobile-select p").text(activeList);
			$(this).addClass("active-bar");
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if ($(".tab-store-list").hasClass("main-active")) {
				$(".tab-store-list").removeClass("main-active");
			}
			else{
				$(".tab-store-list").addClass("main-active");
			}
			if (target.length) {
					if($(window).width() <= 1024 && $('body.mobile-device').length){
						$('html, body').animate({
							scrollTop: target.offset().top -100
						}, 500);
					}
					else if($(window).width() <= 999){
						$('html, body').animate({
							scrollTop: target.offset().top -100
						}, 500);
					}
					else{
						$('html, body').animate({
							scrollTop: target.offset().top -20
						}, 500);
					}
			}
		}

	});
}

function detailStorebarMobile(){
	$(".mobile-select").on('click',function(){
		if ($(".tab-store-list").hasClass("main-active")) {
			$(".tab-store-list").removeClass("main-active");
			$(".mobile-select").removeClass("main-active");
		}
		else{
			$(".tab-store-list").addClass("main-active");
			$(".mobile-select").addClass("main-active");
		}
	});
	detailStorebar();
}
$(document).on("click",function(event) { 
    if(!$(event.target).closest('.mobile-select').length) {
        if($('.mobile-select').hasClass("main-active")) {
            $(".tab-store-list").removeClass("main-active");
			$(".mobile-select").removeClass("main-active");
        }
    }        
});
$(window).resize(function(){
	if($('.mobile-select').length) {
        if($('.mobile-select').hasClass("main-active")) {
            $(".tab-store-list").removeClass("main-active");
			$(".mobile-select").removeClass("main-active");
        }
    }
});
function crsAccordion(){
      // Get all the links.
     var link = $(".click-information-open-box");

     // On clicking of the links do something.
     link.on('click', function(e) {

         e.preventDefault();
         $(this).toggleClass("rotate");
         $(".click-information-open-box").not(this).each(function(){
            if($(this).hasClass("rotate")){
                $(this).removeClass("rotate");
            }
         })
         var a = $(this).attr("data-accordion");
         $("."+ a).slideToggle(300);

         //$(a).slideToggle('fast');
         $(".crs-type-more-information").not("."+a).slideUp(300);
         $(".close-accordion-icon").on('click',function(){
          var b = $(this).attr("data-accordion-close");
          $(this).parents('.crs-type-wrapper').find('.click-information-open-box').removeClass('rotate');
          $("."+ b).slideUp(300);
          $(".click-information-open-box").removeClass('rotate');
         });
     });
}
function crsSameHeight(){
     var windowSize = $(window).width();
     if (windowSize >= 768) {
          $('.crs-type-content').each(function(){
               var thisCrsWrapper = $(this).outerHeight();
               $(this).find(".crs-same-height").css("min-height",thisCrsWrapper+"px");
          });
     }
     if($(".crs-type-content").length>0) {
         $(window).resize(function(){
             if (windowSize >= 768) {
                $('.crs-type-content').each(function(){
                    var thisCrsWrapper = $(this).outerHeight();
                    $(this).find(".crs-same-height").css("min-height",thisCrsWrapper+"px");
                });
            }
         })
     }
}
function initGalleryDemo (){

    /*var initPhotoSwipeFromDOM = function(gallerySelector) {

    // parse slide data (url, title, size ...) from DOM elements 
    // (children of gallerySelector)
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;
        for(var i = 0; i < numNodes; i++) {

            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes 
            if(figureEl.nodeType !== 1) {
                continue;
            }

            linkEl = figureEl.children[0]; // <a> element

            size = linkEl.getAttribute('data-size').split('x');

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };



            if(figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML; 
            }

            if(linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            } 

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }
        return items;
    };

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && ( fn(el) ? el : closest(el.parentNode, fn) );
    };

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;

        // find root element of slide
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });

        if(!clickedListItem) {
            return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if(childNodes[i].nodeType !== 1) { 
                continue; 
            }

            if(childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }



        if(index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe( index, clickedGallery );
        }
        return false;
    };

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
        params = {};

        if(hash.length < 5) {
            return params;
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if(!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');  
            if(pair.length < 2) {
                continue;
            }           
            params[pair[0]] = pair[1];
        }

        if(params.gid) {
            params.gid = parseInt(params.gid, 10);
        }

        return params;
    };

    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),

            getThumbBoundsFn: function(index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect(); 

                return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
            }

        };

        // PhotoSwipe opened from URL
        if(fromURL) {
            if(options.galleryPIDs) {
                // parse real index when custom PIDs are used 
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for(var j = 0; j < items.length; j++) {
                    if(items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }

        // exit if index not found
        if( isNaN(options.index) ) {
            return;
        }

        if(disableAnimation) {
            options.showAnimationDuration = 0;
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll( gallerySelector );

    for(var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i+1);
        galleryElements[i].onclick = onThumbnailsClick;
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.pid && hashData.gid) {
        openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
    }
};

// execute above function
initPhotoSwipeFromDOM('.my-gallery');*/

$('.picture').each( function() {
    var $pic     = $(this),
        getItems = function() {
            var items = [];
            $pic.find('a').each(function() {
                var $href   = $(this).attr('href'),
                    $size   = $(this).data('size').split('x'),
                    $width  = $size[0],
                    $height = $size[1];
 
                var item = {
                    src : $href,
                    w   : $width,
                    h   : $height
                }
 
                items.push(item);
            });
            return items;
        }
 
    var items = getItems();
    var $pswp = $('.pswp')[0];
    $pic.on('click', 'figure', function(event) {
        event.preventDefault();
        
        var $index = $(this).attr("data-index");
        $index = parseInt($index, 10);
        var options = {
            index: $index,
            bgOpacity: 0.7,
            showHideOpacity: true
        }
        
        // Initialize PhotoSwipe
        var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
        lightBox.init();
    });
});

}

function initSameHeightGalleryList(){
        if($(".product-list.gallery-list").length > 0){
            var maxHeight;
            var galleryLengths = $(".product-list.gallery-list").length;
            if($(window).width() > 999) {
                var rows = Math.ceil(galleryLengths / 4);
                for (var i=0; i<rows; i++) {
                    var array = $(".product-list.gallery-list").slice(i*4,i*4+4);
                    maxHeight = 0;
                    for (var j=0; j<array.length; j++) {
                        var itemHeight = $(array[j]).height();
                        if(itemHeight > maxHeight)
                            maxHeight = itemHeight;
                        
                    }
                    for (var j=0; j<array.length; j++) {
                        $(array[j]).height(maxHeight);
                    }
                }
            }
            else {
                if($(window).width() > 767) {
                    var rows = Math.ceil(galleryLengths / 2);
                    for (var i=0; i<rows; i++) {
                        var array = $(".product-list.gallery-list").slice(i*2,i*2+2);
                        maxHeight = 0;
                        for (var j=0; j<array.length; j++) {
                            var itemHeight = $(array[j]).height();
                            if(itemHeight > maxHeight)
                                maxHeight = itemHeight;
                            
                        }
                        for (var j=0; j<array.length; j++) {
                            $(array[j]).height(maxHeight);
                        }
                    }
                }
            }
            $(window).resize(function(){
                if($(window).width() > 999) {
                    $(".product-list.gallery-list").each(function(){
                        $(this).height("auto");
                    });
                    var rows = Math.ceil(galleryLengths / 4);
                    for (var i=0; i<rows; i++) {
                        var array = $(".product-list.gallery-list").slice(i*4,i*4+4);
                        maxHeight = 0;
                        for (var j=0; j<array.length; j++) {
                            var itemHeight = $(array[j]).height();
                            if(itemHeight > maxHeight)
                                maxHeight = itemHeight;
                            
                        }
                        for (var j=0; j<array.length; j++) {
                            $(array[j]).height(maxHeight);
                        }
                    }
                }
                else {
                    if($(window).width() > 767) {
                        $(".product-list.gallery-list").each(function(){
                            $(this).height("auto");
                        });
                        var rows = Math.ceil(galleryLengths / 2);
                        for (var i=0; i<rows; i++) {
                            var array = $(".product-list.gallery-list").slice(i*2,i*2+2);
                            maxHeight = 0;
                            for (var j=0; j<array.length; j++) {
                                var itemHeight = $(array[j]).height();
                                if(itemHeight > maxHeight)
                                    maxHeight = itemHeight;
                                
                            }
                            for (var j=0; j<array.length; j++) {
                                $(array[j]).height(maxHeight);
                            }
                        }
                    }
                    else {
                        $(".product-list.gallery-list").each(function(){
                            $(this).height("auto");
                        });
                    }
                }
            })
        }


}




function modalPdfInit() {
    
}


// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () {
    };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());



var isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


if (isMobile.any()) {
    $('body').addClass('mobile-device');
}


function initEllipsis(){
    $(".promo-box-link").dotdotdot({
        after: "span.arrow",
        wrap: 'word'
    });
    $(".dot-point").dotdotdot({
        ellipsis: '...',
        wrap: 'word'
    });
}

function handleInputPlaceholder() {
    $('input[type="text"], input.copy-text, .overlay-search-input input').each(function(){
        $(this).attr('data-holder', $(this).attr('placeholder'));

        $(this).focusin(function () {
            $(this).attr('placeholder', '');
        });
        $(this).focusout(function () {
            $(this).attr('placeholder', $(this).data('holder'));
        });
    });
}
function initTouchIpadClick(){
    $('.mobile.touch .teaser-25-variant a').on('click touchend', function() {
        var el = $(this);
        var link = el.attr('href');
        window.location = link;
    });
}

function handleMobileModals(){
    // $('[data-toggle="modal-custom"][data-target="#book-appointment"], [data-toggle="modal-custom"][data-target="#modal-download"]').click(function(){
    $('[data-toggle="modal-custom"][data-target="#modal-download"]').click(function(){
    	$('html, body').animate({scrollTop: 0 });
    });
}

function searchTags() {
    $('.tag-search').click(function(){
        var the_url = $('#submitSearch').attr('onclick');
        the_url = the_url.replace("doSearch('", '');
        the_url = the_url.substring(0, the_url.indexOf("'"));

        var to_search = $(this).data('tag-search');

        doSearch(the_url + to_search, '', null);

    });
}

$(document).ready(function () {

    if (!isMobile.any()) {
        $(".js-custom-select").select2({
            minimumResultsForSearch: -1
        });
    }

    // Init dei vari components
    initHeader();
    initInfoCarousel();
    initSmallCarousel();
    initSearchOverlay();
    initAppendMobile();
    mp_video();
    initCountTextarea();
    initThreeSteps();
    initTabs();
    initChangeImgProduct();
    initMobileProductCarousel();
    initMobileProductCarouselOnResize();
    initShareOverlay();
    initMediaVideo();
    initZoomImage ();
    initComparisonCarousel ();
    initHearingAid();
    initFaqAccordion();
    initTouchIpadClick();
    handleMobileModals();
    searchTags();
    blogcomment();
    blogCounter();
    modalReset();
    crsAccordion();
    crsSameHeight();
    initGalleryDemo();
    initSameHeightGalleryList();
    modalPdfInit();

    /* Ellipsis start */
    setTimeout(initEllipsis, 100);

    $(window).resize(function () {
        waitForFinalEvent(function(){
            $(".promo-box-link").trigger('destroy');
            $(".dot-point").trigger('destroy');
            initEllipsis();
        }, 100, "checkEllipsis");
    });
    /* Ellipsis end */

    // Init jquery plugin breakpoint for img load
    if ($('.img-breakpoint').length > 0) {
        $(".img-breakpoint").breakpoint();
        $('.comparison-box-image').find('.img-responsive').each(function(){
          var imgClass = (this.width/this.height > 1) ? 'wide' : 'tall';
          $(this).addClass(imgClass);
        });
    }
    handleInputPlaceholder();
    $('#searchKeywords').keypress(function(e){
        if(e.keyCode==13)
        $('#submitSearch').click();
      });
    if ($('.js-filter-faq').length > 0) {
        checkDataFaqActive();
    }

    $('.widget-search.search-bar input.copy-text').on('click',function(){
        SetCaretAtEnd($(this)[0]);
    });


    if($('.blog-link .text-link.blog-modal .blog-counter').text() == 0){
        $('.blog-link .text-link.blog-modal').html('Add a comment');
        var mylink = $('.modal-blog-wrapper .wrapper-no-comment p.copy-text a').clone();
        var newText = 'No comments yet. <a href="#" class="insert-first-comment text-link">be the first <span class="arrow"><span>»</span></span></a>';
        $('.modal-blog-wrapper .wrapper-no-comment p.copy-text').html(newText);
        $(".insert-first-comment").click(function(){
            $(".comment-form-wrapper").show();
            $(".wrapper-no-comment").hide();
        });
    }
    jQuery("[data-href").each(function(){
        var dataHref = jQuery(this).data("href");
        var dataTarget = jQuery(this).data("target");
        if(dataHref != '' && dataTarget=="_blank") {
            jQuery(this).on("click",function(){
                window.open(dataHref,'_blank');
            });
        }
        else if(dataHref != '' && dataTarget=="_self") {
            jQuery(this).on("click",function(){
                window.location = dataHref;
            });
        }
    });
});


function SetCaretAtEnd(elem) {
    var elemLen = elem.value.length;
    // For IE Only
    if (document.selection) {
        // Set focus
        elem.focus();
        // Use IE Ranges
        var oSel = document.selection.createRange();
        // Reset position to 0 & then set at end
        oSel.moveStart('character', -elemLen);
        oSel.moveStart('character', elemLen);
        oSel.moveEnd('character', 0);
        oSel.select();
    }
    else if (elem.selectionStart || elem.selectionStart == '0') {
        // Firefox/Chrome
        elem.selectionStart = elemLen;
        elem.selectionEnd = elemLen;
        elem.focus();
    } // if
}



jQuery(window).on('load', function(){
	jQuery(".dot-point, .promo-box-link").trigger("update.dot");
});


function doSearch(baseURL, locationFinderBaseURL, regex) {
    var keywords = $("#searchKeywords").val();
    
    var res = false;
    if(regex) {
        var patt = new RegExp(regex);
        res = patt.test(keywords);
    }
        
    if(res) {
        window.location = locationFinderBaseURL + "/-/locator/" + keywords;
    }
    else {
        window.location = baseURL + keywords;
    }
}


var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
            clearTimeout (timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
    };
})();
