$(function () {

    const layer = layui.layer


    const initArtCateList = () => {
        $.ajax({
            type: "GET",
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) return layer.msg('获取文章分类失败')
                layer.msg('获取文章分类成功')
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    initArtCateList();

    // const layer = layui.layer

    //* 添加类别弹窗
    let indexAdd = null
    $('#btnAddCate').click(() => {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $('#dialog-add').html()
        })
    })

    //* 通过代理监听submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg('添加分类失败')
                layer.msg('添加分类成功')
                layer.close(indexAdd) //通过索引关闭弹窗
                initArtCateList()
            }
        })
    })

    const form = layui.form
    //* 修改类别弹窗
    let indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $('#dialog-edit').html()
        })
        const id = $(this).attr('data-id')
        // console.log($(this).attr('data-id'));
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: (res) => {
                if (res.status !== 0) return layer.msg('获取文章分类失败！')
                layer.msg('获取文章分类成功！')
                form.val('form-edit', res.data)
            }
        })
    })

    //* 更新文章分类
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg('更新文章分类失败！')
                layer.msg('更新文章分类成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // *删除文章分类
    $('tbody').on('click', '.btn-delete', function () {
        const id = $(this).attr('data-id')
        layer.confirm(
            '确定删除嘛？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: (res) => {
                    if (res.status !== 0) return layer.msg('删除文章分类失败！')
                    layer.msg('删除文章分类成功！') 
                    initArtCateList()
                }
            })
        })
    })
})