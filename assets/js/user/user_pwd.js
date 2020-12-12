$(function() {
    var form = layui.form;

    form.verify({
        // 验证密码是否符合规范
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 验证新旧密码是否相同
        samePwd: function(value) {
            if (value === $('[name=oldPwd').val()) {
                return '新旧密码不能相同！'
            }
        },
        // 验证两次修改的密码是否一致
        rePwd: function(value) {
            if (value !== $('[name=newPwd').val()) {
                return '两次密码不一致！'
            }
        }
    });

    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！');
                // 重置表单，将 jquery 对象转换成原生对象
                $('.laiui-form')[0].reset();
            }
        })
    })
})