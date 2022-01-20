// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app")
const { getDatabase, ref, get, child, push, update } = require("firebase/database")
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const algosdk = require('algosdk');
const config = require("./arc_config")

const algoAddress = config.algodClientUrl;
const algodClientPort = config.algodClientPort;
const algoToken = config.algodClientToken;

const algodClient = new algosdk.Algodv2(
  algoToken,
  algoAddress,
  algodClientPort
);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


async function writeUserData(owner, collection, name, collection_id) {
  name = name.split('-')[0]
  let updates = {};
  for (let i = 0; i < collection_id.length; i++) {
    updates[collection_id[i]] = { 'id': collection_id[i], 'collection': name }
  }
  const db = getDatabase(app);
  await update(ref(db, `collections/${owner}/${name}`), {
    'url': collection,
    'price': 10
  });
  await update(ref(db, `list/${owner}`), {
    ...updates
  })

  return;
}

async function readData() {
  const dbRef = ref(getDatabase());
  console.log('p0pll0')
  await get(child(dbRef, `list`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  return;
}


export {
  writeUserData
}


// readData()

// console.log('009ppp')

(async function run(){
  const data = await algodClient.getAssetByID(65659724).do()
  console.log(data)
}())

