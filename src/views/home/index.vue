<template>
<div id="home_index">
    <div v-if="stitle" style="font-size: 14px;margin-bottom: 8px;color: #aaa;">搜索：`{{stitle}}`</div>
    <el-row :gutter="20">
        <el-col class="book" :span="4" v-for="(book,index) in books" :key="book._id" style="margin-bottom: 10px;">
            <a :href="'https://book.douban.com/subject/'+book.doubanID" target="_blank" :title="book.summary">
                <el-card :body-style="{ padding: '0px' }">
                    <img :src="book.images.large" class="image">
                    <div style="padding: 10px;">
                        <div class="title" :title="book.title">{{book.title}}</div>
                        <div class="num clearfix">
                            <span class="pull-left">总数：{{book.identifierList.length}}</span>
                            <span class="pull-right">剩余：{{book.identifierList.length - book.borrowers.length}}</span>
                        </div>
                    </div>
                </el-card>
            </a>
            <el-button type="danger" class="borrow" size="mini" :disabled="(book.identifierList.length - book.borrowers.length <= 0) || (userInfo && book.borrowers.some((user)=> user.name==userInfo.name))" @click="borrow(index)">借阅</el-button>
        </el-col>
    </el-row>
    <el-pagination
        class="pull-right"
        style="margin-top:20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[12, 24, 36]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
</div>
</template>
<script>
    export default {
        data:()=> ({
            stitle: '',
            books: [],
            total: 0,
            pageSize: 12,
            page: 1
        }),
        beforeRouteEnter (to, from, next) {
            next(vm => {
                vm.stitle = to.query.s;
                vm.page = 1;
                vm.search();
            })
        },
        beforeRouteUpdate (to, from, next) {
            this.stitle = to.query.s;
            this.page = 1;
            this.search();
            next();
        },
        computed: {
            userInfo(){
                return this.$store.state.userInfo;
            }
        },
        methods: {
            async search(title){
                let res = await Vue.fetch({method:'/book/search',type: 'get',data:{pageSize: this.pageSize, page: this.page, title: this.stitle || ''}})
                if(res){
                    this.books = res.results;
                    this.total = res.total
                    this.pageSize = res.pageSize
                    this.page = res.page
                }
            },
            async borrow(index){
                if(!this.userInfo) return this.$message.warning('请先登录！');

                const identifier = await Vue.fetch({method:'/user/borrow', data:{id: this.books[index]._id}})
                if(identifier){
                    this.$message.success(`去书架上领取吧，编号：${identifier}！`);
                    this.userInfo.borrowedBooks.push({id: this.books[index]._id, identifier});
                    this.books[index].borrowers.push({name: this.userInfo.name, identifier});
                }
            },
            handleSizeChange(val) {
                this.pageSize = val;
                //size改变的时候，有时候总页数会变少，currentpage有可能会大于新的总页数，之后会变为1，但这时候查询的时候currentpage还未变为1，就会查不到信息而报错，所以当发生这种情况，就让currentpagechange的时候再去search
                if( this.page > Math.ceil(this.total / val) ) return;
                this.search();
            },
            handleCurrentChange(val) {
                this.search();
            }
        }
    }
</script>
<style scoped lang="less">
    #home_index{
        .book{
            position: relative;
            overflow: hidden;

            .borrow{
                position: absolute;
                transition: top 100ms linear;
                left: 20px;
                top: -28px;
            }
            &:hover .borrow{
                top: 8px;
            }
            .image{
                width: 100%;
                height: 240px;
            }
            .title{
                color: #444;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .num{
                font-size: 14px;
                color: #8c7e7e;
                margin-top: 10px;
            }
        }
    }
</style>