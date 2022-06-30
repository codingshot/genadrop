import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { nanoid } from "nanoid";
import { doc, getDoc } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";

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
  apiKey:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? process.env.REACT_APP_API_KEY_STAGING
      : process.env.REACT_APP_API_KEY_PROD,
  authDomain:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? process.env.REACT_APP_AUTH_DOMAIN_STAGING
      : process.env.REACT_APP_AUTH_DOMAIN_PROD,
  projectId:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? process.env.REACT_APP_PROJECT_ID_STAGING
      : process.env.REACT_APP_PROJECT_ID_PROD,
  storageBucket:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? process.env.REACT_APP_STORAGE_BUCKET_STAGING
      : process.env.REACT_APP_STORAGE_BUCKET_PROD,
  messagingSenderId:
    process.env.REACT_APP_ENV_STAGING === "true"
      ? process.env.REACT_APP_MESSAGING_SENDER_ID_STAGING
      : process.env.REACT_APP_MESSAGING_SENDER_ID_PROD,
  appId:
    process.env.REACT_APP_ENV_STAGING === "true" ? process.env.REACT_APP_ID_STAGING : process.env.REACT_APP_ID_PROD,
  measurementId:
    process.env.REACT_APP_ENV_STAGING === "true"
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

async function writeUserData(owner, collection, fileName, collection_id, priceValue, description, mainnet, txId) {
  const name = fileName.split("-")[0];
  const updates = {};
  for (let i = 0; i < collection_id.length; ++i) {
    updates[collection_id[i]] = {
      id: collection_id[i],
      collection: name,
      price: priceValue,
      chain: "algo",
      relisted: false,
      mainnet,
      createdAt: new Date(),
    };
    // eslint-disable-next-line no-await-in-loop
    await recordTransaction(collection_id[i], "Minting", owner, null, null, txId[i]);
  }
  db.collection("collections")
    .add({
      name: `${name}`,
      url: `${collection}`,
      price: priceValue,
      owner,
      description,
      mainnet,
      createdAt: new Date()
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

async function writeUserProfile(userObj, user) {
  try {
    let lendy = await db
      .collection("profile")
      .doc(`${user}`)
      .set(
        {
          ...userObj,
        },
        {
          merge: true,
        }
      );
  } catch (error) {
    return { message: "profile upload failed" };
  }
  return userObj;
}

async function readNftTransaction(assetId) {
  const querySnapshot = await db.collection("transactions").doc(`${assetId}`).get();

  return Object.values(querySnapshot.data());
}

async function writeNft(owner, collection, assetId, price, sold, buyer, dateSold, mainnet, txId) {
  let updates = {};
  updates[assetId] = {
    id: assetId,
    collection: collection || null,
    sold: !!sold,
    Buyer: buyer,
    chain: "algo",
    relisted: false,
    owner,
    price,
    dateSold,
    mainnet,
    createdAt: new Date(),
  };
  db.collection("listed")
    .doc(`${owner}`)
    .set(
      {
        ...updates,
      },
      { merge: true }
    );

  updates = {
    id: assetId,
    collection: collection || null,
    sold: !!sold,
    Buyer: buyer,
    chain: "algo",
    relisted: false,
    owner,
    price,
    dateSold,
    mainnet,
    createdAt: new Date(),
  };

  await db
    .collection("nfts")
    .doc(`${owner}`)
    .collection(`${assetId}`)
    .doc("properties")
    .set(
      {
        ...updates,
      },
      { merge: true }
    )
  if (!sold) {
    await recordTransaction(assetId, "Minting", owner, null, null, txId);
  }

  return true;
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

async function readSIngleUserNft(userAddress, assetId) {
  const querySnapshot = await db.collection("listed").doc(userAddress).get();
  return Object.values(querySnapshot.data()).find((asset) => asset.id === assetId);
}

async function readUserProfile(userAddress) {
  const docRef = doc(db, "profile", userAddress);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  // doc.data() will be undefined in this case
  return {};
}

async function fetchAlgoSingle(mainnet) {
  const querySnapshot = await db.collection("listed").get();
  const res = [];
  querySnapshot.forEach((docs) => {
    data = docs.data()
    res.push(...Object.values(docs.data()));
  });
  // console.log("BEFORE FILTER", res)
  // const response = res.filter((asset) => asset.collection === null && asset.mainnet === mainnet);
  return res;
}

async function fetchAlgoCollections(mainnet) {
  const querySnapshot = await db.collection("collections").get();
  const res = [];
  querySnapshot.forEach((docs) => {
    res.push(docs.data());
  });
  const response = mainnet === null ? res : res.filter((asset) => asset.mainnet === mainnet);
  return response;
}

async function fetchUserCollections(account) {
  const querySnapshot = await db.collection("collections").where("owner", "==", account).get();
  const res = [];
  querySnapshot.forEach((docs) => {
    res.push(docs.data());
  });
  return res;
}

async function fetchUserNfts(account) {
  const querySnapshot = await db.collection("listed").doc(account).get();
  try {
    const res = Object.values(querySnapshot.data());
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function fetchUserBoughtNfts(account) {
  const querySnapshot = await db.collection("listed").get();
  const res = [];
  querySnapshot.forEach((docs) => {
    res.push(...Object.values(docs.data()));
  });

  const filtered = [];
  res.forEach((e) => {
    if (e.Buyer === account) {
      filtered.push(e);
    }
  });
  return filtered;
}

async function listNft(prevOwner, collection, assetId, price, newOwner, mainnet) {
  let asset = await readSIngleUserNft(prevOwner, assetId);
  if (asset.buyer !== newOwner) {
    return { message: "you do not own this nft" };
  }
  const updates = {};
  const prevUpdates = {};
  const batch = db.batch();
  prevUpdates[assetId] = {
    relisted: false,
  }
  updates[assetId] = {
    id: assetId,
    collection: collection || null,
    chain: "algo",
    owner: newOwner,
    price,
    mainnet,
    createdAt: new Date(),
  };

  updates[assetId] = {
    id: assetId,
    collection,
    price,
    chain: "algo",
    mainnet,
    createdAt: new Date(),
  };
  const transactionRecords = {};
  transactionRecords[nanoid()] = {
    type: "ReListing",
    buyer: newOwner,
    seller: prevOwner,
    price,
    txId: "",
    txDate: new Date(),
  };

  const prevNftRef = db.collection("listed").doc(`${prevOwner}`)
  const newNftRef = db.collection("listed").doc(`${newOwner}`);
  const recordRef = db.collection("transactions").doc(`${assetId}`);
  batch.set(prevNftRef, prevUpdates, { merge: true });
  batch.set(newNftRef, updates, { merge: true });
  batch.set(recordRef, transactionRecords, { merge: true });
  await batch.commit();
  return { message: "Nft has been relisted" };
}

export {
  writeUserData,
  readSIngleUserNft,
  fetchAlgoCollections,
  fetchAlgoSingle,
  fetchUserCollections,
  fetchUserNfts,
  fetchUserBoughtNfts,
  writeNft,
  recordTransaction,
  readNftTransaction,
  readUserProfile,
  writeUserProfile,
  listNft,
};
