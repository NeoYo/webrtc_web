const Koa = require('koa')
const KoaRouter = require('koa-router')
const sendFile = require('koa-sendfile')
const path = require('path')

const app = new Koa()
const router = new KoaRouter()

// Routes
router.get(`/01`, async (ctx) => {
  await sendFile(ctx, path.join(__dirname, '/01_mediastream/index.html'))
})

router.get(`/02`, async (ctx) => {
  await sendFile(ctx, path.join(__dirname, '/02_enumerateDevices/index.html'))
})

// MARK: router 需要重新 yarn dev 才生效
router.get(`/03`, async (ctx) => {
  await sendFile(ctx, path.join(__dirname, '/03_takephoto/index.html'))
})

router.get(`/11`, async (ctx) => {
  await sendFile(ctx, path.join(__dirname, '/11_signal/index.html'))
})

router.get(`/11_1`, async (ctx) => {
  await sendFile(ctx, path.join(__dirname, '/11_1_websocket/index.html'))
})

router.get(`/11/css`, async (ctx) => {
  await sendFile(ctx, path.join(__dirname, '/11_signal/css'))
})

const http_server = require('http').createServer(app.callback());
var USERCOUNT = 3;
//https server
// var https_server = https.createServer({}, app);
const io = require('socket.io')(http_server);
// var io = io.listen(https_server);
// console.log('io: ', io);
io.on('connection', (socket)=> {
	console.log('on connect: ');
	console.log('on connect socket: ', socket);
	socket.on('message', (room, data)=>{
		// logger.debug('message, room: ' + room + ", data, type:" + data.type);
		console.log('on message: ');
		console.log('on message room: ', room);
		console.log('on message data: ', data);
		socket.to(room).emit('message',room, data);
	});

	/*
	socket.on('message', (room)=>{
		// logger.debug('message, room: ' + room );
		socket.to(room).emit('message',room);
	});
	*/

	socket.on('join', (room)=>{
		socket.join(room);
		var myRoom = io.sockets.adapter.rooms[room]; 
		var users = (myRoom)? Object.keys(myRoom.sockets).length : 0;
		// logger.debug('the user number of room (' + room + ') is: ' + users);

		if(users < USERCOUNT){
			socket.emit('joined', room, socket.id); //发给除自己之外的房间内的所有人
			if(users > 1){
				socket.to(room).emit('otherjoin', room, socket.id);
			}
		
		}else{
			socket.leave(room);	
			socket.emit('full', room, socket.id);
		}
		//socket.emit('joined', room, socket.id); //发给自己
		//socket.broadcast.emit('joined', room, socket.id); //发给除自己之外的这个节点上的所有人
		//io.in(room).emit('joined', room, socket.id); //发给房间内的所有人
	});

	socket.on('leave', (room)=>{

		socket.leave(room);

		var myRoom = io.sockets.adapter.rooms[room]; 
		var users = (myRoom)? Object.keys(myRoom.sockets).length : 0;
		// logger.debug('the user number of room is: ' + users);

		//socket.emit('leaved', room, socket.id);
		//socket.broadcast.emit('leaved', room, socket.id);
		socket.to(room).emit('bye', room, socket.id);
		socket.emit('leaved', room, socket.id);
		//io.in(room).emit('leaved', room, socket.id);
	});
});

// Routes
router.get(`/*`, async (ctx) => {
  await sendFile(ctx, path.join(__dirname, 'index.html'))
})

app.use(router.allowedMethods()).use(router.routes())

// app.listen(9000, () => {
//   console.log(`Server start on http://localhost:9000`);
// })
// User for socket.ioi
http_server.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
})

