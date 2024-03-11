import * as Koa from 'koa';

import * as Magic from "scryfall-sdk";
import { cardsCollection } from '../model/card-info.collection';
import { setCardIntoModel } from '../model/card-info.actions';

//Mongo DB contorller
const MongoClient = require('mongodb').MongoClient;

// Mongo DB variables that must be moved to a secrets file
// const DB_USER = process.env.MONGO_DB_USERNAME
const DB_PASS = process.env.MONGO_DB_PWD
const url = 'mongodb://root:example@mongo:27017/';
const client = new MongoClient(url);
const dbName = 'my_db';

const getClientInfoFromDb = async (_ctx:Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>) => {
  console.log('from-db func')
  try {
    await client.connect();
    console.log('Connected successfully to server');
    console.log(DB_PASS);
    const db = client.db(dbName);
    let myquery = { my_id: 1 };
    const collectionData = db.collection('my_collection').findOne(myquery, function (err: any, _result: string) {
      if (err) throw err;
      client.close();
    });
    return collectionData;
  } catch (error) {
    throw `something went wrong ${error}`
  }
  
}

const importCardsAndUpdateDb = async (name:string, nameType:string)=>{

  switch (nameType) {
    case 'name':
      //This search by 1 card. Can specify the set for a more specific result. 
      const cardsByName = generateCardCollection(await Magic.Cards.byName(name));

      return await setCardIntoModel([cardsByName])

    case 'type':
      const cardsByType = await Magic.Cards.search(`type:${name}`,1).cancelAfterPage().waitForAll()
      const transformedMaps = cardsByType.map((card) => generateCardCollection(card))
      console.log('Cards')
      console.log(transformedMaps.length)
      return await setCardIntoModel(transformedMaps)

    default:
      break;
  }

}

function generateCardCollection<CardData extends Magic.Card>(cardInfo:CardData): cardsCollection{
  return {
    name: cardInfo.name,
    mana_cost: cardInfo.mana_cost,
    cmc: cardInfo.cmc,
    colors: cardInfo.colors,
    color_identity: cardInfo.color_identity,
    type: cardInfo.type_line,
    rarity: cardInfo.rarity ,
    set: cardInfo.set,
  }
}

export {
  getClientInfoFromDb,
  importCardsAndUpdateDb
};