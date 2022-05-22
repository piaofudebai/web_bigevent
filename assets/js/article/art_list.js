$(function () {
    const layer = layui.layer
    const form = layui.form
    const laypage = layui.laypage
    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 5, // 每页显示几条数据，默认每页显示2条
        cate_id: "", // 文章分类的 Id
        state: "", // 文章的发布状态
    };
    // *获取文章表格数据
    const initTable = () => {
        $.ajax({
            type: "GET",
            url: '/my/article/list',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status !== 0) return layer.msg('获取文章列表失败！')
                layer.msg('获取文章列表成功！')
                const htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    initTable()

    //* 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    const initCate = () => {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) return layer.msg('获取文章分类数据失败')
                layer.msg('获取文章分类数据成功')
                const htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render('select')
            }
        })
    }
    initCate()

    //* 筛选功能
    $('#form-search').on('submit', (e) => {
        e.preventDefault();
        q.cate_id = $('[name=cate_id]').val()
        q.state = $('[name=state]').val()
        initTable()
    })


    // *定义分页函数
    const renderPage = (total) => {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout:['count','limit','prev','page','next','skip'],
            limits:[2,3,5,10],//每页展示多少条
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                q.pagenum = obj.curr
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除文章
    $('tbody').on('click','.btn-delete',function(e){
        const id=$(this).attr('data-id')
        // console.log(id);
        const len=$('.btn-delete').length
        layer.confirm('确认删除？',{icon:3,title:'提示',},function(index){
            $.ajax({
                type:'GET',
                url:'/my/article/delete/'+id,
                success:(res)=>{
                    if(res.status!==0) return layer.msg('删除文章失败！');
                    layer.msg('删除文章成功！');
                    if(len===1){
                        q.pagenum=q.pagenum===1?1:q.pagenum-1;
                    }
                    initTable();
                }
            })
            layer.close('index')
        })
    })
})