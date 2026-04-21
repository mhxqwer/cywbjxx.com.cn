// 2024.10.01

var $window = $(window);

$('.mobile-nav .arrow').click(function(){
	$(this).parent().toggleClass('on');
	$(this).siblings('dl').slideToggle(300);
})

// 切换每个传入的标签
function toggleOn(){var args = arguments.length;for( var i = 0; i < args; i++ ){ $(arguments[i]).toggleClass('on');} }
function toggleParentOn(a){ $(a).parent().toggleClass('on'); }

// 获得页面向左、向上卷动的距离
function getScroll(){
	return {
		left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
		top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
	};
}

// 获取元素距离屏幕顶部的距离
// function getPosition(el){
// 	var xPos = 0;
// 	var yPos = 0;
// 	if( typeof el == 'string' ){
// 		el = document.querySelector(el);
// 	}
// 	while (el) {
// 		if (el.tagName == "BODY") {
// 			var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
// 			var yScroll = el.scrollTop || document.documentElement.scrollTop;
// 			xPos += (el.offsetLeft - xScroll + el.clientLeft);
// 			yPos += (el.offsetTop - yScroll + el.clientTop);
// 			var transform = getComputedStyle(el,null).transform;
// 			if(transform != 'none'){
// 				var transformArr = transform.split(',');
// 				xPos += parseInt(transformArr[4]);
// 				yPos += parseInt(transformArr[5]);
// 			}
// 		} else {
// 			xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
// 			yPos += (el.offsetTop - el.scrollTop + el.clientTop);
// 			var transform = getComputedStyle(el,null).transform;
// 			if(transform != 'none'){
// 				var transformArr = transform.split(',');
// 				xPos += parseInt(transformArr[4]);
// 				yPos += parseInt(transformArr[5]);
// 			}
// 		}
// 		el = el.offsetParent;
// 	}
// 	return {
// 		x: xPos,
// 		y: yPos
// 	};
// }
function getPosition(el) {
	if( typeof el == 'string' ){ el = document.querySelector(el); }
	if( el instanceof jQuery ){ el = el[0]; }
    var rect = el.getBoundingClientRect();
	return { x: rect.left, y: rect.top };
}

// 判断标签是否在可视区域内
function checkVisible(el){
	if( typeof el == 'string' ){
		el = document.querySelector(el);
	}
	var enterEffects_y = getPosition(el).y;
	var transform = getComputedStyle(el,null).transform;
	if( transform != 'none' ){
		var transformArr = transform.split(',');
		enterEffects_y -= parseInt(transformArr[5]);
	}
	if( enterEffects_y <= $window.height() * .85 ){
		return true;
	}else{
		return false;
	}
}
// 鼠标滚动标签逐渐进入
function enterEffects(){
	var sWSon = document.documentElement.clientWidth;
	if(sWSon >= 996){
		$(".effect").each(function() {
			if( checkVisible(this) ){
				$(this).addClass("isView");
			}else{
				$(this).removeClass("isView");
			}
		});
		$(".enter_animate").each(function() {
			if( checkVisible(this) ){
				$(this).removeClass('animate_pause');
			}
		});
	}else{
		$(".effect").each(function() {
			$(this).addClass("isView");
		});
		$(".enter_animate").each(function() {
			$(this).removeClass('animate_pause');
		});
	}

	$('.lazy').each(function() {
		if( getPosition(this).y <= $window.height() * 2 ){
			if( $(this).attr('data-src') != undefined && $(this).attr('data-src') != '' ){
				$(this).attr("src",$(this).attr("data-src"));
				$(this).removeAttr('data-src').removeClass('lazy').addClass('lazyed');
			}
			if( $(this).attr('data-background') != undefined && $(this).attr('data-background') != '' ){
				$(this).css("background-image","url(" + $(this).attr("data-background") + ")");
				$(this).removeAttr('data-background').removeClass('lazy').addClass('lazyed');
			}
		}
	});
}
// function setEnterAnimationBeginning(){
// 	$(".enter_effect").each(function(index, element) {
// 		if( $(this).attr('enter_effect') ){
// 			$(this).addClass($(this).attr('enter_effect'));
// 		}
// 	});
// }
// 页面板块逐渐进入效果
if( $('.effect').length > 0 || $('.lazy').length > 0 || $('.enter_animate').length > 0 ){
	setTimeout(function(){ enterEffects(); },200);
	$(document).ready(function(){
		$('.enter_animate').each(function(){
			$(this).addClass('animate_pause')
		})
		enterEffects();
	});
	$window.resize(function(){
		var resizeTimer = null;
		if (resizeTimer) clearTimeout(resizeTimer);
		resizeTimer = setTimeout(function(){
			enterEffects();
		},50);
	});
	$window.scroll(function(){
		enterEffects();
	});
	// 逐个出现
	$('.effect11,.effect21,.effect31,.effect41,.effect51,.effectChildren').each(function() {
		$(this).find("li").each(function(index){
			var len = $(this).parent().find("li").length;
			// $( this ).css({'transition-delay': (index*0.5/len)+'s'});
			$( this ).css({'transition-delay': (index*0.05)+'s'});
		})
	});
}

// header固定效果
if( $('.header').length > 0 ){
	var headerHeight = $('.header').outerHeight();
	if( getComputedStyle($('.header')[0]).position != 'relative' && getComputedStyle($('.header')[0]).position != 'static' && getComputedStyle($('.header')[0]).position != 'inherit' ){
		headerHeight = 0;
	}
	function fixNav(){
		var w_width = document.documentElement.clientWidth,
		w_height = document.documentElement.clientHeight,
		scrollHeight = document.body.scrollHeight;
		if( scrollHeight > w_height + 100 && w_width > 996 ){
			var scrollTop = $window.scrollTop();
			if( scrollTop >= 200 ){
				$('.header').addClass('currents')
				$('body').css('padding-top',headerHeight+'px');
				// $('.gotop').addClass('on')
			}else{
				$('.header').removeClass('currents')
				// $('.gotop').removeClass('on')
				$('body').css('padding-top','0');
			}
		}else{
			$('.header').removeClass('currents')
			// $('.gotop').removeClass('on')
			$('body').css('padding-top','0');
		}
	}
	fixNav();
	$window.scroll(function(){fixNav();});
}

//根据参数名获得该参数  pname等于想要的参数名
function getParam(pname) {
	var params = location.search.substr(1); //  获取参数 平且去掉？
	var ArrParam = params.split('&');
	// if(ArrParam.length == 1){
	// 	//只有一个参数的情况
	// 	return params.split('=')[1];            }
	// else{
		//多个参数参数的情况
		for (var i = 0; i < ArrParam.length; i++) {
			if (ArrParam[i].split('=')[0] == pname) {return ArrParam[i].split('=')[1];}
		}
	// }
}
// 获取直接在链接地址最后的id
function getId() {
    var params = location.hash.substring(1);
    if( params != '' ){
        return params;
    }
    return null;
}

// 点击回到页面顶部
function gotop(){ $('body,html').stop().animate({scrollTop:0},500); }
$('.gotop').click(function(){gotop();})

// 页面加载完成后根据链接地址滚动到指定板块
function scrollLink(){
	var mao = $("#" + getParam("mao"));
	if (mao.length > 0) {
		var pos = mao.offset().top;
		$("html,body").animate({scrollTop: pos-40}, 1000);
	}
}
$(function(){
	if( getParam("mao") != null ){ scrollLink(); }
})
// 点击滚动到指定板块
function q_scrollTo(tar){
	var pos = $(''+ tar).offset().top;
	var dis = 120;
	if( document.documentElement.clientWidth > 996 ){
		dis = $('.wrap_nav').outerHeight();
	}
	// else{
	// 	dis = 0;
	// }
	$("html,body").animate({scrollTop: pos-dis}, 1000);
}

// 点击展开收起链接
$('.select_link').click(function(){
	$(this).find('.arrow').toggleClass('on');
	$(this).find('.alert_box').toggleClass('on');
	$(this).toggleClass('on');
})
$('.select_link').mouseleave(function(){
	$(this).find('.arrow').removeClass('on');
	$(this).find('.alert_box').removeClass('on');
	$(this).removeClass('on');
})

// 用于页码跳转
function jumpTo(){
	var pageNumber = parseInt($('#pageNumber').val());
	if(pageNumber>0 && pageNumber <= maxPageCount){
		document.location.href =  pageNumber==1?"index.htm":pageNumber > maxPageCount?"index"+(parseInt(maxPageCount)-1).toString()+".htm":"index"+(pageNumber-1).toString()+".htm";
	}else{
		$('.tips').text('页码需大于0小于'+maxPageCount)
	}
}
$("#pageNumber").keydown(function(e){
	if(e.keyCode == 13){ jumpTo() }
});
$("#pageNumber").keyup(function(){
	var pageNumber = parseInt($('#pageNumber').val());
	if(pageNumber > maxPageCount){
		$('#pageNumber').val(maxPageCount);
	}
});
$('.jumpto').click(function(){ jumpTo() });

// 轮播图切换时播放视频，controls为true时显示控制条
// play_swiper_video('.banner',true);
// <div class="gp-video-box" data-video="images/video.mp4" poster-src="images/banner.png"></div>
function play_swiper_video(swiper,controls){
	$('.vv').each(function() {
		$(this)[0].pause();
		// $(this)[0].currentTime = 0;
		$(this).remove();
	});
	if( $(swiper).find('.swiper-slide.swiper-slide-active .gp-video-box').length > 0 ){
		setTimeout(function(){
			document.querySelector(swiper).swiper.autoplay.stop();
		},100)
		var _this = $('.swiper-slide.swiper-slide-active .gp-video-box');
		var _video =  _this.attr('data-video');
		var _poster = _this.attr('poster-src') || '';
		var videos = '<video src="' + _video + '" autoplay="autoplay" muted class="vv" style="object-fit: cover ;" poster=' + _poster + ' playsinline x5-video-player-type="h5" x5-video-orientation="portrait"></video>';
		if( controls ){
			videos = '<video src="' + _video + '" autoplay="autoplay" class="vv" style="object-fit: cover ;" poster=' + _poster + ' playsinline x5-video-player-type="h5" x5-video-orientation="portrait" controls="controls"></video>';
		}
		_this.append(videos);
		_this.find('video').bind('ended', function() {
			document.querySelector(swiper).swiper.slideNext();
			document.querySelector(swiper).swiper.autoplay.start();
		});
	}
}

// 二级页侧栏菜单
// $('.sub_menu .arrow').click(function(){
// 	$(this).parent('.t').toggleClass('on');
// 	$(this).parent('.t').parent('li').toggleClass('on');
// 	// $(this).parent('.t').next('ul').toggle(300);
// })
$('.sub_menu_title').click(function(){
	var sWSon = document.documentElement.clientWidth;
	if(sWSon < 992 && $('.sub_menu').length > 0 ){
		$(this).toggleClass('on');
		$('.sub_left').toggleClass('on');
		$('.sub_menu .lv0').toggle(300);
	}
})
function initSubMenu(){
	$('.sub_menu a.current').each(function(){
		$(this).parent().parent('li').addClass('current');
		$(this).parents('.sub_menu .lv0 ul').parent('li').addClass('on');
		// $(this).parents('.sub_menu .lv0 ul').slideDown(0);
		$(this).parents('.sub_menu .lv0 ul').prev('.t').addClass('on');

		// 当前栏目子栏目也展开
		$(this).parent().addClass('on');
		// $(this).parent().siblings('ul').slideDown(0);
	})
}
if( $window.width() > 996 && $('.sub_menu').length > 0 ){
	initSubMenu();
}

// 监控标签宽高变化
function checkDomSize(dom,callback){
	if( typeof dom === 'string') { var ele = document.querySelector(dom); } else { var ele = dom; }
	ele.eleWidth = ele.offsetWidth,ele.eleHeight = ele.offsetHeight;
	if( window.MutationObserver || window.WebKitMutationObserve || window.MozMutationObserve) {
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.type === 'attributes') {
					var attrName = mutation.attributeName;
					if (attrName === 'style'|| attrName === 'class') {
						var attrValue = ele.getAttribute(attrName);
						var newWidth = ele.offsetWidth;
						var newHeight = ele.offsetHeight;
						if (newWidth != ele.eleWidth || newHeight != ele.eleHeight) {
							ele.eleWidth = newWidth;
							ele.eleHeight = newHeight;
							callback();
						}
					}
				}
			});
		})
		observer.observe(ele, { attributes: true ,attributeFilter: ['style', 'class'] ,childList:true,subtree:true })
	}else{
		ele.addEventListener('DOMAttrModified', function() {
			var newWidth = ele.clientWidth, newHeight = ele.clientHeight;
			if (newWidth !== ele.eleWidth || newHeight !== ele.eleHeight) {
				ele.eleWidth = newWidth;
				ele.eleHeight = newHeight;
				callback();
			}
		})
	}
	ele.addEventListener('transitionend', function() {
		var newWidth = ele.offsetWidth;
		var newHeight = ele.offsetHeight;
		if (newWidth !== ele.eleWidth || newHeight !== ele.eleHeight) {
			ele.eleWidth = newWidth;
			ele.eleHeight = newHeight;
			callback();
		}
	});
}

// 固定在侧边
function fixedSideBar(options){
    var defaults = {
        wrapscroll : '.wrap_fix_scroll',
        scroll : '.fix_scroll',
        distance : 0, // 固定在屏幕内距离顶部的距离
		showHeader : true
    };
	
	var options = $.extend(defaults,options);
	if( options.showHeader ){
		var _h_height = $('.header').outerHeight() || 0;
		// if( _h_height > defaults.distance ){
		options.distance = _h_height + 20;
		// }
	}

    var oWrap = $(options.wrapscroll),
        oScroll = $(options.scroll),
        wrapTop = oWrap.offset().top,
        wrapHeight = oWrap.outerHeight(),
        scrollHeight = oScroll.outerHeight(),
        scrollBottom = wrapTop + wrapHeight - scrollHeight,
        start = wrapTop - options.distance,
        end = scrollBottom - options.distance;

	oWrap.parent().css({'min-height':oScroll.outerHeight()+'px'});
	// oWrap.css('width', oWrap.parent().outerWidth()+'px' );
	// oScroll.css('width', oWrap.outerWidth() +'px');
	checkDomSize(oScroll[0],function(){ oWrap.parent().css({'min-height':oScroll.outerHeight()+'px'}); });

    function resetPosition(){
		if( options.showHeader ){
			var _h_height = $('.header').outerHeight() || 0;
			options.distance = _h_height + 20;
		}
        wrapTop = oWrap.offset().top;
        wrapHeight = oWrap.outerHeight();
        scrollHeight = oScroll.outerHeight();
        scrollBottom = wrapTop + wrapHeight - scrollHeight;
        start = wrapTop - options.distance;
        end = scrollBottom - options.distance;
    }
	function checkPostion(){
        var oWrap_y = getPosition(oWrap[0]).y;
        if( oWrap_y > options.distance ){
            oScroll.css({'position':'absolute','top':'0','bottom':'auto'});
        }else if( oWrap_y + wrapHeight - scrollHeight < options.distance ){
			oScroll.css({'position':'absolute','top': 'auto','bottom':'0'});
        }else{
            oScroll.css({'position':'fixed','top':options.distance+'px','bottom':'auto'});
        }
    }

    $(document).ready(function(){
        resetPosition();
        checkPostion()
    });
    $(window).resize(function(){
        var resizeTimer = null;
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function(){
			oWrap.css('width', oWrap.parent().outerWidth()+'px' );
			oScroll.css('width', oWrap.outerWidth() +'px');
            resetPosition();
            checkPostion()
        },50);
    });

    checkPostion();
    $(window).scroll(function(){
        // resetPosition();
        checkPostion();
    });
    oWrap.parents().scroll(function(){
        resetPosition();
        checkPostion();
    })
	checkDomSize(oWrap[0],function(){ resetPosition(); });

}
if( $('.wrap_fix_scroll').length > 0 ){
	fixedSideBar();
}


// if( $window.width() > 996 ){
// 	$window.scroll(function(){
// 		if( $window.scrollTop() > 200 ){
// 			$('.aside_link').addClass('on')
// 		}else{
// 			$('.aside_link').removeClass('on')
// 		}
// 	})
// }

$('.article table').each(function(){
    $(this).wrap('<div class="article_table_box"></div>')
})
$('.article p').each(function(){
	if( $(this).find('img').length > 0 && $(this).text().replace(/\s/g,'') == ''  ){
		$(this).addClass('has_img')
	}
})
// $('video').attr('playsinline','playsinline').attr('x5-video-player-type','h5').attr('x5-video-orientation','portrait');
// x5-playsinline="" playsinline="" webkit-playsinline="" poster="" x-webkit-airplay="allow" preload="auto"
$('video').attr('x5-playsinline','x5-playsinline').attr('playsinline','playsinline').attr('webkit-playsinline','webkit-playsinline').attr('x-webkit-airplay','allow').attr('preload','auto');

// 拆分文字
function splitText(txt){
	var _txt = txt.split('');
	var _html = '';
	for( var i = 0; i < _txt.length; i++ ){
		_html += '<span>' + _txt[i] + '</span>';
	}
	return _html;
}

// $('.index_title .name').each(function(){
// 	$(this).html(splitText($(this).text()));
// 	$(this).find('span').each(function(){
// 		$(this).css('transition-delay', $(this).index() * .1 + 's');
// 	})
// })


$.fn.extend({
	// tab切换
	tab: function (options){
		var tabDefaults = {             //默认参数
			ev : 'mouseover',        //默认事件'mouseover','click'
			til : 'h2',              //默认标签
			box : '.tab_list',       //默认列表
			defaultNum : 0,          //默认展示第几个
			eachPage : 1,            //每次切换的个数
			delay : 100,             //延迟时间
			auto : true,             //是否自动切换 true,false
			speed : 4000,            //自动切换间隔时间(毫秒)
			init : function(){},     //首次加载时触发时间
			before : function (){},  //切换前触发事件
			after : function (){},   //切换后触发事件
			more : false             //是否有more,false,true
		};
		var options = $.extend(tabDefaults, options);  //用户设置参数覆盖默认参数
		
		return this.each(function (){
			var o = options;
			var obj = $(this);
			var oTil = obj.find(o.til);
			var oBox = obj.find(o.box);
			var oMore = null;
			var iNum = o.defaultNum;
			var iLen = oTil.length;
			var iBefore = o.before;
			var iAfter = o.after;
			var iEach = o.eachPage;
			// 默认选中第一个
			o.init();
			if( iNum >= 0 ){
				change( oTil.eq(iNum) );
			}
			
			//鼠标事件绑定
			oTil.bind(o.ev , function (){
				var _this = this;
				if(o.ev == 'mouseover' && o.delay){
					_this.timer = setTimeout(function (){
						change(_this);
					},o.delay);
				}else{
					change(_this);
				};
			})

			oTil.bind('mouseout',function (){
				var _this = this;
				clearTimeout(_this.timer);
			});
			
			//自动切换效果
			(function autoPlay(){
				var timer2 = null;
				if(o.auto){
					function play(){
						iNum++;
						if(iNum >= iLen){
							iNum =0;
						};
						change(oTil.eq(iNum));
					};
					timer2 = setInterval(play,o.speed);
					obj.on('mouseover',function (){
						clearInterval(timer2);
					})
					obj.on('mouseout',function (){
						timer2 = setInterval(play,o.speed);
					})
				};
			})();
			
			function change(box){
				iBefore(iNum,obj);
				// console.log(1);
				iNum = $(box).index() - obj.find(o.til).eq(0).index();
				
				oTil.removeClass('on').addClass('off');
				oBox.removeClass('on').addClass('off');
				if(o.more){
					oMore = obj.find('.more');
					oMore.removeClass('on').addClass('off');
					oMore.eq(iNum).addClass('on').removeClass('off');
				};
				oTil.eq(iNum).addClass('on').removeClass('off');
				oBox.slice( iEach * iNum , iEach * (iNum + 1) ).addClass('on').removeClass('off');
				iAfter(iNum,obj);
			}
			
		});
	},

	// 数字滚动
	countTo: function(opts) {
		var countToDefaults = {
			lastSymbol:"", //显示在最后的字符,如 %、个、'<span>个</span>' 等
			from: 0,  // 开始时的数字
			speed: 3000,  // 总时间
			refreshInterval: 100,  // 刷新一次的时间
			beforeSize:0, //小数点前最小显示位数，不足的话用0代替
			decimals: 2,  // 小数点后的位数
			onUpdate: null,  // 更新时回调函数
			onComplete: null  // 结束后回调函数
		}

		// 合并自定义的方法
		var options = $.extend(countToDefaults, opts);
		return this.each(function() {
			// 设置总更新次数从而得到每次累加的值
			var _this = this;
			if( $(this).attr('count-num') == undefined ){
				$(this).attr('count-num',$(this).text());
			}
			var originalData = $(this).attr('count-num') || $(this).text(),//初始值
				loops = Math.ceil(options.speed / options.refreshInterval),//总更新次数
				increment = ($(this).text() - options.from) / loops,//每次累加的值
				loopCount = 0,
				value = options.from,
				interval = setInterval(updateTimer, options.refreshInterval);
			//console.log(Number(originalData).toFixed(options.decimals));
			function updateTimer() {
				value += increment;
				loopCount++;
				// console.log(value);
				// 把value的值转换成数字
				var str=Number(value).toFixed(options.decimals);

				// var str=value.toFixed(options.decimals);

				//运算到此时的字符串总长度
				this.sizeNum=str.length;

				//运算到此时的小数点前的字符长度
				this.sizeNumBefore=this.sizeNum-options.decimals-1;

				//判断 此时的小数点前的字符串长度是否>=需要的字符串小数点前的长度
				if(this.sizeNumBefore>=options.beforeSize)  {
					$(_this).html(str+options.lastSymbol);
				} else{
					//在<的时候 前面要补0 再显示
					this._str = Array(options.beforeSize-this.sizeNumBefore + 1).join('0') + str;
					$(_this).html(this._str+options.lastSymbol);
				}

				if (typeof(options.onUpdate) == 'function') {
					options.onUpdate.call(_this, value, loopCount);
					//用call方法 把 options.onUndate=='function'(是一个方法), 替换掉_this，并把value作为和这个函数的参数
				}
				if (loopCount >= loops) {//over
					clearInterval(interval);
					$(_this).html(originalData+options.lastSymbol);
					value = $(_this).text();
					if (typeof(options.onComplete) == 'function') {
						//options.onComplete.call(_this, value, loopCount);
						options.onComplete(value,loopCount,_this);
					}
				}
			}
		});
	}
})

$('.tab_box').each(function(){
	if( $(this).attr('data-tab') == undefined || $(this).attr('data-box') == undefined ){ return false; }
	var options = {
		til : $(this).attr('data-tab'),
		box : $(this).attr('data-box'),
		defaultNum : $(this).attr('data-defaultNum') || 0,
		eachPage : $(this).attr('data-eachPage') || 1,
		auto : $(this).attr('data-auto') || false,
		speed : $(this).attr('data-speed') || 4000,
		ev : $(this).attr('data-ev') || 'mouseover'
	}
	$(this).tab(options);
})
//  class=" tab_box" data-tab=".sub_022b1 li" data-box=".sub_022b2 li"

$('.article img').click(function () {
    // 如果没有onclick属性
    if (!$(this).attr('onclick')) {
        var imgSrc = $(this).attr('src');
        window.open(imgSrc);
    }
});

// 通用代码结束

$(document).ready(function() {
    // sub_menu1 自动滚动到 cur
    function scrollSubMenu() {
        var container = $('.sub_menu1');
        var currentItem = container.find('.cur');

        if (container.length > 0 && currentItem.length > 0) {
            var containerWidth = container.width();
            var currentItemPos = currentItem.parent().position().left; // 获取 li 的位置
            var currentItemWidth = currentItem.parent().outerWidth();
            var scrollLeft = container.scrollLeft();

            // 计算可视区域
            var visibleAreaStart = 0;
            var visibleAreaEnd = containerWidth;

            // 判断 cur 是否在可视区域外
            if (currentItemPos < 0 || (currentItemPos + currentItemWidth) > visibleAreaEnd) {
                // 计算需要滚动的距离，使其居中显示
                var scrollTo = scrollLeft + currentItemPos - (containerWidth / 2) + (currentItemWidth / 2);
                container.animate({
                    scrollLeft: scrollTo
                }, 300);
            }
        }
    }

    scrollSubMenu();
});


$(document).ready(function() {
    // 1. 创建并添加按钮到页面
    var backToTopButton = $('<div class="gotop"></div>');
    $('body').append(backToTopButton);

    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            backToTopButton.fadeIn();
        } else {
            backToTopButton.fadeOut();
        }
    });

	$('.fullscreen_slide').scroll(function(){
		if ($(this).scrollTop() > 200) {
            backToTopButton.fadeIn();
        } else {
            backToTopButton.fadeOut();
        }
	});

    backToTopButton.click(function() {
        gotop();
		$('.fullscreen_slide').animate({scrollTop:0},500);
    });
});