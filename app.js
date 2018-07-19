//1.引包
const fs = require('fs')
const path = require('path')
const express = require('express')
const router = require('./router')
const bodyParser = require('body-parser')
const session = require('express-session')
// const template = require('art-template')

const app = express()

//2.开放静态目录
app.use('/public',express.static(path.join(__dirname,'./public')))
app.use('/node_modules',express.static(path.join(__dirname,'./node_modules')))

//3.配置其他包
app.engine('html',require('express-art-template'))
app.set('views',path.join(__dirname,'./views'))
app.use(bodyParser.urlencoded({  extended:  false  }))
app.use(bodyParser.json())

app.use(session({
    // 配置加密字符串，它会在原有加密基础之上和这个字符串拼起来去加密
    // 目的是为了增加安全性，防止客户端恶意伪造
    secret: 'itcast',
    resave: false,
    saveUninitialized: false // 无论你是否使用 Session ，我都默认直接给你分配一把钥匙
}))
//挂载router，所有在router中使用的包所需要的配置都要在router前
app.use(router)

//4.监听端口
app.listen(3000,(err)=>{
    console.log('app is running')
})
