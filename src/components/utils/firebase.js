// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import 'firebase/firestore'
const { getDatabase, ref, get, child, push, update} = require("firebase/database")
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


async function writeUserData(owner, collection, name, collection_id) {
  name = name.split('-')[0]
  let updates = {};
  for (let i = 0; i < collection_id.length; i++) {
    updates[collection_id[i]] = {'id': collection_id[i], 'collection': name}
  }
  const db = firebase.firestore();
  db.collection('collections').add({
    name: `${name}`,
    url: `${collection}`,
    price: 20,
    owner: owner
  }).then((docRef) => {
    console.log("Document ID:", docRef.id)
  }).catch((error) => {
    console.error("Error", error);
  });
  db.collection('listed').doc(`${owner}`).set({
    ...updates
  }, {merge: true});
  
  return;
  } 

  async function readAllNft() {
    const db = firebase.firestore();
    db.collection("listed").get().then((querySnapshot) => {
      let res = [];
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          res.push(...Object.values(doc.data()));
      });
      return res;
  });
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

  async function readAllUserNft(userAddress) {
    const db = firebase.firestore();
    db.collection("listed").doc(userAddress).get().then((querySnapshot) => {
      console.log(Object.values(querySnapshot.data()));
      return Object.values(querySnapshot.data())
  });
  }

  async function readAllCollection() {
    const db = firebase.firestore();
    db.collection("collections").get().then((querySnapshot) => {
      let res = [];
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          res.push(doc.data());
      });
      return res;
  });
  }

  async function readUserCollection(userAddress) {
    const db = firebase.firestore();
    db.collection("collections").where("owner", "==", userAddress).get().then((querySnapshot) => {
      let res = [];
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          res.push(doc.data())
      });
      console.log(res)
      return res;
  });
  }

  // readAllUserNft("X3EPW56NIIYT37OYHHOH5YBEIO7I7XJY4SAE57REQLGAMI2TUFPRA6IJA4").then((data) => {
  //   console.log(data)
  // });

export {
    writeUserData,
    readAllCollection,
    readAllNft,
    readUserCollection,
    readAllUserNft
}

// (async function run(){
//   const data = await algodClient.getAssetByID(65659724).do()
//   console.log(data)
// }())

