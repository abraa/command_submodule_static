/**
 * 设置对象不可用
 * @param element
 */
function disable(element) {
    $(element).linkbutton('disable');
}

/**
 * 设置对象可用
 * @param element
 */
function enable(element) {
    $(element).linkbutton('enable');
}

/**
 * 判断字符是否为空
 * @param string
 * @returns {boolean}
 */
function empty(string) {
    if (typeof(string) == 'undefined') return true;
    if (string == '') return true;
    if (string == null) return true;
    return false;
}

/**
 * 计算对象的长度
 * @param o
 * @returns {*}
 */
function count(o) {
    var t = typeof o;
    if (t == 'string') {
        return o.length;
    } else if (t == 'object') {
        var n = 0;
        for (var i in o) {
            n++;
        }
        return n;
    }
    return false;
}

/**
 * 判断函数是否存在
 * @param name
 * @returns {boolean}
 */
function function_exists(name) {
    try {
        if (typeof(eval(name)) == "function") {
            return true;
        }
    } catch (e) {
    }
    return false;
}

/**
 * 创建完整URL
 * @param url
 * @param query
 * @returns {*}
 */
function http_build_query(url, query) {
    if ($.isEmptyObject(query)) return url;
    query = $.param(query);
    if (url.indexOf('?') > -1) {
        url += '&';
    } else {
        url += '?';
    }
    return url + query;
}

function tree(opt) {
    var isChange = false;
    var tree = this;
    opt = $.extend({
        data: null,
        dnd: true,
        lines: true,
        animate: true,
        checkbox: true,
        checkedDisabledClass: 'not-select-yes',
        noCheckedDisabledClass: 'not-select-no',
        cascadeCheck: false,
        onContextMenu: function (e, node) {
            e.preventDefault();
            false;
        }
    }, opt);
    var options = $.extend({
        onCheck: function (node, checked) {
            if (tree.lock == false && tree.isLeaf(node.target) == false) {
                tree.children(node.target, checked);
            }
            if (tree.lock == false && tree.isLeaf(node.target) == true) {
                tree.lock = true;
                tree.parent(node.target, checked);
                tree.lock = false;
            }
        },
        onclick: function (node) {
            if (tree.isLeaf(node.target) == false) {
                options.element.tree('toggle', node.target);
            } else {
                if (node.checked) {
                    tree.unCheck(node.target);
                } else {
                    tree.check(node.target);
                }
            }
        },
        onLoadSuccess: function (node, data) {
            var rows = options.element.tree('getChecked');
            for (var i in rows) {
                if (rows[i].disable) {
                    tree.disable(rows[i].target, true);
                    if (rows[i].unchecked) {
                        tree.grid.tree('uncheck', rows[i].target);
                    }
                }
            }
        }
    }, opt);
    this.lock = false;
    options.element.tree(options);

    this.disable = function (target, checked) {
        var className = checked ? options.checkedDisabledClass : options.noCheckedDisabledClass;
        $(target).children('.tree-checkbox').addClass(className).click(function () {
            return false;
        })
    };
    this.isDisable = function (target) {
        var checked = $(target).children('.tree-checkbox').hasClass(opt.checkedDisabledClass);
        var noCheck = $(target).children('.tree-checkbox').hasClass(opt.noCheckedDisabledClass);
        if (checked || noCheck) {
            return true;
        } else {
            return false;
        }
    };
    this.isLeaf = function (target) {
        return this.grid.tree('isLeaf', target);
    }
    this.check = function (target, lock) {
        if (lock) {
            this.lock = true;
        }
        if (this.isDisable(target) == false || isChange == true) {
            this.grid.tree('check', target);
        }
        if (lock) {
            this.lock = false;
        }
    };
    this.unCheck = function (target) {
        if (this.isDisable(target) == false) {
            this.grid.tree('uncheck', target);
        }
    };
    this.children = function (target, checked) {
        var children = this.grid.tree('getChildren', target);
        for (var i in children) {
            if (checked) {
                this.check(children[i].target);
            } else {
                this.unCheck(children[i].target);
            }
        }
    }
    this.parent = function (target, checked) {
        if (!target) {
            return false;
        }
        checked = checked ? checked : false;
        var parent = this.grid.tree('getParent', target);
        if (parent) {
            if (checked) {
                isChange = true;
                this.check(parent.target);
                isChange = false;
            } else {
                var children = this.grid.tree('getChildren', parent.target);
                for (var i in children) {
                    if (target != children[i].target && children[i].checked == true) {
                        checked = true;
                    }
                }
                if (checked == false) {
                    this.unCheck(parent.target);
                }
            }
            this.parent(parent.target, checked);
        }
    };
}

/**
 * 上传图片转base64
 * @param element
 */
function getImageToBase64(element) {
    var file = $(element).parent().find("input[type='file']");
    if(typeof (FileReader) === 'undefined'){
        result.html("抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！");
        file.attr('disabled', 'disabled');
    }else{
        $(file).change(function () {
            var file = this.files[0];
            //判断图片是否图片类型
            if (!/image\/\w+/.test(file.type)) {
                easyui.alert("只能选择图片");
                return false;
            }
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                var name = $(element).attr('name');
                var imageData = '<input name="'+name+'" value="'+this.result+'" style="display: none">';
                $(element).after(imageData);
                $(element).attr('src',this.result);
            }
        })
        file.click();
    }
}

