$(function () {
    const form = layui.form
    const layer = layui.layer

    //* 自定义校验规则
    form.verify({
        nickname: (val) => {
            if (val.length > 6) return "昵称长度必须在1~6个字符之间!"
        }
    })
    // 获取用户基本资料
    const initUserInfo = () => {
        $.ajax({
            type: "GET",
            url: '/my/userinfo',
            success: (res) => {
                if (res.status !== 0) return layer.msg('获取用户信息失败！')
                layer.msg('获取用户信息成功！')
                // 为表单快速复制
                form.val('formUserInfo', res.data)
            }
        })
    }
    initUserInfo();

    // 实现点击重置
    $('#btnReset').click((e) => {
        e.preventDefault();
        initUserInfo();
    });

    // 更新用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(), //获取到填入的值
            success: (res) => {
                if (res.status !== 0) return layer.msg('更改用户信息失败')
                layer.msg('更改用户信息成功')

                // 调用index.js getUserInfo() 方法重新在首页渲染头像名称
                window.parent.getUserInfo()
            }
        })
    })
})