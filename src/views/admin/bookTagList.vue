<template>
    <div id="admin_bookList">
        <el-button-group style="margin-bottom:10px">
            <el-button icon="el-icon-edit"  size="small" title="编辑" @click.native="edit"></el-button>
            <el-button icon="el-icon-delete"  size="small" title="删除" @click.native="remove"></el-button>
            <router-link to="/admin/book/addTag"><el-button icon="el-icon-plus" size="small" title="新增"></el-button></router-link>
        </el-button-group>
        <el-table
        :data="tags"
        border
        @selection-change="select"
        style="width: 100%">
            <el-table-column
            type="selection"
            width="50">
            </el-table-column>
            <el-table-column
            property="name"
            label="一级分类"
            width="130">
            </el-table-column>
            <el-table-column
            label="二级分类">
                <span slot-scope="{row}">{{row.tags_2nd.join()}}</span>
            </el-table-column>
            <el-table-column
            property="meta.createAt"
            label="添加时间"
            width="300">
            </el-table-column>
            <el-table-column
            property="meta.updateAt"
            label="更新时间"
            width="300">
            </el-table-column>
        </el-table>
        <el-pagination
          class="pull-right"
          style="margin-top:20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </div>
</template>

<script>
  import dateFormat from '../../mixins/dateFormat';
  export default {
    mixins: [dateFormat],
    data:()=> ({
        tags: [],
        selected: [],
        total: 0,
        pageSize: 10,
        page: 1
    }),
    created(){
        this.search()
    },
    methods: {
        search(){
            this.selected = [];
            Vue.fetch({method:'/tag/search',type: 'get',data:{pageSize: this.pageSize, page: this.page}}).then(res=>{
                for (const result of res.results) {
                    result.meta.createAt = this.dateFormat(result.meta.createAt);
                    result.meta.updateAt = this.dateFormat(result.meta.updateAt);
                }
                this.tags = res.results;
                this.total = res.total
                this.pageSize = res.pageSize
                this.page = res.page
            })
        },
        select(val){
            this.selected = val;
        },
        edit(){
            if(this.selected.length){
                if(this.selected.length == 1){
                    router.push("/admin/book/addTag?id="+this.selected[0]._id);
                }else{
                    this.$message.warning('只能选择一个标签进行编辑！');
                }
            }else{
                this.$message.warning('请选择要编辑的标签！');
            }
        },
        remove(){
            if(this.selected.length){
                let ids = [];
                for(let item of this.selected){
                    ids.push(item._id);
                }
                Vue.fetch({method:'/tag',type: 'delete',data:{ids: ids.join()}}).then(res=>{
                    this.$message.success('删除成功!');
                    this.search();
                })
            }else{
                this.$message.warning('请选择要删除的分类！');
            }
        },
        handleSizeChange(val) {
            this.pageSize = val;
            //size改变的时候，有时候总页数会变少，currentpage有可能会大于新的总页数，之后会变为1，但这时候查询的时候currentpage还未变为1，就会查不到信息而报错，所以当发生这种情况，就让currentpagechange的时候再去search
            if( this.page > Math.ceil(this.total / val) ) return;
            this.search();
        },
        handleCurrentChange(val) {
            this.page = val;
            this.search();
        }
    }
  }
</script>