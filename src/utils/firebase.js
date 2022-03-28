import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { nanoid } from 'nanoid';

const {
  getDatabase,
  ref,
  get,
  child,
  push,
  update,
} = require('firebase/database');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

async function writeUserData(
  owner,
  collection,
  name,
  collection_id,
  priceValue,
  description,
  mainnet
) {
  name = name.split('-')[0];
  let updates = {};
  for (let i = 0; i < collection_id.length; i++) {
    updates[collection_id[i]] = {
      id: collection_id[i],
      collection: name,
      price: priceValue,
      'mainnet': mainnet
    };
    await recordTransaction(
      collection_id[i],
      'Minting',
      owner,
      null,
      null,
      null
    );
  }
  db.collection('collections')
    .add({
      name: `${name}`,
      url: `${collection}`,
      price: priceValue,
      owner: owner,
      description: description,
      mainnet: mainnet,
    })
    .then((docRef) => {})
    .catch((error) => {
      console.error('Error', error);
    });
  db.collection('listed')
    .doc(`${owner}`)
    .set(
      {
        ...updates,
      },
      { merge: true }
    );
}

async function recordTransaction(assetId, type, buyer, seller, price, txId) {
  let updates = {};
  console.log(txId);
  updates[nanoid()] = {
    type: type,
    buyer: buyer,
    seller: seller,
    price: price,
    txId: txId,
    txDate: new Date(),
  };
  db.collection('transactions')
    .doc(`${assetId}`)
    .set(
      {
        ...updates,
      },
      { merge: true }
    );
}

async function readNftTransaction(assetId) {
  let querySnapshot = await db
    .collection('transactions')
    .doc(`${assetId}`)
    .get();

  return Object.values(querySnapshot.data());
}

async function writeNft(
  owner,
  collection,
  assetId,
  price,
  sold,
  buyer,
  dateSold,
  mainnet
) {
  let updates = {};
  updates[assetId] = {
    id: assetId,
    collection: collection ? collection : null,
    sold: sold ? true : false,
    Buyer: buyer,
    price: price,
    dateSold: dateSold,
    mainnet: mainnet,
  };
  db.collection('listed')
    .doc(`${owner}`)
    .set(
      {
        ...updates,
      },
      { merge: true }
    );
  if (!sold) {
    await recordTransaction(assetId, 'Minting', owner, null, null, null);
  }

  return true;
}

async function readAllNft() {
  let querySnapshot = await db.collection('listed').get();
  let res = [];
  querySnapshot.forEach((doc) => {
    res.push(...Object.values(doc.data()));
  });
  return res;
}

async function readData() {
  const dbRef = ref(getDatabase());
  await get(child(dbRef, `list`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val());
      } else {
        // console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  return;
}

async function readAllUserNft(userAddress) {
  let querySnapshot = await db.collection('listed').doc(userAddress).get();
  return Object.values(querySnapshot.data());
}

async function readSIngleUserNft(userAddress, assetId) {
  let querySnapshot = await db.collection('listed').doc(userAddress).get();
  return Object.values(querySnapshot.data()).find(
    (asset) => asset.id === assetId
  );
}

async function readAllCollection(mainnet) {
  let querySnapshot = await db.collection("collections").get();
  let res = [];
  querySnapshot.forEach((doc) => {
    res.push(doc.data());
  });
  console.log('data', res.filter(asset => asset.mainnet === mainnet), mainnet)
  return res.filter(asset => asset.mainnet === mainnet);
}

async function readUserCollection(userAddress) {
  let querySnapshot = await db
    .collection('collections')
    .where('owner', '==', userAddress)
    .get();
  let res = [];
  querySnapshot.forEach((doc) => {
    res.push(doc.data());
  });
  return res;
}

async function readAllSingleNft(mainnet) {
  let querySnapshot = await db.collection("listed").get();
  let res = [];
  querySnapshot.forEach((doc) => {
    res.push(...Object.values(doc.data()));
  });
  return res.filter(asset => (asset.collection === null) && (asset.mainnet === mainnet));
}

async function fetchCollections(mainnet) {
  return await readAllCollection(mainnet);
}

async function fetchUserCollections(account) {
  return await readUserCollection(account);
}

async function fetchUserNfts(account) {
  return await readAllUserNft(account);
}

async function fetchAllNfts(account) {
  return await readAllNft(account);
}

export {
  writeUserData,
  readAllCollection,
  readAllNft,
  readUserCollection,
  readAllUserNft,
  readSIngleUserNft,
  fetchCollections,
  fetchUserCollections,
  fetchUserNfts,
  fetchAllNfts,
  writeNft,
  recordTransaction,
  readNftTransaction,
  readAllSingleNft,
};
