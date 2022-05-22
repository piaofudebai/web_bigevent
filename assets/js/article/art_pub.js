$(function () {
    const layer = layui.layer
    const form = layui.form

    const initCate = () => {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) return layer.msg('获取文章分类失败！')
                layer.msg('获取文章分类成功！')
                // 调用模板引擎，渲染分类的下拉菜单
                const htmlStr = template('tpl-cate', res)
                $("[name=cate_id]").html(htmlStr)
                // 一定要记得调用 form.render() 方法 否则看不到页面的变化
                form.render('select')
            }
        })
    }
    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 点击上传图片
    $('#btnChooseImage').click(() => {
        $('#coverFile').click();
    })

    //* 监听表单change事件
    $('#coverFile').on('change', function (e) {
        const files = e.target.files
        if (files.length === 0) return;
        const newImgUrl = URL.createObjectURL(files[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    let art_status = "已发布";
    // 点击存为草稿

    $('#btnSave2').click(() => {
        art_status = "草稿";
    })

    //监听form提交
    $('#form_pub').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault();
        // console.log(art_status)
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        const fd = new FormData($(this)[0]);
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_status)
        //    console.log(fd);
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    // 发起新增文章请求
    const publishArticle = (fd) => {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                if (res.status !== 0) return layer.msg('新增文章失败！')
                layer.msg('新增文章成功！')
                location.href = "/article/art_list.html"
                window.parent.change()
            }
        })
    }

})