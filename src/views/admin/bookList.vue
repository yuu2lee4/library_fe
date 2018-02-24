<template>
    <div id="admin_bookList">
        <el-button-group style="margin-bottom:10px">
            <el-button icon="el-icon-edit"  size="small" title="编辑" @click.native="edit"></el-button>
            <el-button icon="el-icon-delete"  size="small" title="删除" @click.native="remove"></el-button>
            <router-link to="/admin/book/add"><el-button icon="el-icon-plus"  size="small" title="新增"></el-button></router-link>
        </el-button-group>
        <el-table
        :data="books"
        border
        @selection-change="select"
        style="width: 100%">
            <el-table-column
            type="selection"
            width="50">
            </el-table-column>
            <el-table-column
            property="isbn"
            label="ISBN"
            width="140">
            </el-table-column>
            <el-table-column
            property="title"
            label="书名"
            show-overflow-tooltip
            width="150">
            </el-table-column>
            <el-table-column
            property="author"
            label="作者"
            show-overflow-tooltip
            width="120">
            </el-table-column>
            <el-table-column
            property="identifierList.length"
            label="总数"
            align="center"
            width="70">
            </el-table-column>
            <el-table-column
            align="center"
            label="借出"
            width="80">
              <template slot-scope="{row}">
                <el-popover v-if="row.borrowers.length" trigger="hover" placement="top">
                  <table v-if=row.borrowers.length>
                    <tr><th>编号</th><th>借出人</th><th>借出时间</th></tr>
                    <tr v-for="borrower in row.borrowers" :key="borrower.name"><td>{{borrower.identifier}}</td><td>{{borrower.name}}</td><td>{{ dateFormat(borrower.date) }}</td></tr>
                  </table>
                  <div slot="reference" class="name-wrapper">
                    <el-tag>查看({{ row.borrowers.length}})</el-tag>
                  </div>
                </el-popover>
                <template v-else>{{ row.borrowers.length}}</template>
              </template>
            </el-table-column>
            <el-table-column
            label="分类"
            show-overflow-tooltip
            width="120">
              <span slot-scope="{row}">{{row.tag_1st}}-{{row.tag_2nd}}</span>
            </el-table-column>
            <el-table-column
            property="image"
            label="封面"
            show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            property="doubanID"
            label="豆瓣ID"
            width="100">
            </el-table-column>
            <el-table-column
            property="summary"
            label="简介"
            show-overflow-tooltip>
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
      books: [],
      selected: [],
      total: 0,
      pageSize: 10,
      page: 1
    }),
    created(){
      this.search();
    },
    methods: {
      search(){
        this.selected = [];
        Vue.fetch({method:'/book/search',type: 'get',data:{pageSize: this.pageSize, page: this.page}}).then(res=>{
          this.books = res.results;
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
            router.push("/admin/book/add?id="+this.selected[0]._id);
          }else{
            this.$message.warning('只能选择一本书进行编辑！');
          }
        }else{
          this.$message.warning('请选择要编辑的书本！');
        }
      },
      remove(){
        if(this.selected.length){
          let ids = [];
          for(let item of this.selected){
            ids.push(item._id);
          }
          Vue.fetch({method:'/book',type: 'delete',data:{ids: ids.join()}}).then(res=>{
            this.$message.success('删除成功!');
            this.search();
          })
        }else{
          this.$message.warning('请选择要删除的书本！');
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