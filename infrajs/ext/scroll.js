/*======================================================================
		Скрипт прокрутки страницы
		Автор: Szen
		Сайт: szenprogs.ru
======================================================================*/

window.roller = {
	info: {
		autor: 'Szen',
		site: 'http://szenprogs.ru',
		page: 'http://szenprogs.ru/blog/proizvolnaja_prokrutka_stranicy_na_jquery/2012-09-01-143',
		version: '1.0 beta'
	},
	def:{
		maxSpeed: 200,
		minSpeed: 3000,
		OpacityEnter: '0.3',
		OpacityLeave: '0.0',
		boxColor: '#000000',
		boxWidth: 100,
		vertical: true,
		horizontal: true
	},
	setOptions: function(options){
		options = $.extend(this.def, options);
		return options;
	},
	
	opt: {
		ww: 0,
		wh: 0,
		dw: 0,
		dh: 0,
		sx: 0,
		sy: 0
	},
	
	setOpt: function(){
		var browser=roller.browser;
		this.opt.dw = (browser.msie)?document.body.scrollWidth:document.documentElement.scrollWidth;
		this.opt.dh = (browser.msie)?document.body.scrollHeight:document.documentElement.scrollHeight;
		this.opt.ww = $(window).width();
		this.opt.wh = $(window).height();					
		this.opt.sy = (browser.msie && browser.version < 7)?$(window).scrollTop():0;
		this.opt.sx = (browser.msie && browser.version < 7)?$(window).scrollLeft():0;
	},

	setEvent: function(el, targ, options){
		var browser=roller.browser;
		var d = (browser.safari||browser.chrome)?'body':'html';
		$(el).hover(function(){
			$(this).css({opacity: options.OpacityEnter});
			$(d).animate(targ, options.minSpeed);
		},function(){
			$(d).stop();
			$(this).css({opacity: options.OpacityLeave});
		}).click(function(){
			var targ={scrollTop: 0};
			$(d).stop().animate(targ, options.maxSpeed);
		});
	},
	goBot:function(scrollFromBot,callback){
		var browser=roller.browser;
		if(!scrollFromBot)scrollFromBot=0;
		this.setOpt();
		var targ={scrollTop:this.opt.dh-this.opt.wh-scrollFromBot};
		var d = (!browser||(browser.safari||browser.chrome))?'body':'html';
		var maxSpeed=400;
		$(d).stop().animate(targ, maxSpeed,'swing',callback);
	},
	goTop:function(scrollFromTop,callback){
		var browser=roller.browser;
		if(!scrollFromTop)scrollFromTop=0;
		var targ={scrollTop:scrollFromTop};
		var d = (browser.safari||browser.chrome)?'body':'html';
		var maxSpeed=200;
		$(d).stop().animate(targ, maxSpeed,'swing',callback);
	},
	setSize: function(options){
		this.setOpt();
		if(options.vk){
			$('#roller-l').css({
				width: (options.boxWidth) + 'px',
				height: this.opt.wh + 'px',
				left: this.opt.sx + 'px',
				textAlign:'center',
				paddingTop:'5px',
				cursor:'pointer',
				top: this.opt.sy + 'px'
			});
		}else{
			$('#roller-l').css({
				width: (options.boxWidth) + 'px',
				height: (this.opt.wh - ((options.vertical)?options.boxWidth:0) * 2) + 'px',
				left: this.opt.sx + 'px',
				top: (this.opt.sy + ((options.vertical)?options.boxWidth:0)) + 'px'
			});
			$('#roller-r').css({
				width: options.boxWidth + 'px',
				height: (this.opt.wh - ((options.vertical)?options.boxWidth:0) * 2) + 'px',
				left: (this.opt.sx + this.opt.ww - options.boxWidth) + 'px',
				top: (this.opt.sy + ((options.vertical)?options.boxWidth:0)) + 'px'
			});					
			$('#roller-t').css({
				width: (this.opt.ww - ((options.horizontal)?options.boxWidth:0) * 2) + 'px',
				height: options.boxWidth + 'px',
				left: (this.opt.sx + ((options.horizontal)?options.boxWidth:0)) + 'px',
				top: this.opt.sy + 'px'
			});					
			$('#roller-b').css({
				width: (this.opt.ww - ((options.horizontal)?options.boxWidth:0) * 2) + 'px',
				height: options.boxWidth + 'px',
				left: (this.opt.sx + ((options.horizontal)?options.boxWidth:0)) + 'px',
				top: (this.opt.sy + this.opt.wh - options.boxWidth) + 'px'
			});
		}
	},
	
	ready: function(options){	
		options = this.setOptions(options);	
		if(!options.horizontal && !options.vertical){
			options.horizontal = true;
			options.vertical = true;
		}
		
		if(options.vk){
			if(options.vkarrow){
				var al = $('<div>вверх</div>').addClass('roller').attr('id','roller-l');					
			}else{
				var al = $('<div>').addClass('roller').attr('id','roller-l');					
			}
			$('body').append(al).append(ar);			
		}else{
			if(options.horizontal){
				var al = $('<div>').addClass('roller').attr('id','roller-l');					
				var ar = $('<div>').addClass('roller').attr('id','roller-r');		
				$('body').append(al).append(ar);			
			}
			if(options.vertical){
				var at = $('<div>').addClass('roller').attr('id','roller-t');					
				var ab = $('<div>').addClass('roller').attr('id','roller-b');		
				$('body').append(at).append(ab);			
			}
		}
		
		this.setSize(options);
		$(window).resize(function(){
			window.roller.setSize(options);
		});
		if(roller.browser.msie && roller.browser.version < 7){
			$(window).scroll(function(){
				window.roller.setSize(options);
			});
		}
		
		var ocss = {
			position: (roller.browser.msie && roller.browser.version < 7)?'absolute':'fixed',
			background: options.boxColor,
			opacity: options.OpacityLeave,
			zIndex: 1000
		}
		$('.roller').css(ocss);
		
		if(options.vk){
			this.setEvent(al, {scrollTop: 0}, options);
		}else{
			if(options.horizontal){
				this.setEvent(al, {scrollLeft: 0}, options);
				this.setEvent(ar, {scrollLeft: (this.opt.dw - this.opt.ww)}, options);
			}
			if(options.vertical){
				this.setEvent(at, {scrollTop: 0}, options);
				this.setEvent(ab, {scrollTop: (this.opt.dh - this.opt.wh)}, options);			
			}
		}
	},
	
	init: function(options){
		window.setTimeout(function(){
			window.roller.ready(options);
		},1000);
	}
};

roller.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};
// Don't clobber any existing jQuery.browser in case it's different
if ( !roller.browser ) {
	matched = roller.uaMatch( navigator.userAgent );
	browser = {};

	if ( matched.browser ) {
		browser[ matched.browser ] = true;
		browser.version = matched.version;
	}

	// Chrome is Webkit, but Webkit is also Safari.
	if ( browser.chrome ) {
		browser.webkit = true;
	} else if ( browser.webkit ) {
		browser.safari = true;
	}

	roller.browser = browser;
}



window.roller.def={
	maxSpeed: 100,
	minSpeed: 2000,
	OpacityEnter: '0.6',
	OpacityLeave: '0.4',
	boxColor: '#E1E7ED',
	boxWidth: 50,
	vk:true,
	vkarrow:false,
	horizontal: false,
	vertical: true
}
if(infra.conf.infrajs.scroll){
	$(function(){
		window.roller.init(infra.conf.infrajs.scroll);
	});
}
