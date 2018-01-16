

var WebSocketInit = function(opt){
	var Obj = this;
	this.websocket = null;
	this.authStatus = false;
	this.openStatus = false;
	this.callMeList = [];
	this.config = opt;
	this.config.onAuth = this.config.onAuth ? this.config.onAuth : function(){};
	this.config.onSystemError = this.config.onSystemError ? this.config.onSystemError : function(){};
	this.config.onMessage = this.config.onMessage ? this.config.onMessage : function(){};
	this.config.onOpen = this.config.onOpen ? this.config.onOpen : function(){};
	this.config.onClose = this.config.onClose ? this.config.onClose : function(evt){};
	this.config.onError = this.config.onError ? this.config.onError : function(evt){};
	this.config.key = this.config.key ? this.config.key : '';  //本端KEY
	this.config.toKey = this.config.toKey ? this.config.toKey : '';  //对端KEY
	this.config.gateway = this.config.gateway ? this.config.gateway : '';  //服务器地址与端口
	this.onGetHistory = function(){};
	
	if(this.config.key == '' || this.config.gateway == '' || this.config.toKey == '' || this.config.token == ''){
		return false;
	}
	
	this.doOpen = function (){
		Obj.websocket = new WebSocket(Obj.config.gateway);
		Obj.websocket.onopen = function(evt){
			Obj.openStatus = true;
			Obj.config.onOpen();
			Obj.auth();  //发送认证信息
		};
		Obj.websocket.onclose = function(evt){
			Obj.openStatus = false;
			Obj.config.onClose(evt);
			if(Obj.config.reConnection){
				Obj.doOpen();
			}
		};
		Obj.websocket.onmessage = function(evt) {
			Obj.data = JSON.parse(evt.data);
			switch(Obj.data.cmd){
				case 'auth':  //认证
					Obj.authStatus = false;
					if(Obj.data.status == 1){
						Obj.authStatus = true;  //认证成功
					}
					Obj.callMeList = Obj.data.callMeList;
					Obj.config.onAuth();
					break;
				case 'error':  //错误
					Obj.config.onSystemError();
					break;
				case 'online':  //上线
					Obj.config.onLine();
					break;
				case 'offline':  //离线
					Obj.config.onOffline();
					break;
				case 'getHistory':  //获取离线信息
					if(Obj.onGetHistory){
						Obj.onGetHistory();
					}
					break;
				default:  //其他消息
					Obj.config.onMessage();
					break;
			}
		};
		Obj.websocket.onerror = Obj.config.onError;
	}
	this.auth = function(){
		Obj.send({cmd: "auth", key: (Obj.config.key ? Obj.config.key : ''), toKey: (Obj.config.toKey ? Obj.config.toKey : ''), proxyKey: (Obj.config.proxyKey ? Obj.config.proxyKey : ''), token: (Obj.config.token ? Obj.config.token : '')});
	}
	this.getHistory = function(type, key, toKey, page, pageSize, callback){
		type = type ? type : 0;   //聊天记录的类型，0=历史记录，1=仅获取未读，2=仅获取已读的
		key = key ? key : Obj.config.key;
		toKey = toKey ? toKey : Obj.config.toKey;
		Obj.onGetHistory = callback ? callback : Obj.onGetHistory;
		page = page ? parseInt(page) : 1;
		pageSize = pageSize ? parseInt(pageSize) : 32;
		Obj.send({cmd: "getHistory", type: type, key: key, toKey: toKey, proxyKey: (Obj.config.proxyKey ? Obj.config.proxyKey : ''), page: page, pageSize: pageSize});
	}
	this.send = function(message){
		message = message ? message : {};
		Obj.websocket.send(JSON.stringify(message)); 
	}
	this.getData = function(){
		return Obj.data;
	}
	
	this.doOpen();
	
	return Obj;
}