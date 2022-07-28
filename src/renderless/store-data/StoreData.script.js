import {
  getStorage,
  ref,
  uploadBytes,
  deleteObject,
  listAll,
  getDownloadURL,
  getMetadata,
  uploadString,
} from "firebase/storage";
import { doc, collection, setDoc, getFirestore, getDoc, getDocs, query, deleteDoc } from "firebase/firestore";

import { app } from "../../utils/firebase";

const storage = getStorage(app);
const firestore = getFirestore();

export const saveSession = async ({ currentUser, sessionId, collectionName, currentPlan }) => {
  if (currentUser && sessionId && collectionName) {
    const docRef = doc(firestore, `users/${currentUser.uid}/sessions/${sessionId}`);
    setDoc(docRef, {
      session: {
        collectionName,
        sessionId,
        currentPlan,
      },
    });
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

export const saveNftLayers = ({ currentUser, sessionId, nftLayers, nftTraits }) => {
  if (currentUser && sessionId && nftLayers.length) {
    console.log({ currentUser, sessionId, nftLayers, nftTraits });
    const docRef = doc(firestore, `users/${currentUser.uid}/${sessionId}/nftLayers`);
    setDoc(docRef, { nftLayers });

    nftTraits.forEach(async ({ id, image }, idx) => {
      const nftTraitRef = ref(storage, `${currentUser.uid}/${sessionId}/nftLayers/${id}`);
      try {
        await uploadString(nftTraitRef, image, "data_url");
        console.log({ idx });
      } catch (error) {
        console.log(`error ${error}`);
      }
    });
  }
};

export const saveTraits = async ({ currentUser, sessionId, id, traits }) => {
  if (!traits.length) return;
  if (currentUser && sessionId) {
    traits.forEach(async ({ traitTitle, image }) => {
      const traitRef = ref(storage, `${currentUser.uid}/${sessionId}/${id}/${traitTitle}`);
      try {
        await uploadBytes(traitRef, image);
        console.log({ traitTitle });
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

export const deleteAllLayers = async ({ currentUser, sessionId }) => {
  const res = await fetchNftLayers({ currentUser, sessionId });
  res &&
    res.nftLayers.forEach(async (layer) => {
      await deleteAllNftTraits({ currentUser, sessionId, id: layer.id });
    });
  const { layers } = await fetchLayers({ currentUser, sessionId });
  layers.forEach(async (layer) => {
    await deleteAllTraits({ currentUser, sessionId, id: layer.id });
  });
  await deleteSession({ currentUser, sessionId });
  await deleteDoc(doc(firestore, `users/${currentUser.uid}/${sessionId}/collectionName`));
  await deleteDoc(doc(firestore, `users/${currentUser.uid}/${sessionId}/layers`));
  await deleteDoc(doc(firestore, `users/${currentUser.uid}/${sessionId}/nftLayers`));
};

export const deleteSession = async ({ currentUser, sessionId }) => {
  await deleteDoc(doc(firestore, `users/${currentUser.uid}/sessions/${sessionId}`));
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

export const deleteAllNftTraits = async ({ currentUser, sessionId, id }) => {
  if (currentUser && sessionId) {
    const listRef = ref(storage, `${currentUser.uid}/${sessionId}/nftLayers/${id}`);
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
      sessions.push(doc.data());
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

export const fetchNftLayers = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const querySnapshot = query(doc(firestore, `users/${currentUser.uid}/${sessionId}/nftLayers`));
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
      console.log({ key });
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

const getFile = async (url, name, type) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const file = new File([blob], name, { type });
    return file;
  } catch (error) {
    console.log(error);
  }
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

export const fetchUserSession = async ({ currentUser, sessionId }) => {
  try {
    const result = await Promise.all([
      fetchCollectionName({ currentUser, sessionId }),
      fetchLayers({ currentUser, sessionId }),
      fetchTraits({ currentUser, sessionId }),
    ]);
    const [storedCollectionName, storedLayers, storedTraits] = result;

    console.log({ storedTraits, storedLayers });
    const transformedTraits = await transfromTraits(storedTraits);
    return null;
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

    return {
      layers: newLayers,
      collectionName: storedCollectionName.collectionName,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
