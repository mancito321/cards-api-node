import { connection, connect } from "mongoose";
import { CardsModel, cardsCollection } from "./card-info.collection";

async function getter() {

}
const DB_URL = `mongodb://${process.env.USER_NAME}:${process.env.USER_PWD}@${process.env.DB_URL}`

async function handleDbChangesv2<ChangeT, ErrHandlerT>(event:()=>void,OnError:(error:ErrHandlerT)=>void) {
  console.log('connect to db')
  connection.on('error', err => {
    console.log('connection error')
  });
  //handle input to db after connection succesfull
  connection.on('connected', ()=>{
    console.log('connected')
  });
  //await connect('mongodb://root:example@mongo:27017/', {
  await connect(DB_URL, {
    dbName: "cards_data"
  });
  console.log('trigger event')
  await event();
  console.log('end event trigger')
  //close the connection
  connection.close()
}

async function validateCard(cardData:cardsCollection ) {
  const checkIdData = CardsModel.where({name: cardData.name});
  const cardInDb = await checkIdData.findOne();
  console.log('card id:'+cardInDb)
  if (cardInDb) {
    return false
  }
  return true
};

async function setCardIntoModel(cardList:cardsCollection[]) {
  console.log('card generation')
  
  try {
    let cardsToReturn:string[] = []
    await handleDbChangesv2(async ()=>{
      console.log('this is an event')
      const newCards = await cardList.filter(async (card) => {
        const isFiltered = await validateCard(card);
        console.log(isFiltered ?'filtered':'not filtered')
        return isFiltered
      });
      const newCards2 = await Promise.all(cardList.map(async (card) => {
        const isFiltered = await validateCard(card);
        console.log(isFiltered ? 'filtered' : 'not filtered');
        return isFiltered ? null : card
      }));
      console.log('new Cards')
      console.log(newCards.length)
      console.log('new Cards2')
      console.log(newCards2.length)
      await CardsModel.insertMany(newCards);
      cardsToReturn = newCards.map(card => card.name);
      console.log('this is the event end')
    }, (error)=>{
      console.log('event error')
      console.error(error)
    })
    return cardsToReturn
  } catch (error) {
    console.error('this catched this rror .:'+error);
    return []
  }
}

export {
  setCardIntoModel,
  cardsCollection
}
