
import * as Koa from 'koa';
import bodyParser from '@koa/bodyparser'
import { router } from './router'
// const parser = require("koa-bodyparser");
// const cors = require("@koa/cors");
const app = new Koa();

const port = process.env.PORT || 8080

app.use(async (_ctx,next) =>{
  // console.log('middleware 1')
  await next();
  // console.log('finish middleware 1')
})
.use(async (_ctx,next) =>{
  // console.log('middleware 2')
  await next();
  // console.log('finish middleware 2')
})
.use(bodyParser())
.use(router.routes())
.listen(port, () => {
  console.log(`🚀 Server listening http://127.0.0.1:${port}/ 🚀`);
});