$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initArtCateList();

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // 通过调用 template 插件，将 标准模板 和 要填充的数据 写入，注意，这里的类名不加标识符
                var htmlStr = template('tpl-table', res);
                // 将已格式化的文本数据填入要渲染的模块中
                $('tbody').html(htmlStr)
            }
        })
    };

    // 为添加类别按钮绑定点击事件
    // indexAdd 索引是为了关闭弹出层，不比关心返回的索引值是多少，只要让这个索引值为 indexAdd 就可，以下的相关索引都是一样的道理
    var indexAdd = null;

    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            // 在 html 页面中定义一个标准的表单模板，然后使用 html() 来获取这个表单结构
            content: $('#dialog-add').html()
        })
    });

    // 因为本来没有这个表单的，是点击添加按钮之后才生成的，所以只能通过代理的形式，给页面添加提交事件，然后代理给表单，来为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList();
                layer.msg('新增分类成功！');
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    });

    // 通过代理的形式，为 btn-edit 按钮绑定点击事件
    var indexEdit = null;
    // 通过给表格添加事件来代理到按钮身上
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        // 通过 id 将对应的表单中的数据填充到弹出层中
        var id = $(this).attr('data-id');
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        });
    });

    // 通过代理的形式，为修改分类的表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！');
                layer.close(indexEdit);
                initArtCateList();
            }
        })
    });

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })
        })
    });
})