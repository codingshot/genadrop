// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';
const { getDatabase, ref, get, child, push, update} = require("firebase/database")
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

async function writeUserData(owner, collection, name, collection_id) {
  name = name.split('-')[0]
  let updates = {};
  for (let i = 0; i < collection_id.length; i++) {
    updates[collection_id[i]] = {'id': collection_id[i], 'collection': name}
  }
  db.collection('collections').add({
    name: `${name}`,
    url: `${collection}`,
    price: 20,
    owner: owner
  }).then((docRef) => {
    // console.log("Document ID:", docRef.id)
  }).catch((error) => {
    console.error("Error", error);
  });
  db.collection('listed').doc(`${owner}`).set({
    ...updates
  }, {merge: true});
  
  return;
  }
  
async function writeNft(owner, assetId) {
  let updates = {};
  updates[assetId] = {'id': assetId, 'collection': null}
  db.collection('listed').doc(`${owner}`).set({
    ...updates
  }, {merge: true});
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

  async function readSingleNft() {
    let querySnapshot = await db.collection("listed").get()
    let res = [];
    querySnapshot.forEach((doc) => {
      for (const key in doc.data()) {
        if (Object.hasOwnProperty.call(doc.data(), key)) {
          if (doc.data()[key].collection === null) {
            res.push(doc.data()[key]);
          }
        }
      }
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
    // console.log(Object.values(querySnapshot.data()));
    return Object.values(querySnapshot.data())
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

  async function fetchCollections(){

    let allCollections = await readAllCollection()
    let allNft = await readAllNft()
    let userCollections = await readUserCollection('IXUBUSAZCEPSHTIHFOXMCP34KXYEHDNGCOLREQPS6XEKH6O5MGPZNI63DA')
    let allUserNft = await readAllUserNft('IXUBUSAZCEPSHTIHFOXMCP34KXYEHDNGCOLREQPS6XEKH6O5MGPZNI63DA')

    return {
      allCollections,
      allNft,
      userCollections,
      allUserNft
    }
  }


export {
    writeUserData,
    readAllCollection,
    readAllNft,
    readUserCollection,
    readAllUserNft,
    fetchCollections,
    writeNft,
    readSingleNft
}


