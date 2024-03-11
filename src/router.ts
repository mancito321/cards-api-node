import * as Router from "koa-router";
import { importCardsAndUpdateDb } from "./controllers/events.controllers";
const router = new Router();

router.get('/', (ctx, _next) => {
  console.log('route / asd')
  ctx.body = "Hello there";
  ctx.status = 200;
  
});
//Test Endpoints. Just to practice 
// router.get("/event-list",(ctx, _next) => {
//   console.log('route /event-list')
//   ctx.body = "Events List! 2 ";
//   ctx.status = 200;
// })
// router.get("/get-data",async (ctx, _next) => {
//   console.log('route /get-data')
//   const data = await getAllData(ctx)
//   console.log(data)
//   ctx.body = data;
//   ctx.status = 200;
// })
// router.get("/set-data",async (ctx, _next) => {
//   console.log('route /set-data')
//   const data = await setTestData(ctx)
//   console.log(data)
//   ctx.body = data;
//   ctx.status = 200;
// })
// router.get("/from-db",async (ctx, _next) => {
//   console.log('route /from-db')
//   await getClientInfoFromDb()
//     .then((data: { my_id: any; data: any; }) => {
//       console.log(data)
//       console.log('succeed')
//       ctx.body = `Id form mongo my ide= ${data.my_id} with message: ${data.data}`;
//       ctx.status = 200;
//     }).catch((error: any) => {
//       ctx.body = `something went wrong: ${error}`;
//       ctx.status = 500;
//     }).finally((response: string) => {
//       console.log('did something happen :'+response)
//     })
  
// })
router.post("/add-cards-to-db",async (ctx, next) => {
  let {name, nameType} = ctx.request.body;
  if (!name || !nameType) {
    // make error handler response ?
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