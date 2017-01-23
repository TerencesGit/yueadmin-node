(function($){
	var Dialog = function(){
		//默认设置
		this.config = {
			width: 'auto',
			height: 'auto',
			title: '系统提示',
			message: '',
			delay: null,
			effect: false,
		};
		this.handlers = {};
	}
	Dialog.prototype = $.extend({}, {
		on: function(type, handler){
			if(typeof this.handlers[type] == 'undefined'){
				this.handlers[type] = [];
			}
			this.handlers[type].push(handler);
			return this;
		},
		fire: function(type, data){
			if(this.handlers[type] instanceof Array){
				var handlers = this.handlers[type];
				for(var i = 0,len = handlers.length;i<len;i++){
					handlers[i](data);
				}
			}
		},
		render: function(){
			var config = this.config,
					that = this;
			var header = $(' <div class="modal-header"><a class="close">×</a>\
									 <h4 class="modal-title">'+config.title+'</h4></div>'),
				  body = $('<div class="modal-body"><div class="modal-icon"></div>\
              		<div class="modal-message">'+config.message+'</div></div>'),
				  footer = $('<div class="modal-footer">\
                	 <button type="button" class="btn btn-info cancel">确定</button></div>');
			switch(config.type){
				case 'alert':
				  body = $('<div class="modal-body"><div class="modal-message">'+config.message+'</div></div>');
					break;
				case 'confirm':
					footer = $('<div class="modal-footer">\
                	 <button type="button" class="btn btn-success confirm">确定</button>\
                	 <button type="button" class="btn btn-danger cancel">取消</button></div>');
					break;
				case 'success':
				  body.addClass('success');
				  footer = '';
				 break;
				case 'fail':
					body.addClass('fail');
				 break;
			};
			this.mask = $('<div class="modal mask"></div>');
			this.dialog = $('<div class="modal-dialog"></div>');
			this.content = $('<div class="modal-content"></div>');
			this.content.append(header, body, footer).appendTo(this.dialog);
			this.mask.append(this.dialog).appendTo($('body'));
			if(config.delay){
				var _mask = this.mask;
				var _dialog = this.mask.find('.modal-dialog');
				setTimeout(function(){
					_dialog.find('.btn').off();
					_dialog.css({'transform': 'scale(0, 0)'});
					setTimeout(function(){
						_mask.remove()
					}, 500)
				}, config.delay)
			}
			if(config.effect){
				that.animate()
			}
			//事件绑定
			this.mask.delegate('.close', 'click',function(){
				that.fire('close');
				that.destroy();
			}).delegate('.confirm', 'click',function(){
				that.fire('confirm');
				that.destroy();
			}).delegate('.cancel', 'click',function(){
				that.fire('cancel');
				that.destroy();
			});
		},
		//动画
		animate: function(){
				var _this = this.dialog;
				_this.css({'transform': 'scale(0,0)'})
				setTimeout(function(){
					_this.css({'transform': 'scale(1,1)'})
				}, 200)
		},
		//销毁
		destroy: function(){
			this.mask && this.mask.find('.btn').off() && this.mask.remove()
		},
		alert: function(config){
			$.extend(this.config, config, {type: 'alert'});
			this.render();
			return this;
		},
		confirm: function(config){
			$.extend(this.config, config, {type: 'confirm'});
			this.render();
			return this;
		},
		success: function(config){
			$.extend(this.config, config, {type: 'success', effect: true});
			this.render();
			return this;
		},
		fail: function(config){
			$.extend(this.config, config, {type: 'fail'});
			this.render();
			return this;
		}
	})
	$.dialog = function(config){
		return new Dialog(config)
	}
})(jQuery)