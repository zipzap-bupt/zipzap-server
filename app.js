const Koa = require('koa');

const bodyParser = require('koa-bodyparser');    //这玩意用来解析请求体中的json

const controller = require('./controller');

const koaBetterBody = require('koa-better-body');   //这玩意能解析form表单，body里面直接.拿数据

const templating = require('./templating');

const rest = require('./rest');

const websocket = require('./websocket');

const session = require('koa-session');

const CONFIG = require( './config' );


const app = new Koa();

app.keys = ['BUPT 3DPlatform BY CJX'];

app.use(session(CONFIG.session,app));


// log request URL:
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// static file support:
let staticFiles = require('./static-files');
app.use(staticFiles('/static/', __dirname + '/static'));
app.use(staticFiles('/public/', __dirname + '/public'));

// parse request body:

app.use(koaBetterBody({       //注册解析form的中间件，现在可以解析form-data,x-www,json
    fields: 'body',            //中间件位置真的很重要，这个放在parser前面就可以完美解析
}));     //最大尺寸200M

app.use(bodyParser());


// add nunjucks as view:
app.use(templating('views', {
    noCache: true,
    watch: true
}));

// bind .rest() for ctx:
app.use(rest.restify());

// add controllers:
app.use(controller());


let server = app.listen(8800);

app.wss = websocket(server);

global.wss = app.wss;

console.log('app started at port 8800...');   //这是一个注释A
