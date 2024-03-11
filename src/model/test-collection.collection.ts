import { Schema, model, connect, connection, Query, _FilterQuery, FilterQuery } from 'mongoose';

//Define interface types
interface dataCollection {
  my_id: number
  data: string
}
//Define Schema for the interfaceypes
const dataTestSchema = new Schema<dataCollection>({
  my_id: { type: Number, required: true },
  data: { type: String, required: true },
});
//create model
const TestData = model<dataCollection>('test_data', dataTestSchema);

//Connect to DB
async function run() {
  // 4. Connect to MongoDB
  await connect('mongodb://root:example@mongo:27017/',
    {
      authSource: "admin",
      user: "admin",
      pass: "password",
      dbName: "my_db"
  });

  const tData = new TestData({
    my_id: 2,
    data: 'Second stored Data ',
  });
  await tData.save();
  connection.close()
  console.log(tData.data);
}

async function addTestData(objectData: string):Promise<string> {
  try {
    console.log('initiate set data')
    await connect('mongodb://root:example@mongo:27017/', {
      authSource: "admin",
      user: "admin",
      pass: "password",
      dbName: "my_db"
  });
    console.log('connected')
    const newId = Date.now()
    const checkIdData = TestData.where({my_id: newId});
    const data = await checkIdData.findOne();
    if (data) {
      throw "something went wrong, please try again"
    }
    const tData = new TestData({
      my_id: newId,
      data: objectData,
    });
    await tData.save();
    connection.close()
    console.log(tData.data);
    return tData.data
  } catch (error) {
    console.log(error)
    throw error
  }
  
} 

async function getAllTestData() {
  try {
    console.log('set connection')
    await connect('mongodb://root:example@mongo:27017/',
    {
      dbName: "my_db"
    });
    console.log('connected')
    const data = await TestData.find({});
    
    if (!data) {
      throw "something went wrong, please try again"
    }
    return data
  } catch (error) {
    
  }
  
}

//Type generic as function
function testGenericsTypescript<GenericTypeName>(query: GenericTypeName[]) {
  return query[0]
}

function testGenerics() {
  const a = ['a','b'];
  const b = [1,2];
  const thisIsString = testGenericsTypescript(a);
  const thisIsnumber = testGenericsTypescript(b);
  
  type ApiResponse <ResponseData= {defaultType: boolean}> = {
    data: ResponseData,
    isError: boolean
  }
  type AlwaysOvjectGeneric <ResponseDataObject extends object = {defaultType: boolean}> = {
    dataObject: ResponseDataObject,
    isError: boolean
  }

  type UserRes= ApiResponse<{name: string, mail: string}> 
  type AdminRes= ApiResponse<{name: string, company: string}> 

  const response: UserRes = {
    data: {
      name: 'jonne',
      mail: 'doe'
    },
    isError: false
  }
  const adminResponse: AdminRes = {
    data: {
      name: 'jonne',
      company: `Doe's Inc.`
    },
    isError: false
  }
}

async function getIdData(query: FilterQuery<dataCollection>) {

}

export {
}