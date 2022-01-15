// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app")
const { getDatabase, ref, get, child, push} = require("firebase/database")
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
const app = initializeApp(firebaseConfig);


async function writeUserData(owner, collection) {
    const db = getDatabase(app);
    await push(ref(db, `collections/${owner}`), {
      collection
    });
    return;
  }

  async function readData() {
    const dbRef = ref(getDatabase());
    console.log('p0pll0')
    await get(child(dbRef, `collections`)).then((snapshot) => {  
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

