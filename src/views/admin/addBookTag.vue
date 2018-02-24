<template>
<div id="admin_addBookTag">
    <el-card :body-style="{ padding: 0 }">
        <div slot="header" class="clearfix">
            <span style="line-height: 36px;">标签{{id?'编辑':'增加'}}</span>
            <router-link class="pull-right" :to="'/admin/book/tagList'">
                <el-button>返回</el-button>
            </router-link>
        </div>
        <el-form :model="formData" label-width="86px" style="padding:20px" ref="form" :rules="rules">
            <el-form-item label="分类名" prop="name">
                <el-input placeholder="请填写一级分类的名称" v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-tag
                    style="margin-right:3px"
                    v-for="(tag,index) in formData.tags_2nd"
                    :key="tag"
                    closable
                    close-transition
                    @close="handleClose(index)">
                    {{tag}}
                </el-tag>
                <el-button plain type="success" @click.native="dialogVisible=true">增加</el-button>
            </el-form-item>
        </el-form>
        <div class="btns clearfix">
            <el-button class="pull-right" @click.native="reset" style="margin-left: 10px;">重置</el-button>
            <el-button type="primary" class="pull-right" @click.native="save">保存</el-button>
        </div>
    </el-card>
    <el-dialog title="添加二级分类" :visible.sync="dialogVisible" width="330px">
        <el-form label-width="65px">
            <el-form-item label="名称">
                <el-input v-model="tag_2nd" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <el-button slot="footer" type="primary" @click.native="add2ndTag">确 定</el-button>
    </el-dialog>
</div>
</template>
<script>
  export default {
    data:()=> ({
        id: '',
        formData: {
            name: '',
            tags_2nd: []
        },
        dialogVisible: false,
        tag_2nd: '',
        rules: {
            name:[{
                required: true
            }]
        }
    }),
    mounted() {
        this.getBookTag();
    },
    watch: {
        $route: 'getBookTag'
    },
    methods: {
        add2ndTag(){
            if(this.tag_2nd){
                this.formData.tags_2nd.push(this.tag_2nd);
                this.tag_2nd = '';
            }else{
                this.$message.warning('请填写名称！');
            }
        },
        handleClose(i) {
            this.formData.tags_2nd.splice(i,1);
        },
        getBookTag(){
            if(this.$route.query.id){
                this.id = this.$route.query.id
                Vue.fetch({method:'/tag/'+this.$route.query.id,type: 'get'}).then(res=>{
                    this.formData = res
                })
            }else{
                this.reset();
            }
        },
        save(){
            this.$refs.form.validate(valid => {
                if(valid){
                    Vue.fetch({method:'/tag',data: this.formData}).then(res=>{
                        if(this.id){
                            this.$message.success('编辑成功！');
                        }else{
                            this.$message.success('保存成功！');
                            this.reset();
                        }
                    })
                }
            });
        },
        reset(){
            this.$refs.form.resetFields();
            this.formData.tags_2nd.splice(0)
        }
    }
  }
</script>

<style scoped lang="less">
    #admin_addBookTag{
        .btns{
            border-top: 1px solid #d9d9d9;
            padding: 16px;
            background-color: #F8F8F8;
        }
    }
</style>

<style lang="less">
    #admin_addBookTag .el-card__header{
        padding: 12px 16px;
    }
</style>