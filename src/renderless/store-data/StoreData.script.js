import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, collection, setDoc, getFirestore, getDoc, getDocs, query } from "firebase/firestore";

import { app } from "../../utils/firebase";
import { getFile } from "../../utils";

const storage = getStorage(app);
const firestore = getFirestore();

export const saveSession = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const docRef = doc(firestore, `users/${currentUser.uid}/sessions/${sessionId}`);
    setDoc(docRef, { sessionId });
    return sessionId;
  }
};

export const saveCollectionName = async ({ currentUser, sessionId, collectionName }) => {
  if (currentUser && sessionId) {
    const docRef = doc(firestore, `users/${currentUser.uid}/${sessionId}/collectionName`);
    setDoc(docRef, { collectionName });
  }
};

export const saveLayers = ({ currentUser, sessionId, layers }) => {
  if (currentUser && sessionId) {
    const docRef = doc(firestore, `users/${currentUser.uid}/${sessionId}/layers`);
    setDoc(docRef, { layers });
  }
};

export const saveTraits = async ({ currentUser, sessionId, id, traits }) => {
  if (!traits.length) return;
  if (currentUser && sessionId) {
    traits.forEach(async ({ traitTitle, image }) => {
      const traitRef = ref(storage, `${currentUser.uid}/${sessionId}/${id}/${traitTitle}`);
      try {
        await uploadBytes(traitRef, image);
      } catch (error) {
        console.log(`error ${error}`);
      }
    });
  }
};

export const renameTrait = async ({ currentUser, sessionId, id, oldName, newName, image }) => {
  if (currentUser && sessionId) {
    const traitRef = ref(storage, `${currentUser.uid}/${sessionId}/${id}/${newName}`);
    // upload the new file
    try {
      await uploadBytes(traitRef, image);
    } catch (error) {
      console.log(`error ${error}`);
    }

    const deleteRef = ref(storage, `${currentUser.uid}/${sessionId}/${id}/${oldName}`);
    // Delete the old file
    try {
      await deleteObject(deleteRef);
    } catch (error) {
      console.log(`error ${error}`);
    }
  }
};

export const deleteTrait = async ({ currentUser, sessionId, id, traitTitle }) => {
  if (currentUser && sessionId) {
    const deleteRef = ref(storage, `${currentUser.uid}/${sessionId}/${id}/${traitTitle}`);
    try {
      await deleteObject(deleteRef);
    } catch (error) {
      console.log(`error ${error}`);
    }
  }
};

export const deleteAllTraits = async ({ currentUser, sessionId, id }) => {
  if (currentUser && sessionId) {
    const listRef = ref(storage, `${currentUser.uid}/${sessionId}/${id}`);

    const res = await listAll(listRef);
    const folder = await Promise.all(
      res.items.map(async (folderRef) => {
        // All the folder under listRef.
        return folderRef;
      })
    );

    folder.forEach(async (ref) => {
      try {
        await deleteObject(ref);
      } catch (error) {
        console.log(`error ${error}`);
      }
    });
  }
};

export const fetchSession = async ({ currentUser }) => {
  if (currentUser) {
    const q = query(collection(firestore, `users/${currentUser.uid}/sessions`));
    const querySnapshot = await getDocs(q);
    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push(doc.id);
    });
    return sessions;
  }
};

export const fetchCollectionName = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const querySnapshot = query(doc(firestore, `users/${currentUser.uid}/${sessionId}/collectionName`));
    const docSnapshot = await getDoc(querySnapshot);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("document does not exist");
    }
  }
};

export const fetchLayers = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const querySnapshot = query(doc(firestore, `users/${currentUser.uid}/${sessionId}/layers`));
    const docSnapshot = await getDoc(querySnapshot);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("document does not exist");
    }
  }
};

export const fetchTraits = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const listRef = ref(storage, `${currentUser.uid}/${sessionId}/`);
    const traitRef = await listAll(listRef);

    // Find all the prefixes and items.
    const getFiles = async (fileRef) => {
      const res = await listAll(fileRef);
      let key = null;
      const files = await Promise.all(
        res.items.map(async (itemRef) => {
          // All the items under listRef.
          let file = {};
          try {
            const url = await getDownloadURL(ref(storage, itemRef));
            file.url = url;
            const metadata = await getMetadata(itemRef);
            file.metadata = metadata;
            key = metadata.fullPath.split("/")[2];
            return file;
          } catch (error) {
            console.log(error);
          }
        })
      );
      return { [key]: files };
    };

    const folders = await Promise.all(
      traitRef.prefixes.map(async (folderRef) => {
        // All the folders under listRef.
        return folderRef;
      })
    );

    const traits = await Promise.all(folders.map(async (ref) => await getFiles(ref)));

    return traits;
  }
};

export const constructLayers = async ({ dispatch, storedCollectionName, storedLayers, storedTraits }) => {
  console.log("storedCollectionName: ", storedCollectionName);
  console.log("storedTraits: ", storedTraits);
  console.log("storedLayers: ", storedLayers);
  return;
  const transformedTraits = await transfromTraits(storedTraits);

  const newLayers = storedLayers.layers.map(({ traits, id, ...otherLayerProps }) => {
    const obj = transformedTraits[id];
    const newTraits = traits.map(({ image, traitTitle, ...otherTraitProps }) => {
      let file = null;
      for (let o of obj) {
        if (o.name === traitTitle) {
          file = o;
          break;
        }
      }
      return { image: file, traitTitle, ...otherTraitProps };
    });
    return { traits: newTraits, id, ...otherLayerProps };
  });

  console.log({ newLayers });
};

const transfromTraits = async (value) => {
  const newTraits = {};
  await Promise.all(
    value.map(async (traitObj) => {
      let newTrait = null;
      await Promise.all(
        Object.values(traitObj).map(async (trait) => {
          newTrait = await Promise.all(
            trait.map(async ({ url, metadata: { name, contentType } }) => await getFile(url, name, contentType))
          );
          return null;
        })
      );
      newTraits[Object.keys(traitObj)] = [...newTrait];
      return null;
    })
  );
  return newTraits;
};

export const fetchUserSession = async ({ dispatch, currentUser, sessionId }) => {
  console.log("fetching starts...");
  try {
    const result = await Promise.all([
      fetchCollectionName({ currentUser, sessionId }),
      fetchLayers({ currentUser, sessionId }),
      fetchTraits({ currentUser, sessionId }),
    ]);
    const [storedCollectionName, storedLayers, storedTraits] = result;
    constructLayers({ dispatch, storedCollectionName, storedLayers, storedTraits });
  } catch (error) {
    console.log(error);
  }

  console.log("fetching ends...");
};
