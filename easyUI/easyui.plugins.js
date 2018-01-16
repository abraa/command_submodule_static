$.extend($.fn.form.methods, {
    getData: function(jq, params){
        var formArray = jq.serializeArray();
        var oRet = {};
        for (var i in formArray) {
            if (typeof(oRet[formArray[i].name]) == 'undefined') {
                if (params) {
                    oRet[formArray[i].name] = (formArray[i].value == "true" || formArray[i].value == "false") ? formArray[i].value == "true" : formArray[i].value;
                }
                else {
                    oRet[formArray[i].name] = formArray[i].value;
                }
            }
            else {
                if (params) {
                    oRet[formArray[i].name] = (formArray[i].value == "true" || formArray[i].value == "false") ? formArray[i].value == "true" : formArray[i].value;
                }
                else {
                    oRet[formArray[i].name] += "," + formArray[i].value;
                }
            }
        }
        return oRet;
    }
});

$.extend($.fn.validatebox.defaults.rules, {
    eqPwd : {
        validator : function(value, param) {
            return value == $(param[0]).val();
        },
        message : '密码不一致！'
    },
    idcard : {// 验证身份证
        validator : function(value) {
            return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
        },
        message : '身份证号码格式不正确'
    },
    minLength: {
        validator: function(value, param){
            return value.length >= param[0];
        },
        message: '请输入至少（2）个字符.'
    },
    length:{validator:function(value,param){
        var len=$.trim(value).length;
        return len>=param[0]&&len<=param[1];
    },
        message:"输入内容长度必须介于{0}和{1}之间."
    },
    phone : {// 验证电话号码
        validator : function(value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message : '格式不正确,请使用下面格式:010-88888888'
    },
    mobile : {// 验证手机号码
        validator : function(value) {
            return /^(13|15|18)\d{9}$/i.test(value);
        },
        message : '手机号码格式不正确'
    },
    intOrFloat : {// 验证整数或小数
        validator : function(value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message : '请输入数字，并确保格式正确'
    },
    currency : {// 验证货币
        validator : function(value) {
            return /^\d+(\.\d+)?$/i.test(value);
        },
        message : '货币格式不正确'
    },
    qq : {// 验证QQ,从10000开始
        validator : function(value) {
            return /^[1-9]\d{4,9}$/i.test(value);
        },
        message : 'QQ号码格式不正确'
    },
    integer : {// 验证整数
        validator : function(value) {
            return /^[+]?[1-9]+\d*$/i.test(value);
        },
        message : '请输入整数'
    },
    age : {// 验证年龄
        validator : function(value) {
            return /^(?:[1-9][0-9]?|1[01][0-9]|120)$/i.test(value);
        },
        message : '年龄必须是0到120之间的整数'
    },
    chinese : {// 验证中文
        validator : function(value) {
            return /^[\Α-\￥]+$/i.test(value);
        },
        message : '请输入中文'
    },
    english : {// 验证英语
        validator : function(value) {
            return /^[A-Za-z]+$/i.test(value);
        },
        message : '请输入英文'
    },
    unnormal : {// 验证是否包含空格和非法字符
        validator : function(value) {
            return /.+/i.test(value);
        },
        message : '输入值不能为空和包含其他非法字符'
    },
    username : {// 验证用户名
        validator : function(value) {
            return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
        },
        message : '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
    },
    faxno : {// 验证传真
        validator : function(value) {
            return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
        },
        message : '传真号码不正确'
    },
    zip : {// 验证邮政编码
        validator : function(value) {
            return /^[0-9]\d{5}$/i.test(value);
        },
        message : '邮政编码格式不正确'
    },
    ip : {// 验证IP地址
        validator : function(value) {
            return /d+.d+.d+.d+/i.test(value);
        },
        message : 'IP地址格式不正确'
    },
    name : {// 验证姓名，可以是中文或英文
        validator : function(value) {
            return /^[\Α-\￥]+$/i.test(value)|/^\w+[\w\s]+\w+$/i.test(value);
        },
        message : '请输入姓名'
    },
    msn:{
        validator : function(value){
            return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
        },
        message : '请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
    }
});
var shadow = {
    dgShadow: '', dgMask: '', dgContainer: '', dgButton: '', dgForm: '', dgFrame: '', dgFrameBody: '',
    iFrame: '',
    options: {width:640, modal:true, data: [],
        queryParams: {},
        buttons: [{
            text: '确定',
            iconCls: 'fa fa-check',
            handler : function() {
                if(shadow.dgForm.length > 0) {
                    try{
                        shadow.dgFrame.onSubmit();
                    }catch (ex){}
                    result = shadow.dgFrame.easyui.submit(shadow.dgForm);
                    if(!result) return false;
                    parent.easyui.alert(result.msg, function(){
                        if(result.code){
                            //如果提交成功，关闭弹出窗口
                            shadow.destroy();
                            try{
                                //如果回调函数存在则调用
                                shadow.options.handler.call(this, result);
                            }catch (e){}
                        }
                    });
                    return false;
                }else {
                    try{
                        //获取返回数据
                        result = shadow.dgFrame.onReturn();
                        try{
                            shadow.options.handler.call(this, result);
                        }catch (e){}
                    }catch (e){}
                    try{
                        //执行确认函数
                        shadow.dgFrame.onConfirm();
                    }catch (e){}
                    shadow.destroy();
                }
            }
        },{
            text: ' 取消 ',
            iconCls: 'fa fa-ban',
            handler: function(){
                shadow.destroy();
            }
        }],
        handler: false
    },
    open: function(options) {
        shadow.options = $.extend(shadow.options, options);
        shadow.options.data = empty(shadow.options.data) ? [] : shadow.options.data;
        //创建覆盖层
        if(empty(shadow.dgMask)) {
            if(shadow.options.modal) {
                shadow.dgMask = $('<div/>');
                shadow.dgMask
                    .addClass('shadow-mask')
                    .appendTo($(document.body));
            }
        }

        if(empty(shadow.dgShadow)) {
            shadow.dgShadow = $('<div/>');
            shadow.dgShadow
                .addClass('shadow')
                .appendTo($(document.body));
        }
        shadow.dgShadow
            .animate({width:shadow.options.width},"slow", function(){
                //创建内容框
                if(shadow.dgShadow.find(shadow.dgContainer).length < 1) {
                    shadow.dgContainer = $('<div/>')
                        .addClass('shadow-container').appendTo(shadow.dgShadow);
                }
                shadow.html();

                //创建按钮框
                if(shadow.dgShadow.find(shadow.dgButton).length < 1) {
                    shadow.dgButton = $('<div/>')
                        .addClass('shadow-button').appendTo(shadow.dgShadow);
                }else{
                    shadow.dgButton.empty();
                }

                //创建按钮
                for(var ins in shadow.options.buttons) {
                    var button = shadow.options.buttons[ins];
                    var btn = $('<a/>')
                        .linkbutton({
                            text: button.text,
                            iconCls: button.iconCls,
                            onClick: button.handler
                        });
                    shadow.dgButton.append(btn);
                }
            });
    },
    html: function(){
        //加载内容
        if(!empty(shadow.options.href)) {
            var url = http_build_query(shadow.options.href,shadow.options.queryParams);
            if(shadow.dgContainer.find(shadow.iFrame).length < 1) {
                shadow.iFrame = $('<iframe/>');
                shadow.iFrame.attr({width:'100%',height:'100%', src: url, frameBorder: 0})
                    .appendTo(shadow.dgContainer);
            }else {
                shadow.iFrame.attr('src', url);
            }

            shadow.iFrame.load(function(){
                shadow.dgFrame = shadow.iFrame.get(0).contentWindow;
                shadow.dgFrameBody = shadow.dgFrame.$(document.body);
                shadow.dgFrame.$(function(){
                    shadow.dgForm = shadow.dgFrame.$('form');
                    if(shadow.dgForm.length > 0) {
                        shadow.dgForm.form('load', shadow.options.data);
                    }
                    if(function_exists(shadow.dgFrame.setData)) {
                        shadow.dgFrame.setData(shadow.options.data);
                    }
                });
            });
        }
    },
    destroy: function() {
        shadow.dgButton.remove();
        shadow.dgForm.hide('fast');
        shadow.dgShadow.animate({width:'0px'},'slow',function () {
            try {
                //清除框架
                shadow.dgFrame.document.write('');
                shadow.dgFrame.close();
                shadow.iFrame.remove();
                if(/msie/.test(navigator.userAgent.toLowerCase())){
                    CollectGarbage();
                }
                shadow.dgShadow.remove();
                shadow.dgShadow = '';
                shadow.dgMask.remove();
                shadow.dgMask = '';
            }catch(e) {}
        });
    }
};