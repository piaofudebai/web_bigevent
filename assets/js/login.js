$(function () {
    $('#link_reg').click(() => {
        $('.login-box').hide();
        $('.reg-box').show()
    })
    $('#link_login').click(() => {
        $('.login-box').show();
        $('.reg-box').hide()
    });

    //获取form
    const form = layui.form

    // 定义表单验证规则
    form.verify({
        // 定义校验密码的规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //   定义确认密码规则
        repwd: (val) => {
            const pwd = $('.reg-box [name=password]').val()
            if (val !== pwd) return "两次输入密码不一致！";
        }
    })

    // 
    // const baseURL = 'http://www.liulongbin.top:3007'
    const layer = layui.layer //导入 layui 的弹窗组件

    // 监听注册表单提交，发起注册请求
    $('#form_reg').on('submit', function (e) {
        // 阻止 form 默认提交行为
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url:'/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val(),
            },
            success: (res) => {
                if (res.status !== 0) return layer.msg('注册失败')
                layer.msg('注册成功')
                // 手动调用去登录点击事件，实现跳转
                $('#link_login').click()
            }
        })
    })

    // 监听登录表单提交，发起登录请求
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        // console.log($(this).serialize());
        $.ajax({
            type: 'POST',
            url:'/api/login',
            data: $(this).serialize(),
            success: (res) => {
                console.log(res);
                if (res.status !== 0) return layer.msg('登录失败')
                layer.msg('登录成功')
                localStorage.setItem('token',res.token)
                location.href = "/index.html";
            }
        })
    })


});