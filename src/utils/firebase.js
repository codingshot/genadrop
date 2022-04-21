import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { nanoid } from "nanoid";

// const {
//   getDatabase,
//   ref,
//   get,
//   child,
//   push,
//   update,
// } = require('firebase/database');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.REACT_APP_ENV_STAGING
    ? process.env.REACT_APP_API_KEY_STAGING
    : process.env.REACT_APP_API_KEY_PROD,
  authDomain: process.env.REACT_APP_ENV_STAGING
    ? process.env.REACT_APP_AUTH_DOMAIN_STAGING
    : process.env.REACT_APP_AUTH_DOMAIN_PROD,
  projectId: process.env.REACT_APP_ENV_STAGING
    ? process.env.REACT_APP_PROJECT_ID_STAGING
    : process.env.REACT_APP_PROJECT_ID_PROD,
  storageBucket: process.env.REACT_APP_ENV_STAGING
    ? process.env.REACT_APP_STORAGE_BUCKET_STAGING
    : process.env.REACT_APP_STORAGE_BUCKET_PROD,
  messagingSenderId: process.env.REACT_APP_ENV_STAGING
    ? process.env.REACT_APP_MESSAGING_SENDER_ID_STAGING
    : process.env.REACT_APP_MESSAGING_SENDER_ID_PROD,
  appId: process.env.REACT_APP_ENV_STAGING ? process.env.REACT_APP_ID_STAGING : process.env.REACT_APP_ID_PROD,
  measurementId: process.env.REACT_APP_ENV_STAGING
    ? process.env.REACT_APP_MEASUREMENT_ID_STAGING
    : process.env.REACT_APP_MEASUREMENT_ID_PROD,
};

// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

async function recordTransaction(assetId, type, buyer, seller, price, txId) {
  const updates = {};
  updates[nanoid()] = {
    type,
    buyer,
    seller,
    price,
    txId,
    txDate: new Date(),
  };
  db.collection("transactions")
    .doc(`${assetId}`)
    .set(
      {
        ...updates,
      },
      { merge: true }
    );
}

async function writeUserData(owner, collection, fileName, collection_id, priceValue, description, mainnet) {
  const name = fileName.split("-")[0];
  const updates = {};
  for (let i = 0; i < collection_id.length; i += 1) {
    updates[collection_id[i]] = {
      id: collection_id[i],
      collection: name,
      price: priceValue,
      chain: "algo",
      mainnet,
    };
    // eslint-disable-next-line no-await-in-loop
    await recordTransaction(collection_id[i], "Minting", owner, null, null, null);
  }
  db.collection("collections")
    .add({
      name: `${name}`,
      url: `${collection}`,
      price: priceValue,
      owner,
      description,
      mainnet,
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error", error);
    });
  db.collection("listed")
    .doc(`${owner}`)
    .set(
      {
        ...updates,
      },
      { merge: true }
    );
}

async function readNftTransaction(assetId) {
  const querySnapshot = await db.collection("transactions").doc(`${assetId}`).get();

  return Object.values(querySnapshot.data());
}

async function writeNft(owner, collection, assetId, price, sold, buyer, dateSold, mainnet) {
  const updates = {};
  updates[assetId] = {
    id: assetId,
    collection: collection || null,
    sold: !!sold,
    Buyer: buyer,
    chain: "algo",
    owner,
    price,
    dateSold,
    mainnet,
  };
  db.collection("listed")
    .doc(`${owner}`)
    .set(
      {
        ...updates,
      },
      { merge: true }
    );
  if (!sold) {
    await recordTransaction(assetId, "Minting", owner, null, null, null);
  }

  return true;
}

async function readAllNft() {
  const querySnapshot = await db.collection("listed").get();
  const res = [];
  querySnapshot.forEach((doc) => {
    res.push(...Object.values(doc.data()));
  });
  return res;
}

// async function readData() {
//   const dbRef = ref(getDatabase());
//   await get(child(dbRef, 'list'))
//     .then((snapshot) => {
//       if (snapshot.exists()) {
//         // console.log(snapshot.val());
//       } else {
//         // console.log("No data available");
//       }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

async function readAllUserNft(userAddress) {
  const querySnapshot = await db.collection("listed").doc(userAddress).get();
  try {
    const res = Object.values(querySnapshot.data());
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function readSIngleUserNft(userAddress, assetId) {
  const querySnapshot = await db.collection("listed").doc(userAddress).get();
  return Object.values(querySnapshot.data()).find((asset) => asset.id === assetId);
}

async function readAllCollection(mainnet) {
  const querySnapshot = await db.collection("collections").get();
  const res = [];
  querySnapshot.forEach((doc) => {
    res.push(doc.data());
  });
  const response = mainnet === null ? res : res.filter((asset) => asset.mainnet === mainnet);
  return response;
}

async function readUserCollection(userAddress) {
  const querySnapshot = await db.collection("collections").where("owner", "==", userAddress).get();
  const res = [];
  querySnapshot.forEach((doc) => {
    res.push(doc.data());
  });
  return res;
}

async function readAllSingleNft(mainnet) {
  const querySnapshot = await db.collection("listed").get();
  const res = [];
  querySnapshot.forEach((doc) => {
    res.push(...Object.values(doc.data()));
  });
  const response =
    mainnet === null
      ? res.filter((asset) => asset.collection === null)
      : res.filter((asset) => asset.collection === null && asset.mainnet === mainnet);
  return response;
}

async function fetchCollections(mainnet) {
  const collections = await readAllCollection(mainnet);
  return collections;
}

async function fetchUserCollections(account) {
  const userCollection = await readUserCollection(account);
  return userCollection;
}

async function fetchUserNfts(account) {
  const userNfts = await readAllUserNft(account);
  return userNfts;
}

async function fetchAllNfts(account) {
  const nfts = await readAllNft(account);
  return nfts;
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
