<template>
  <div id="admin_addBook">
    <el-card :body-style="{ padding: 0 }">
      <template v-slot:header>
        <div class="clearfix">
          <span style="line-height: 36px">书籍{{ id ? '编辑' : '增加' }}</span>
          <router-link class="pull-right" :to="'/admin/book/list'">
            <el-button>返回</el-button>
          </router-link>
        </div>
      </template>
      <el-form :model="formData" label-width="86px" style="padding: 20px" ref="form" :rules="rules">
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="ISBN" prop="isbn">
              <div class="ISBNWrap">
                <el-input
                  placeholder="请填写该书的ISBN，然后点击右边按钮抓取信息"
                  v-model="formData.isbn"
                ></el-input>
                <div class="ISBNActions">
                  <el-button type="primary" @click="fetchInfoByISBN">同步</el-button>
                  <el-button @click="openBookSearch">搜索书籍</el-button>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input placeholder="请填写该书的标题" v-model="formData.title"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input placeholder="请填写该书的作者" v-model="formData.author"></el-input>
            </el-form-item>
            <el-form-item label="一级分类" prop="tag_1st">
              <el-select v-model="formData.tag_1st">
                <el-option
                  v-for="item in tags"
                  :label="item.name"
                  :value="item.name"
                  :key="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="二级分类" prop="tag_2nd">
              <el-select v-model="formData.tag_2nd">
                <el-option v-for="item in tags_2nd" :label="item" :value="item" :key="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号" prop="identifierList">
              <el-select
                v-model="formData.identifierList"
                multiple
                filterable
                allow-create
                placeholder="请输入编号"
              >
                <el-option
                  v-for="identifier in formData.identifierList"
                  :key="identifier"
                  :label="identifier"
                  :value="identifier"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="封面" prop="image">
              <el-input placeholder="请填写该书的封面图片" v-model="formData.image"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="summary">
              <el-input
                type="textarea"
                placeholder="请填写该书的简介"
                v-model="formData.summary"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="btns clearfix">
        <el-button class="pull-right" @click="reset" style="margin-left: 10px">重置</el-button>
        <el-button type="primary" class="pull-right" @click="save">保存</el-button>
      </div>
    </el-card>

    <el-dialog v-model="bookSearchVisible" title="搜索书籍" width="720px">
      <div class="bookSearchBar">
        <el-input
          v-model="bookSearchKeyword"
          placeholder="请输入书名"
          clearable
          @keyup.enter="searchBooks"
        ></el-input>
        <el-button type="primary" :loading="bookSearchLoading" @click="searchBooks">
          搜索
        </el-button>
      </div>
      <div v-if="bookSearchResults.length" class="bookSearchList">
        <el-popover
          v-for="book in bookSearchResults"
          :key="book.bookId"
          placement="right-start"
          :width="280"
          trigger="hover"
        >
          <template #default>
            <div class="bookSearchSummary">
              {{ book.summaryLoading ? '正在加载简介...' : book.summary || '暂无简介' }}
            </div>
          </template>
          <template #reference>
            <div
              class="bookSearchItem"
              :class="{ selected: selectedBook && selectedBook.bookId === book.bookId }"
              @click="selectBook(book)"
              @mouseenter="loadBookSummary(book)"
            >
              <img :src="book.cover" :alt="book.title" class="bookSearchCover" />
              <div class="bookSearchInfo">
                <div class="bookSearchTitle" :title="book.title">{{ book.title }}</div>
                <div class="bookSearchAuthor">{{ book.author || '未知作者' }}</div>
                <div class="bookSearchRating">
                  评分：{{ book.newRating ? (book.newRating / 100).toFixed(1) : '-' }}
                </div>
              </div>
            </div>
          </template>
        </el-popover>
      </div>
      <el-empty v-else description="暂无搜索结果"></el-empty>
      <template v-slot:footer>
        <el-button @click="bookSearchVisible = false">取消</el-button>
        <el-button type="primary" :loading="bookDetailLoading" @click="confirmBookSelection">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { fetch } from '@/assets/js/fetch'

export default {
  data: () => ({
    id: '',
    formData: {
      isbn: '',
      detailURL: '',
      identifierList: [],
      title: '',
      summary: '',
      image: '',
      author: '',
      tag_1st: '',
      tag_2nd: '',
    },
    tags: [],
    tags_2nd: [],
    bookSearchVisible: false,
    bookSearchKeyword: '',
    bookSearchResults: [],
    selectedBook: null,
    bookSearchLoading: false,
    bookDetailLoading: false,
    rules: {
      isbn: [
        {
          required: true,
        },
      ],
      identifierList: [
        {
          required: true,
        },
      ],
      title: [
        {
          required: true,
        },
      ],
      author: [
        {
          required: true,
        },
      ],
      tag_1st: [
        {
          required: true,
        },
      ],
      tag_2nd: [
        {
          required: true,
        },
      ],
    },
  }),
  mounted() {
    this.loadTags()
    this.getBook()
  },
  watch: {
    $route: 'getBook',
    'formData.tag_1st'(val) {
      this.formData.tag_2nd = ''
      for (let item of this.tags) {
        if (item.name == val) {
          this.tags_2nd = item.tags_2nd
          break
        }
      }
    },
  },
  methods: {
    openBookSearch() {
      this.bookSearchVisible = true
      this.bookSearchKeyword = ''
      this.bookSearchResults = []
      this.selectedBook = null
    },
    async searchBooks() {
      if (!this.bookSearchKeyword.trim()) {
        this.$message.warning('请输入书名！')
        return
      }
      this.bookSearchLoading = true
      this.selectedBook = null
      try {
        const response = await axios.post('/api/weread/gateway', {
          api_name: '/store/search',
          scope: 10,
          keyword: this.bookSearchKeyword.trim(),
        })
        const results = response.data.results || response.data.data?.results || []
        this.bookSearchResults = results.flatMap((group) =>
          (group.books || []).map((item) => item.bookInfo).filter(Boolean),
        )
        if (!this.bookSearchResults.length) this.$message.info('没有找到相关书籍')
      } catch (error) {
        this.$message.error(error.message || '搜索书籍失败')
      } finally {
        this.bookSearchLoading = false
      }
    },
    selectBook(book) {
      this.selectedBook = book
    },
    async loadBookSummary(book) {
      if (book.summaryLoaded || book.summaryLoading) return
      book.summaryLoading = true
      try {
        const response = await axios.post('/api/weread/gateway', {
          api_name: '/book/info',
          bookId: book.bookId,
        })
        const detail = response.data.data || response.data
        book.summary = detail.intro || ''
      } catch {
        book.summary = ''
      } finally {
        book.summaryLoading = false
        book.summaryLoaded = true
      }
    },
    async confirmBookSelection() {
      if (!this.selectedBook) {
        this.$message.warning('请选择一本书！')
        return
      }
      this.bookDetailLoading = true
      try {
        const response = await axios.post('/api/weread/gateway', {
          api_name: '/book/info',
          bookId: this.selectedBook.bookId,
        })
        const book = response.data.data || response.data
        this.formData.isbn = book.isbn || ''
        this.formData.detailURL = book.deepLink || ''
        this.formData.title = book.title || ''
        this.formData.summary = book.intro || ''
        this.formData.image = book.cover || ''
        this.formData.author = book.author || ''
        this.bookSearchVisible = false
      } catch (error) {
        this.$message.error(error.message || '获取书籍详情失败')
      } finally {
        this.bookDetailLoading = false
      }
    },
    async fetchInfoByISBN() {
      if (this.formData.isbn) {
        try {
          const res = await fetch({
            method: `/book/isbn/${encodeURIComponent(this.formData.isbn)}`,
            type: 'get',
          })
          this.formData.title = res.title || ''
          this.formData.detailURL = res.detailURL || ''
          this.formData.summary = res.summary || ''
          this.formData.image = res.image || ''
          this.formData.author = res.author || ''
        } catch (error) {
          this.$message.error(error.message || '获取书籍信息失败')
        }
      } else {
        this.$message.warning('请填写ISBN！')
      }
    },
    loadTags() {
      fetch({ method: '/tag', type: 'get' }).then((res) => {
        this.tags = res
      })
    },
    getBook() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id
        fetch({
          method: '/book/' + this.$route.query.id,
          type: 'get',
        }).then((res) => {
          this.formData = res
        })
      } else {
        this.reset()
      }
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          fetch({ method: '/book', data: this.formData }).then(() => {
            if (this.id) {
              this.$message.success('编辑成功！')
            } else {
              this.$message.success('保存成功！')
              this.reset()
            }
          })
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
    },
  },
}
</script>

<style lang="less" scoped>
#admin_addBook {
  .btns {
    border-top: 1px solid #d9d9d9;
    padding: 16px;
    background-color: #f8f8f8;
  }
  .ISBNWrap {
    width: 100%;
    position: relative;
    .ISBNActions {
      position: absolute;
      right: 0;
      top: 1px;
      display: flex;
      gap: 4px;
      background-color: #fff;
    }
  }
  .bookSearchBar {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    .el-button {
      flex-shrink: 0;
    }
  }
  .bookSearchList {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
    max-height: 420px;
    overflow-y: auto;
    padding: 2px;
  }
  .bookSearchItem {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 104px;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    cursor: pointer;
    transition: border-color 120ms linear, background-color 120ms linear;

    &:hover,
    &.selected {
      border-color: #409eff;
      background-color: #f0f8ff;
    }
  }
  .bookSearchCover {
    width: 62px;
    height: 88px;
    flex-shrink: 0;
    object-fit: cover;
    background-color: #f5f7fa;
  }
  .bookSearchInfo {
    min-width: 0;
    padding: 4px 12px;
  }
  .bookSearchTitle {
    color: #303133;
    font-size: 15px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .bookSearchAuthor,
  .bookSearchRating {
    color: #909399;
    font-size: 13px;
    margin-top: 12px;
  }
  .bookSearchSummary {
    padding: 10px;
    color: #606266;
    font-size: 13px;
    line-height: 1.6;
  }
}
</style>

<style lang="less">
#admin_addBook .el-card__header {
  padding: 12px 16px;
}
</style>
