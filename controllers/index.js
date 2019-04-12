//处理默认进入时的URL
const index = require('../services/index.js');

const APIError = require('../rest').APIError;

const Cookies = require('cookies');

var tenantId;
module.exports = {
    'GET /': async (ctx, next) => {
        try{
            tenantId = ctx.query.id || ctx.query.tenantId;
            var sessionId = ctx.query.sessionId;
            // var theToken = ctx.query.token; 
            
            var cookie = ctx.req.headers.cookie;
            
            if( sessionId === undefined){
                ctx.render('home.html',{
                    tenantId:tenantId
                    });
            }else{
                ctx.cookies.set('SESSIONID',sessionId,{
                    path:'/',   //cookie写入的路径
                    maxAge:1000*60*60*1,
                });

                await index.getToken(cookie,sessionId)
                .then(function(res){
                    let token = res.text;
                    console.log("进入第一个成功回调")
                    ctx.cookies.set('access_token',token,{
                        path:'/',   //cookie写入的路径
                        maxAge:1000*60*60*1,
                    });

                    ctx.render('home.html',{
                            tenantId:tenantId
                            });
                    //return index.checkToken(token);
                })
                // .then(function(res) {
                //     console.log("进入第二个成功回调");
                //     var userInfo = JSON.parse(res.text);
                //     var tenantId = userInfo.tenant_id;
                //     var customerId = userInfo.customer_id;
                //     var userId = userInfo.user_id;
                //     var userLevel = userInfo.authority;
                    
                //     ctx.cookies.set('tenant_id',tenantId,{
                //         path:'/',   //cookie写入的路径
                //         maxAge:1000*60*60*1,
                //     });
                //     ctx.cookies.set('customerId',customerId,{
                //         path:'/',   //cookie写入的路径
                //         maxAge:1000*60*60*1,
                //     });
                //     ctx.cookies.set('userId',userId,{
                //         path:'/',   //cookie写入的路径
                //         maxAge:1000*60*60*1,
                //     });
                //     ctx.cookies.set('userLevel',userLevel,{
                //         path:'/',   //cookie写入的路径
                //         maxAge:1000*60*60*1,
                //     });

                //     ctx.render('home.html',{
                //     tenantId:tenantId
                //     });

                // })
                .catch(function(err){
                     //ctx.response.redirect('http://39.104.84.131/signin');
                    ctx.response.status = 401;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code:  'Unauthorized',
                        message: '权限未认证，请重新登录进入'
                    }
                    console.log(err);
                    console.log('被catch的错误')
                    
                });
            }                   
        
    }catch(e){
        throw new APIError('login: failed','未登陆' +  e.message);
    }
    },
    
    'GET /demo': async (ctx, next) => {
        ctx.render('demo.html');
        
    },
    'GET /baidu': async (ctx, next) => {
        var access_token = ctx.cookies.get('access_token');
        ctx.render('baiduDemo.html');
    },
    'GET /sitesList': async (ctx, next) => {
        ctx.render('sitesList.html');
    },
    'GET /demoupload': async (ctx, next) => {
        ctx.render('upload.html');
    },

};
