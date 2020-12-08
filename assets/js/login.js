$(function() {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击“去登录”的链接
    $('#link_login').on('click', function() {
        $('.reg-box').hide();
        $('.login-box').show();
    });

    // 从 layui 中获取 form 对象
    // 只要导入了 layui 的 js 文件，就有 layui 对象了，类似与 jQuery 中的 $
    var form = layui.form;
    // 导入 layui 中的 layer 提示信息对象
    var layer = layui.layer;
    // 通过 form.verify() 函数，自定义校验规则
    form.verify({
        // 以下是两中不同的自定义校验规则的方法

        // 自定义一个名为 pwd 的校验规则

        // 此处正则表达式的 s 要大写，一定要注意大小写的区别

        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 注册表单，校验两次密码是否一致，自定义一个 repwd 的校验规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容，还需要获取密码框中的内容，然后进行一次判断，如果失败，则 return 一个提示信息
            // [] 表示的是属性选择器，空格代表的是后代选择器，因为 name 属性是其后代的属性
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    });

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起 Ajax 的 POST 请求
        $.post('/api/reguser', {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }, function(res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            };
            layer.msg(res.message);

            // 注册成功后，自动点击‘去登录’按钮，进行跳转
            $('#link_login').click();
        });
    });

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message);
                // 将登录成功得到的 token 字符串（后续进入有权限的网页必不可少的密匙），保存到 localStorage 中
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = '/index.html';
            }
        });
    })
});