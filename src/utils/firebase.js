// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
import { nanoid } from 'nanoid';
const { getDatabase, ref, get, child, push, update } = require("firebase/database")
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
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// async function writesData() {
//   const db = firebase.firestore();
//   db.collection('collections').doc('0xC291846A587cf00a7CC4AF0bc4EEdbC9c3340C36').add({
//     name: 'doodles',
//     price: 20,
//   }).then((docRef) => {
//     console.log("Document ID:", docRef.id)
//   }).catch((error) => {
//     console.error("Error", error);
//   });
// }

const db = firebase.firestore();

async function writeUserData(owner, collection, name, collection_id, priceValue) {
  name = name.split('-')[0]
  let updates = {};
  for (let i = 0; i < collection_id.length; i++) {
    updates[collection_id[i]] = { 'id': collection_id[i], 'collection': name, 'price': priceValue }
    await recordTransaction(collection_id[i], "Minting", owner, null, null, null)
  }
  db.collection('collections').add({
    name: `${name}`,
    url: `${collection}`,
    price: priceValue,
    owner: owner
  }).then((docRef) => {
    // console.log("Document ID:", docRef.id)
  }).catch((error) => {
    console.error("Error", error);
  });
  db.collection('listed').doc(`${owner}`).set({
    ...updates
  }, { merge: true });

  return;
}

async function recordTransaction(assetId, type, buyer, seller, price, txId) {
  let updates = {};
  updates[nanoid()] = { 'type': type, 'buyer': buyer, 'seller': seller, 'price': price, 'txId': txId, 'txDate': new Date() }
  db.collection('transactions').doc(`${assetId}`).set({
    ...updates
  }, { merge: true });
}

async function readNftTransaction(assetId) {
  let querySnapshot = await db.collection("transactions").doc(`${assetId}`).get()
  // console.log('datum', Object.values(querySnapshot.data()))
  // console.log(Object.values(querySnapshot.data()));
  return Object.values(querySnapshot.data())
}

async function writeNft(owner, collection, assetId, price, sold, buyer, dateSold) {
  let updates = {};
  updates[assetId] = { 'id': assetId, 'collection': collection ? collection : null, 'sold': sold ? true : false, 'Buyer': buyer, 'price': price, 'dateSold': dateSold }
  db.collection('listed').doc(`${owner}`).set({
    ...updates
  }, { merge: true });
  await recordTransaction(assetId, "Minting", owner, null, null, null)

}



async function readAllNft() {
  let querySnapshot = await db.collection("listed").get()
  let res = [];
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
    res.push(...Object.values(doc.data()));
  });
  return res;
}

async function readData() {
  const dbRef = ref(getDatabase());
  // console.log('p0pll0')
  await get(child(dbRef, `list`)).then((snapshot) => {
    if (snapshot.exists()) {
      // console.log(snapshot.val());
    } else {
      // console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  return;
}

async function readAllUserNft(userAddress) {
  let querySnapshot = await db.collection("listed").doc(userAddress).get()
  // console.log('datum', querySnapshot.data())
  // console.log(Object.values(querySnapshot.data()));
  return Object.values(querySnapshot.data())
}

async function readSIngleUserNft(userAddress, assetId) {
  let querySnapshot = await db.collection("listed").doc(userAddress).get()
  console.log('datum', querySnapshot.data())
  // console.log(Object.values(querySnapshot.data()));
  return Object.values(querySnapshot.data()).find(asset => asset.id === assetId)
}

async function readAllCollection() {
  let querySnapshot = await db.collection("collections").get()
  let res = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    res.push(doc.data());
  });
  return res;
}

async function readUserCollection(userAddress) {
  let querySnapshot = await db.collection("collections").where("owner", "==", userAddress).get()
  let res = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    // console.log(doc.id, " => ", doc.data());
    res.push(doc.data())
  });
  // console.log(res)
  return res;
}

async function readAllSingleNft() {
  let querySnapshot = await db.collection("listed").get()
  let res = [];
  querySnapshot.forEach((doc) => {
    // console.log(doc.id, " => ", doc.data());
    res.push(...Object.values(doc.data()));
  });
  return res.filter(asset => asset.collection === null);
}
//   .then((querySnapshot) => {
//     let res = [];
//     querySnapshot.forEach((doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());
//         res.push(doc.data());
//     });
//     console.log(res)
//     return res;
// });

// readAllUserNft("X3EPW56NIIYT37OYHHOH5YBEIO7I7XJY4SAE57REQLGAMI2TUFPRA6IJA4").then((data) => {
//   console.log(data)
// });

let demoAcc = 'NJJZVXK537GLPXK2BW47LGLSVKW3VPN42CY7DOK2UR23NUGV4QBV2DXO4Y';

async function fetchCollections() {
  return await readAllCollection()
}

async function fetchUserCollections(account) {
  return await readUserCollection(demoAcc)
}

async function fetchUserNfts(account) {
  return await readAllUserNft(demoAcc)
}

async function fetchAllNfts(account) {
  return await readAllNft(demoAcc)
}

// X3EPW56NIIYT37OYHHOH5YBEIO7I7XJY4SAE57REQLGAMI2TUFPRA6IJA4

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
  readAllSingleNft
}