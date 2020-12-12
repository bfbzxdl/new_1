$(function() {
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo();

    // 先获取 layui 中的 layer 对象
    var layer = layui.layer;

    // 点击按钮，实现退出功能,layui 中的控件
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            // 1. 清空本地存储中的 token
            localStorage.removeItem('token');
            // 2. 重新跳转到登录页面
            location.href = '/login.html';

            // 关闭 confirm 询问框，不可删掉，控件自带的
            layer.close(index);
        })
    })
});


// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 是请求头配置对象，可以在 baseAPI 中统一设置
        // headers: {
        // 从浏览器的本地仓库中求出之前生成的权限密匙 token
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // 先判断用户信息请求是否成功
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },

        // 阻止用户不经过登录直接访问后台页面
        // 可以直接写到 baseAPI 中，进行全局设置

        // 每次发起请求，不论是否成功或失败，最终都会调用 complete 回调函数
        // complete: function(res) {
        //     // 在 complete 回调函数中，可以使用自带的 res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1. 强制清空 token
        //         localStorage.removeItem('token');
        //         // 2. 强制跳转到登录页面
        //         location.href = '/login.html';
        //     }
        // }
    });
};

// 渲染用户的头像
function renderAvatar(user) {
    // 1. 获取用户的名称
    // 优先使用昵称，其次使用用户名
    var name = user.nickname || user.username;
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp&nbsp' + name);
    // 3. 按需渲染用户的头像
    // 先判断用户是否有图片头像，如果有，则优先使用；如果没有，则使用 name 的第一个字符串的大写来代替
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide();
        // 字符串可以像数组那样操作，来获取第一个字符串并转换成大写
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
        // console.log(first);
    }
}