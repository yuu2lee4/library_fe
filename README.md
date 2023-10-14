## 关于本项目
该项目是一个书架借阅管理系统(鲲鹏)，它分为后台管理系统和书籍借阅系统。后台管理系统可管理书籍的分类、录入(可通过isbn自动获取书籍信息)、和借出记录。书籍借阅系统可进行用户注册(公司里可用ldap)、书籍展示、书籍借阅归还。

项目运行指南：  
1、安装node20.x，安装完后可在命令行输入node -v查看版本，以便确认安装成功  
2、在命令行里，输入npm install -g nrm（nrm可以管理npm的源，安装完之后可以nrm use taobao切换淘宝的源，也可以用pnpm替代npm）  
3、启动后端(https://github.com/yuu2lee4/library_be)  
4、进入library_fe根目录使用pnpm安装依赖，安装完后输入pnpm dev就可以启动前端了,此时在浏览器访问http://localhost:5173即可看到界面  
5、如果需要接入ldap，修改src/config.js即可

目录结构:
````
    ROOT/
    |-- vite.config.js       存放vite的配置
    `-- src                  源代码
        |-- views            视图组件，其中后台管理系统在admin目录下，前台在home目录下
        |-- assets           放静态资源
        |   `--js/fetch.js   基于axios封装的请求数据的模块
        |-- main.js          是整个项目的入口
        |-- app.vue          根组件
        `-- routers/index.js 路由配置
````

展示

![1](https://raw.githubusercontent.com/yuu2lee4/library_fe/master/static/1.jpg)

![2](https://raw.githubusercontent.com/yuu2lee4/library_fe/master/static/2.jpg)

![3](https://raw.githubusercontent.com/yuu2lee4/library_fe/master/static/3.jpg)

![4](https://raw.githubusercontent.com/yuu2lee4/library_fe/master/static/4.jpg)

![5](https://raw.githubusercontent.com/yuu2lee4/library_fe/master/static/5.jpg)