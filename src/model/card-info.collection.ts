import { Schema, connect,connection, model } from "mongoose"

//Define interface types
enum SupportedLanguage {
  Spanish = "Spanish",
  French = "French",
  German = "German",
  Italian = "Italian",
  Portuguese = "Portuguese"
}
interface NonEngNames {
  name: string
  language: SupportedLanguage
}
interface cardsCollection {
  name: string
  alt_names?: string[]
  mana_cost?: string
  cmc?: Number
  colors: string[]
  color_identity?: string[]
  type: string
  rarity?: string 
  set?: string
  non_eng_name?: NonEngNames[]
}

//Define Schema for the interfaceypes
const NonEngNamesSchema = new Schema({ 
  name: String,
  language: {
    type: String,
    enum : SupportedLanguage,
}
});
const cardsSchema = new Schema<cardsCollection>({
  name: { type: String, required: true },
  alt_names: [{ type: String, required: false }],
  colors: [{ type: String, required: true }],
  mana_cost: { type: String, required: false, default:'' },
  cmc: { type: Number, required: false },
  color_identity: [{ type: String, required: false }],
  type: { type: String, required: true },
  rarity: { type: String, required: false },
  set: { type: String, required: false },
  non_eng_name: [{type: NonEngNamesSchema, required:false}],
});

//create model
const CardsModel = model<cardsCollection>('cards_data', cardsSchema);

// async function handleDbChanges<ChangeT, ErrHandlerT>(event:()=>void,OnError:(error:ErrHandlerT)=>void) {
//   console.log('connect to db')
//   await connect('mongodb://root:example@mongo:27017/', {
//     dbName: "cards_data"
//   });
//   //check and handle mongoose error connection to db
//   connection.on('error', err => {
//     console.log('connection error')
//   });
//   //handle input to db after connection succesfull
//   console.log('connected')
//   connection.on('connected', event);
//   //close the connection
//   connection.close()
// }

// async function getter() {

// }
// async function setCardIntoModel(cardList:cardsCollection[]) {
//   console.log('card generation')
//   const validateCard = async (cardData:cardsCollection ) => {
//     const checkIdData = CardsModel.where({name: cardData.name});
//     const cardInDb = await checkIdData.findOne();
//     if (cardInDb) {
//       return false
//     } 
//     return true
//   };
//   try {
//     let cardsToReturn:string[] = []
//     await handleDbChanges(async ()=>{
//       const newCards = cardList.filter(async (card) => {
//         return await validateCard(card);
//       });
//       await CardsModel.insertMany(newCards);
//       cardsToReturn = newCards.map(card => card.name);
//     }, (error)=>{
//       console.error(error)
//     })
//     return cardsToReturn
//   } catch (error) {
//     console.error(error);
//     return []
//   }
// }

export {
  cardsCollection,
  CardsModel
}
