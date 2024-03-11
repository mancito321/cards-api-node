import * as Router from "koa-router";
import { importCardsAndUpdateDb } from "./controllers/events.controllers";
const router = new Router();

router.get('/', (ctx, _next) => {
  console.log('route / asd')
  ctx.body = "Hello there";
  ctx.status = 200;
  
});
router.post("/add-cards-to-db",async (ctx, next) => {
  let {name, nameType} = ctx.request.body;
  if (!name || !nameType) {
    console.log('bad Request')
    ctx.body = "Bad Request: Error in the body required parameters";
    ctx.status = 400;
    next()
  }
  const carsdAdded = await importCardsAndUpdateDb(name,nameType);
  console.log('/add-cards-to-db')
  ctx.body = JSON.stringify(carsdAdded);
  ctx.status = 200;
})

export { router }