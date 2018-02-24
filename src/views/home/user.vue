<template>
<div id="home_user">
    <el-table
    :data="borrowedBooks"
    stripe
    border
    empty-text="未有借书"
    style="width: 100%">"
        <el-table-column
        property="title"
        label="书名"
        show-overflow-tooltip
        width="200">
        </el-table-column>
        <el-table-column
        label="编号"
        width="100">
            <template slot-scope="{row}">
                {{userInfo.borrowedBooks.find(borrowedBook => {
                     return borrowedBook.id === row._id
                }).identifier}}
            </template>
        </el-table-column>
        <el-table-column
        property="author"
        label="作者"
        show-overflow-tooltip
        width="150">
        </el-table-column>
        <el-table-column
        label="分类"
        show-overflow-tooltip
        width="120">
            <span slot-scope="{row}">{{row.tag_1st}}-{{row.tag_2nd}}</span>
        </el-table-column>
        <el-table-column
        property="summary"
        label="简介"
        show-overflow-tooltip>
        </el-table-column>
        <el-table-column
        label="借书时间"
        width="250">
            <span slot-scope="{row}">{{dateFormat((row.borrowers.find((user)=> user.name == userInfo.name)).date)}}</span>
        </el-table-column>
        <el-table-column
        align="center"
        width="100"
        label="操作">
            <el-button
            slot-scope="{$index, row}"
            size="mini"
            type="danger"
            @click="returnBook($index, row)">
            归还
            </el-button>
        </el-table-column>
    </el-table>
</div>
</template>
<script>
    import dateFormat from '../../mixins/dateFormat';
    export default {
        mixins: [dateFormat],
        data:()=> ({
            borrowedBooks: []
        }),
        beforeRouteEnter (to, from, next) {
            if(Vue.isLogin()){
                next()
            }else{
                next(false)
            }
        },
        activated(){
            this.search();
        },
        computed: {
            userInfo(){
                return this.$store.state.userInfo;
            }
        },
        methods: {
            async search(){
                const bookIds = this.userInfo.borrowedBooks.map((book)=> book.id);
                if(bookIds.length){
                    let res = await Vue.fetch({method:'/book',type: 'get',data:{ids: bookIds.join()}})
                    if(res){
                        this.borrowedBooks = res;
                    }
                }
            },
            async returnBook(index,row){
                let res = await Vue.fetch({method:'/user/return',data:{id: row._id}})
                if(res){
                    this.borrowedBooks.splice(index,1);
                    this.$message.success('归还成功,请把书放回书架上！');

                    const i = this.userInfo.borrowedBooks.findIndex(borrowedBook=> {
                        return borrowedBook.id === row._id;
                    })
                    this.userInfo.borrowedBooks.splice(i,1);
                }
            }
        }
    }
</script>