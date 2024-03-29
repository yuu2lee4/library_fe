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
      <el-form
        :model="formData"
        label-width="86px"
        style="padding: 20px"
        ref="form"
        :rules="rules"
      >
        <el-row :gutter="40">
          <el-col :span="12">
            <el-form-item label="ISBN" prop="isbn">
              <div class="ISBNWrap">
                <el-input
                  placeholder="请填写该书的ISBN，然后点击右边按钮抓取信息"
                  v-model="formData.isbn"
                ></el-input>
                <el-button
                  type="primary"
                  class="btn"
                  @click="fetchInfoFromDouBan"
                  >同步</el-button
                >
              </div>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input
                placeholder="请填写该书的标题"
                v-model="formData.title"
              ></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
              <el-input
                placeholder="请填写该书的作者"
                v-model="formData.author"
              ></el-input>
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
                <el-option
                  v-for="item in tags_2nd"
                  :label="item"
                  :value="item"
                  :key="item"
                >
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
            <el-form-item label="豆瓣ID" prop="doubanID">
              <el-input
                placeholder="请填写该书的豆瓣ID"
                v-model="formData.doubanID"
              ></el-input>
            </el-form-item>
            <el-form-item label="封面" prop="image">
              <el-input
                placeholder="请填写该书的封面图片"
                v-model="formData.image"
              ></el-input>
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
        <el-button class="pull-right" @click="reset" style="margin-left: 10px"
          >重置</el-button
        >
        <el-button type="primary" class="pull-right" @click="save"
          >保存</el-button
        >
      </div>
    </el-card>
  </div>
</template>

<script>
import { fetch } from '@/assets/js/fetch'

export default {
  data: () => ({
    id: '',
    formData: {
      isbn: '',
      identifierList: [],
      title: '',
      doubanID: '',
      summary: '',
      image: '',
      author: '',
      tag_1st: '',
      tag_2nd: '',
    },
    tags: [],
    tags_2nd: [],
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
      doubanID: [
        {
          required: true,
        },
      ],
      summary: [
        {
          required: true,
        },
      ],
      image: [
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
    async fetchInfoFromDouBan() {
      if (this.formData.isbn) {
        const res = await fetch({
          method: `/book/isbn/${this.formData.isbn}`,
          type: 'get',
        })
        this.formData.title = res.name
        this.formData.summary = res.description
        this.formData.image = res.photoUrl
        this.formData.author = res.author
        this.formData.doubanID = res.douban
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
    .btn {
      position: absolute;
      right: 0;
      top: 1px;
    }
  }
}
</style>

<style lang="less">
#admin_addBook .el-card__header {
  padding: 12px 16px;
}
</style>
