
import * as Koa from 'koa';
import bodyParser from '@koa/bodyparser'
import { router } from './router'
const app = new Koa();

const port = process.env.PORT || 8080

app.use(async (_ctx,next) =>{
  await next();
})
.use(async (_ctx,next) =>{
  await next();
})
.use(bodyParser())
.use(router.routes())
.listen(port, () => {
  console.log(`🚀 Server listening http://127.0.0.1:${port}/ 🚀`);
});