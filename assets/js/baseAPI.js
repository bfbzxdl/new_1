// 注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数 （默认的方式）
// 在这个函数中，可以拿到我们给 Ajax 提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径
    // options 形参用来接收每次发送请求时，提交的对象，
    // 然后用这个对象中的 url 来修改每次请求时的地址
    // 其中，字符串中的内容根据实际需要更改
    // 此次修改过后，不用再在自己编写的 js 文件中输入根路径了
    // 只需要输入每次请求时的接口 URL 就行
    // 同时，如果项目请求的根路径发生改变时，直接在此快捷修改
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})