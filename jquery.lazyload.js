/**
 * jQuery lazy loader
 * @author  Ryan Boylett <http://boylett.uk/>
 * @version 1.0.5
 **/

(window.jQuery || function(a){a()})(function()
{
	var doc      = window.jQuery(document),
		win      = window.jQuery(window),
		lazyLoad = [],

	offsets  = function()
	{
		if(lazyLoad.length > 0)
		{
			for(var i = 0; i < lazyLoad.length; i ++)
			{
				if(lazyLoad[i])
				{
					lazyLoad[i].data('top', lazyLoad[i].offset().top);
				}
			}
		}
	},

	check = function()
	{
		if(lazyLoad.length > 0)
		{
			var scrollTop = doc.scrollTop() + win.height();

			for(var i = 0; i < lazyLoad.length; i ++)
			{
				if(lazyLoad[i] && scrollTop >= lazyLoad[i].data('top'))
				{
					lazyLoad[i].doLazyLoad();
					lazyLoad[i] = null;
				}
			}
		}
	};

	window.jQuery.fn.lazyload = window.jQuery.fn.lazyLoad = function()
	{
		var els = window.jQuery(this);

		if(els.length == 0)
		{
			els = window.jQuery(document).getLazyLoaders();
		}

		els.each(function()
		{
			lazyLoad.push(window.jQuery(this));
		});

		offsets();
		check();

		return els;
	};

	window.jQuery.fn.dolazyload = window.jQuery.fn.doLazyLoad = function()
	{
		return window.jQuery(this).each(function()
		{
			var img = window.jQuery(this).addClass('lazyload-loaded'),
				src = '',
				pre = new Image();

			if(this.hasAttribute('lazy-background-image'))
			{
				pre.onload = function()
				{
					img.css('background-image', 'url(\'' + this.src + '\')');
				};
				
				pre.src = img.attr('lazy-background-image');

				img.removeAttr('lazy-background-image');
			}
			else if(this.hasAttribute('lazy-style'))
			{
				var c_style = String(img.attr('style')).trim(' ;');

				c_style = (c_style ? c_style + '; ' : '') + img.attr('lazy-style');

				img.attr('style', c_style).removeAttr('lazy-style');
			}

			var attrs = ['class', 'href', 'id', 'poster', 'src', 'srcset'];

			for(var i = 0; i < attrs.length; i ++)
			{
				if(this.hasAttribute('lazy-' + attrs[i]))
				{
					img.attr(attrs[i], img.attr('lazy-' + attrs[i])).removeAttr('lazy-' + attrs[i]);
				}
			}
		});
	};

	window.jQuery.fn.getlazyloaders = window.jQuery.fn.getLazyLoaders = function()
	{
		return window.jQuery(this).find(
			'[lazy-background-image]:not(.lazyload-loaded),' +
			'[lazy-class]:not(.lazyload-loaded),'            +
			'[lazy-href]:not(.lazyload-loaded),'             +
			'[lazy-id]:not(.lazyload-loaded),'               +
			'[lazy-poster]:not(.lazyload-loaded),'           +
			'[lazy-src]:not(.lazyload-loaded),'              +
			'[lazy-srcset]:not(.lazyload-loaded),'           +
			'[lazy-style]:not(.lazyload-loaded)'
		);
	};

	doc.getLazyLoaders().lazyLoad();

	window.jQuery(document.documentElement).addClass('lazyload-loaded');

	offsets();
	check();

	setInterval(function()
	{
		if(lazyLoad.length > 0)
		{
			var nll = [];

			for(var i = 0; i < lazyLoad.length; i ++)
			{
				if(lazyLoad[i])
				{
					nll.push(lazyLoad[i]);
				}
			}

			if(nll.length != lazyLoad.length)
			{
				lazyLoad = nll;
			}
		}
	}, 3000);

	doc.on('scroll', function()
	{
		offsets();
		check();
	});
});
