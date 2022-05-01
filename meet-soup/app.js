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

// Routes
router.get(`/*`, async (ctx) => {
  await sendFile(ctx, path.join(__dirname, 'index.html'))
})

app.use(router.allowedMethods()).use(router.routes())

app.listen(9000, () => {
  console.log(`Server start on http://localhost:9000`);
})

