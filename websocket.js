const WebSocket = require('ws');   //websocket

const url = require('url');

const Cookies = require('cookies');

const WebSocketServer = WebSocket.Server;



function __createWebSocketServer(server, onConnection, onMessage, onClose, onError) {
    let wss = new WebSocketServer({
        server: server
    });
    wss.pushMessage = function pushMessage(tenantId,data) {
        wss.clients.forEach(function each(client) {
            if(client.tenantId == tenantId){
                client.send(data);
            }
        });
    };
    onConnection = onConnection || function () {
        console.log('[WebSocket] connected.');
    };
    onMessage = onMessage || function (msg) {
        console.log('[WebSocket] message received: ' + msg);
    };
    onClose = onClose || function (code, message) {
        console.log(`[WebSocket] closed: ${code} - ${message}`);
    };
    onError = onError || function (err) {
        console.log('[WebSocket] error: ' + err);
    };
    wss.on('connection', function (ws,req) {
        ws.upgradeReq = req;
        let location = url.parse(ws.upgradeReq.url, true);
        console.log('[WebSocketServer] connection: ' + location.href);
        ws.on('message', onMessage);
        ws.on('close', onClose);
        ws.on('error', onError);

        if (location.pathname !== '/api/warning/webSocket') {
            // close ws:
            ws.close(4000, 'Invalid URL');
        }
        
        ws.wss = wss;
        if(ws.readyState === 1){
            onConnection.apply(ws);
            console.log('WebSocketServer was attached.');
        }
    });
   
    return wss;
}


function createWebSocketServer(server){

    var onConnect =  function () {
        
        let msg = "[WebSocket] connected.";
        this.send(msg);
    }
    
    var onMessage = function (message) {
        try{
            var tenantId = JSON.parse(message).tenantId;
            if (tenantId) {
                let msg = '已经收到tenantId: ' + tenantId;
                this.tenantId = tenantId;
                this.send(msg);
            }else{
                let msg = '没有收到tenantId!，或解析失败，请注意json格式';
                this.send(msg);
            }
        }catch(e){
            var errormsg = "请发送json字符串，否则无法解析"
            this.send(errormsg);
        }

        
    }
    
    var onClose = function () {
        
        console.log("[WebSocket] closed.");
        
    }

    return __createWebSocketServer(server, onConnect, onMessage, onClose)
}

// function pushToWs(){

// }


module.exports = createWebSocketServer;

