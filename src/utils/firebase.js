/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { nanoid } from "nanoid";
import { doc, getDoc } from "firebase/firestore";

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

let initApp = null;
if (!firebase.apps.length) {
  initApp = firebase.initializeApp(firebaseConfig);
}
firebase.firestore().settings({ experimentalForceLongPolling: true });

export const app = initApp;
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
  db.collection("transactionsHistory")
    .doc(`${assetId}`)
    .set(
      {
        ...updates,
      },
      { merge: true }
    );
}

async function writeUserData(owner, collection, fileName, collection_id, priceValue, description, mainnet, txId, list) {
  const name = fileName.split("-")[0];
  const updates = {};
  for (let i = 0; i < collection_id.length; i++) {
    updates[collection_id[i]] = {
      id: collection_id[i],
      collection: name,
      price: priceValue,
      chain: "algo",
      owner,
      isListed: !!list,
      sold: false,
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
      createdAt: new Date(),
    })
    .then(() => {})
    .catch((error) => {
      console.error("Error", error);
    });
  db.collection("nfts")
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
    await db
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
  const querySnapshot = await db.collection("transactionsHistory").doc(`${assetId}`).get();

  return Object.values(querySnapshot.data());
}

async function writeNft(owner, collection, assetId, price, sold, buyer, dateSold, mainnet, txId, list) {
  const updates = {};
  updates[assetId] = {
    id: assetId,
    collection: collection || null,
    sold: !!sold,
    Buyer: buyer,
    chain: "algo",
    isListed: !!list,
    owner: buyer || owner,
    price,
    dateSold,
    mainnet,
    createdAt: new Date(),
  };
  db.collection("nfts")
    .doc(`${owner}`)
    .set(
      {
        ...updates,
      },
      { merge: true }
    );
  if (!sold) {
    await recordTransaction(assetId, "Minting", owner, null, null, txId);
  }

  return true;
}

async function writeListNft(assetId, price, owner, manager, txId, list) {
  const updates = {};
  updates[assetId] = {
    id: assetId,
    isListed: !!list,
    price,
    manager,
  };
  db.collection("nfts")
    .doc(`${owner}`)
    .set(
      {
        ...updates,
      },
      { merge: true }
    );
  await recordTransaction(assetId, "Listing", owner, null, null, txId);

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
  // const querySnapshot = await db.collection("nfts").doc(userAddress).get();
  // const res = [];
  // querySnapshot.forEach((docs) => {
  //   res.push(...Object.values(docs.data()));
  // });
  // return res.find((asset) => asset.id === assetId);
  const querySnapshot = await db.collection("nfts").get();
  const res = [];
  try {
    querySnapshot.forEach((docs) => {
      res.push(...Object.values(docs.data()));
    });
    const response = res.find((asset) => asset.owner === userAddress && asset.id === assetId);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function readUserProfile(userAddress) {
  try {
    const docRef = doc(db, "profile", userAddress);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (error) {
    return {};
  }
  // doc.data() will be undefined in this case
}
async function readUsers() {
  const profileQuerySnapshot = await db.collection("profile").get();

  const nftsQuerySnapshot = await db.collection("nfts").get();
  const users = [];
  const nfts = [];
  try {
    nftsQuerySnapshot.forEach((docs) => {
      nfts.push(...Object.values(docs.data()));
    });
    profileQuerySnapshot.forEach((docs) => {
      users.push(...Object.values(docs.data()));
    });
    // const response = res.filter((asset) => asset.owner === account);
    console.log(users);
    console.log(nfts);
    return users;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function fetchAlgoSingle(mainnet) {
  const querySnapshot = await db.collection("nfts").get();
  const res = [];
  querySnapshot.forEach((docs) => {
    res.push(...Object.values(docs.data()));
  });
  const response = res.filter((asset) => asset.collection === null && asset.mainnet === mainnet);
  return response;
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

async function fetchUserCreatedNfts(account) {
  const querySnapshot = await db.collection("nfts").doc(account).get();
  try {
    const res = Object.values(querySnapshot.data());
    return res;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function fetchUserNfts(account) {
  const querySnapshot = await db.collection("nfts").get();
  const res = [];
  try {
    querySnapshot.forEach((docs) => {
      res.push(...Object.values(docs.data()));
    });
    const response = res.filter((asset) => asset.owner === account);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function fetchUserBoughtNfts(account) {
  const querySnapshot = await db.collection("nfts").get();
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

async function writeNftSale(assetId, price, owner, txId, seller) {
  // console.log("so you wanna list??");
  const updates = {};
  const batch = db.batch();

  updates[assetId] = {
    updatedAt: new Date(),
    dateSold: new Date(),
    sold: true,
    isListed: false,
    Buyer: owner,
    owner,
  };

  const transactionRecords = {};
  transactionRecords[nanoid()] = {
    type: "Sale",
    buyer: owner,
    id: assetId,
    txDate: new Date(),
    seller,
    price,
    txId,
  };
  try {
    const nftRef = await db.collection("nfts").where(`${assetId}.id`, "==", assetId).get();
    console.log(nftRef);
    const recordRef = db.collection("transactionsHistory").doc(`${assetId}`);
    batch.set(nftRef.docs[0].ref, updates, { merge: true });
    batch.set(recordRef, transactionRecords, { merge: true });
    await batch.commit();
    return { message: "Nft has been relisted" };
  } catch (err) {
    console.log(err);
    return { message: "an error occured while listing nft" };
  }
}

async function listNft(assetId, price, owner, manager, txId) {
  console.log("so you wanna list??");
  const updates = {};
  const batch = db.batch();

  updates[assetId] = {
    price,
    updatedAt: new Date(),
    sold: false,
    isListed: true,
    manager,
  };

  const transactionRecords = {};
  transactionRecords[nanoid()] = {
    type: "Listing",
    buyer: owner,
    id: assetId,
    price,
    txId,
    txDate: new Date(),
  };
  try {
    const nftRef = await db.collection("nfts").where(`${assetId}.id`, "==", assetId).get();
    console.log(nftRef);
    const recordRef = db.collection("transactionsHistory").doc(`${assetId}`);
    batch.set(nftRef.docs[0].ref, updates, { merge: true });
    batch.set(recordRef, transactionRecords, { merge: true });
    await batch.commit();
    return { message: "Nft has been relisted" };
  } catch (err) {
    console.log(err);
    return { message: "an error occured while listing nft" };
  }
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
  writeListNft,
  recordTransaction,
  readNftTransaction,
  readUserProfile,
  writeUserProfile,
  listNft,
  writeNftSale,
  fetchUserCreatedNfts,
  readUsers,
};
