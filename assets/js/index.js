$(function () {
    getUserInfo();

    // 退出登录
    const layer = layui.layer;
    $('#btnLogout').click(() => {
        layer.confirm(
            "确定退出登录？", {
                icon: 3,
                title: ""
            },
            function (index) {
                // 清空本地存储里面的 token
                localStorage.removeItem("token");
                // 重新跳转到登录页面
                location.href = "/login.html";
            }
        );
    });

});

const layer = layui.layer;
// 获取用户信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: '/my/userinfo',
        // headers: {
        //     // 在请求头里注入token
        //     Authorization:localStorage.getItem('token'),
        // }, 
        success: (res) => {
            // console.log(res);
            if (res.status !== 0) return layer.msg('获取用户信息失败')
            layer.msg('获取用户信息成功')
            // 调用渲染头像函数
            renderAvatar(res.data)
        }
       
    })
}

// 渲染头像函数
const renderAvatar = (user) => {
    // 获取名字
    const name = user.nickname || user.username
    // 设置欢迎文本
    $('#welcome').html(`欢迎 ${name}`)
    // 按需渲染头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide();
        const firtName = name[0].toUpperCase();
        $('.text-avatar').html(firtName).show()
    }
}
function change(){
    $('#art_list').addClass('layui-this').next().removeClass('layui-this')
}