(function($){
	var Dialog = function(config){
		//默认设置
		this.config = {
			width: 'auto',
			height: 'auto',
			message: '',
			type: 'loading',
			buttons: null,
			delay: null,
			maskOpacity: null,
			maskClose: true,
			callback: null,
			handlerConfirm: null,
			handlerCancel: null,
			effect: true
		}
		//判断是否传参并且是纯对象
		if(this.config && $.isPlainObject(config)){
			$.extend(this.config, config)
		}else{
			this.isConfig = true
		}
		this.render()
	}
	Dialog.prototype = {
		//渲染组件
		render: function(){
			var _this = this,
			    config = this.config;
			this.modal = $('<div class="dialog-modal"></div>');
			this.dialog = $('<div class="dialog-container"></div>');
			var header = $('<div class="dialog-header"></div>'),
			    body = $('<div class="dialog-body"></div>');
			    footer = null;
			if(this.isConfig){
				this.dialog.addClass('waiting').append(header);
			}else{
				this.modal.css({
					background: 'rgba(0,0,0,'+config.maskOpcity+')'
				})
				this.dialog.width(config.width);
				this.dialog.height(config.height);
				this.dialog.addClass(config.type).append(header);
				if(config.message){
					this.dialog.append(body.html(config.message));
				}
				if(config.type == 'confirm'){
					footer = $('<div class="dialog-footer">\
						<button id="confirm" class="btn btn-success btn-confirm">确定</button>\
						<button class="btn btn-danger btn-cancel">取消</button>\
						</div>');
					this.dialog.append(footer)
				}
			}
			this.modal.append(this.dialog).appendTo($('body'))
			//阻止dialog冒泡事件
			this.dialog.on('click',function(e){
				e.stopPropagation()
			})
			//动画
			if(config.effect){
				_this.animate()
			}
			//设定时间自动销毁
			if(config.delay){
				window.setTimeout(function(){
					_this.destroy()
					config.callback && config.callback()
				},config.delay)
			}
			//点击遮罩销毁
			if(config.maskClose){
				this.modal.click(function(e){
					e.stopPropagation();
					_this.destroy()
				})
			}
			//确认事件处理
			if(config.handlerConfirm){
				$('.btn-confirm').on('click', function(){
					config.handlerConfirm();
					_this.destroy()
				})
			}
			//取消事件处理
			if(config.handlerCancel){
				$('.btn-cancel').on('click', function(){
					config.handlerCancel();
					_this.destroy()
				})
			}
		},
		//动画效果
		animate: function(){
				var _this = this.dialog;
				_this.css({'transform': 'translate(-50%, -50%) scale(0,0)'})
				window.setTimeout(function(){
					_this.css({'transform': 'translate(-50%, -50%) scale(1,1)'})
				},200)
		},
		//销毁方法
		destroy: function(){
			var _modal = this.modal;
			var _dialog = this.dialog;
			_dialog.find('.btn').off();
			_dialog.css({'transform': 'translate(-50%, -50%) scale(0,0)'})
			window.setTimeout(function(){
				_modal && _modal.remove();
			},200)
		}
	}
	window.Dialog = Dialog;
	$.dialog = function(config){
		return new Dialog(config)
	}
})(jQuery)