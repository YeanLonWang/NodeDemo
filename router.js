const express = require('express')
const router = express.Router()
const User = require('./models/use')
const md5 = require('md5')

router.get('/', (req, res) => {
    // console.log(req.session.user)
    res.render('index.html', {
        user:req.session.user
    })
})

router.get('/register',(req,res)=>{
    res.render('register.html',{
        
    })
})
router.post('/register', (req, res) => {
    let body = req.body
//提交注册页面
//先查询数据库是否有同名数据
//没有的话存入表单提交的数据
//对密码进行md5双重加密
    User.findOne({
        $or:[{
            email:body.email
        },{
            nickname:body.nickname
        }]
    },(err,data)=>{
        if(err){
            return res.status(500).json({
                success:false,
                message:'服务端错误'
            })
        }
        //已经有重名
        if (data){
            return res.status(200).json({
                err_code:1,
                message:'Email or nickname already exists.'
            })
        }
        body.password = md5(md5(body.password))
        new User(body).save((err, user) => {
            if (err) {
                return res.status(500).json({
                    err_code: 500,
                    message: 'Internal error'
                })
            }
            //注册成功，使用session记录用户登陆状态
            req.session.user = user
            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        })
    })

})

router.get('/login', (req, res) => {
    res.render('login.html', {

    })
})
router.post('/login', (req, res) => {
    //获取表单数据
    //连接数据库验证用户
    //保存用户登录状态
    //发送相应数据
    let body = req.body
    User.findOne({
        email:body.email,
        password:md5(md5(body.password))
    },(err,user)=>{
        if(err){
            return res.status(500).json({
                err_code:500,
                message:err.message //err原生有个message方法
            })
        }
        // console.log(user)
        if(!user){
            return res.status(200).json({
                err_code:1,
                message:'Email or password is invalid'
            })
        }
        //用户存在，登陆成功，通过session保存状态
        req.session.user = user
        res.status(200).json({
            err_code:0,
            message:'OK'
        })
    })
})

router.get('/logout',(req,res)=>{
    //清除登陆状态
    req.session.user = null
    //重定向到首页
    res.redirect('/')
})

module.exports = router
