<template>
  <div id="admin_borrowedList">
    <el-button-group style="margin-bottom: 10px">
      <el-button
        :icon="ElIconUpload"
        size="small"
        title="导出借书列表"
        @click="exportList"
      ></el-button>
    </el-button-group>
    <a v-if="exportURL" :href="exportURL" target="_blank" @click="download">{{
      exported ? '重新下载' : '点击下载'
    }}</a>
    <el-table :data="books" border style="width: 100%">
      <el-table-column property="isbn" label="ISBN" width="140">
      </el-table-column>
      <el-table-column
        property="title"
        label="书名"
        show-overflow-tooltip
        width="150"
      >
      </el-table-column>
      <el-table-column
        property="author"
        label="作者"
        show-overflow-tooltip
        width="120"
      >
      </el-table-column>
      <el-table-column
        property="identifierList.length"
        label="总数"
        align="center"
        width="70"
      >
      </el-table-column>
      <el-table-column label="分类" show-overflow-tooltip width="120">
        <template v-slot="{ row }">
          <span>{{ row.tag_1st }}-{{ row.tag_2nd }}</span>
        </template>
      </el-table-column>
      <el-table-column label="借出信息(借书人/书籍编号/借出时间)">
        <template v-slot="{ row }">
          <ul style="list-style: none; padding: 0">
            <li v-for="borrower in row.borrowers" :key="borrower.name">
              <span style="display: inline-block; width: 150px">{{
                borrower.name
              }}</span>
              <span style="display: inline-block; width: 150px">{{
                borrower.identifier
              }}</span>
              <span>{{ dateFormat(borrower.date) }}</span>
            </li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pull-right"
      style="margin-top: 20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
import { Upload as ElIconUpload } from '@element-plus/icons'
import dateFormat from '@/mixins/dateFormat'
import { fetch } from '@/assets/js/fetch'

export default {
  mixins: [dateFormat],
  data: () => ({
    ElIconUpload,
    books: [],
    exportURL: '',
    exported: false,
    total: 0,
    pageSize: 10,
    page: 1,
  }),
  created() {
    this.search()
  },
  methods: {
    search() {
      fetch({
        method: '/book/getBorrowedBooks',
        type: 'get',
        data: { pageSize: this.pageSize, page: this.page },
      }).then((res) => {
        this.books = res.results
        this.total = res.total
        this.pageSize = res.pageSize
        this.page = res.page
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      //size改变的时候，有时候总页数会变少，currentpage有可能会大于新的总页数，之后会变为1，但这时候查询的时候currentpage还未变为1，就会查不到信息而报错，所以当发生这种情况，就让currentpagechange的时候再去search
      if (this.page > Math.ceil(this.total / val)) return
      this.search()
    },
    handleCurrentChange(val) {
      this.page = val
      this.search()
    },
    download() {
      this.exported = true
    },
    async exportList() {
      const res = await fetch({ method: '/book/export', type: 'get' })
      if (res) {
        this.exportURL = res
        this.exported = false
      }
    },
  },
}
</script>
