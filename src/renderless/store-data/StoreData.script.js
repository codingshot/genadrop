/* eslint-disable no-return-assign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-await */
/* eslint-disable prefer-const */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-else-return */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
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
import { setActionProgress } from "../../gen-state/gen.actions";
import { getFile, getBase64FromUrl } from "../../utils";

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
    const docRef = doc(firestore, `users/${currentUser.uid}/collectionName/${sessionId}`);
    setDoc(docRef, { collectionName });
  }
};

export const saveLayers = ({ currentUser, sessionId, layers }) => {
  if (currentUser && sessionId) {
    const docRef = doc(firestore, `users/${currentUser.uid}/layers/${sessionId}`);
    setDoc(docRef, { layers });
  }
};

export const saveRules = ({ currentUser, sessionId, rules }) => {
  if (currentUser && sessionId) {
    const docRef = doc(firestore, `users/${currentUser.uid}/rules/${sessionId}`);
    setDoc(docRef, { rules });
  }
};

export const saveNftLayers = ({ currentUser, sessionId, nftLayers, nftTraits }) => {
  if (currentUser && sessionId && nftLayers.length) {
    const docRef = doc(firestore, `users/${currentUser.uid}/nftLayers/${sessionId}`);
    setDoc(docRef, { nftLayers });
    // save the layer trait to storage
    nftTraits.forEach(async ({ id, image }) => {
      const nftTraitRef = ref(storage, `${currentUser.uid}/nftLayers/${sessionId}/${id}`);
      try {
        await uploadString(nftTraitRef, image, "data_url");
      } catch (error) {
        console.log(`error ${error}`);
      }
    });
  }
};

export const saveTraits = async ({ dispatch, currentUser, sessionId, id, traits }) => {
  if (!traits.length) return;
  if (currentUser && sessionId) {
    await Promise.all(
      traits.map(async ({ traitTitle, image }) => {
        const traitRef = ref(storage, `${currentUser.uid}/${sessionId}/${id}/${traitTitle}`);
        try {
          await uploadBytes(traitRef, image);
          console.log({ traitTitle });
          dispatch(setActionProgress({ totalCount: traits.length }));
        } catch (error) {
          console.log(`error ${error}`);
        }
      })
    );
    dispatch(setActionProgress({ resetCount: true }));
    console.log("uploaded successfully");
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
  try {
    const res = await fetchNftLayers({ currentUser, sessionId });
    res && (await deleteAllNftTraits({ currentUser, sessionId }));
    const { layers } = await fetchLayers({ currentUser, sessionId });
    layers.forEach(async (layer) => {
      await deleteAllTraits({ currentUser, sessionId, id: layer.id });
    });
    await deleteDoc(doc(firestore, `users/${currentUser.uid}/sessions/${sessionId}`));
    await deleteDoc(doc(firestore, `users/${currentUser.uid}/collectionName/${sessionId}`));
    await deleteDoc(doc(firestore, `users/${currentUser.uid}/layers/${sessionId}`));
    await deleteDoc(doc(firestore, `users/${currentUser.uid}/rules/${sessionId}`));
    await deleteDoc(doc(firestore, `users/${currentUser.uid}/nftLayers/${sessionId}`));
  } catch (error) {
    console.log("error: ", error);
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

export const deleteAllNftTraits = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const listRef = ref(storage, `${currentUser.uid}/nftLayers/${sessionId}`);
    const res = await listAll(listRef);
    const folder = await Promise.all(
      res.items.map(async (folderRef) => {
        return folderRef;
      })
    );
    folder.forEach(async (ref) => {
      try {
        await deleteObject(ref);
      } catch (error) {
        console.log(`nftLayers error ${error}`);
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
    const querySnapshot = query(doc(firestore, `users/${currentUser.uid}/collectionName/${sessionId}`));
    const docSnapshot = await getDoc(querySnapshot);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("collectionName does not exist");
    }
  }
};

export const fetchLayers = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const querySnapshot = query(doc(firestore, `users/${currentUser.uid}/layers/${sessionId}`));
    const docSnapshot = await getDoc(querySnapshot);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("layers does not exist");
    }
  }
};

export const fetchRules = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const querySnapshot = query(doc(firestore, `users/${currentUser.uid}/rules/${sessionId}`));
    const docSnapshot = await getDoc(querySnapshot);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("rules does not exist");
    }
  }
};

export const fetchNftLayers = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const querySnapshot = query(doc(firestore, `users/${currentUser.uid}/nftLayers/${sessionId}`));
    const docSnapshot = await getDoc(querySnapshot);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("nftLayers does not exist");
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
    return await Promise.all(folders.map(async (ref) => await getFiles(ref)));
  }
};

export const fetchNftTraits = async ({ currentUser, sessionId }) => {
  if (currentUser && sessionId) {
    const listRef = ref(storage, `${currentUser.uid}/nftLayers/${sessionId}/`);
    // Find all the prefixes and items.
    const res = await listAll(listRef);
    const nftTraits = {};
    await Promise.all(
      res.items.map(async (itemRef) => {
        // All the items under listRef.
        let file = {};
        try {
          const url = await getDownloadURL(ref(storage, itemRef));
          file.url = url;
          const metadata = await getMetadata(itemRef);
          file.metadata = metadata;
          const key = metadata.fullPath.split("/")[3];
          nftTraits[key] = file;
          return null;
        } catch (error) {
          console.log(error);
        }
      })
    );
    return nftTraits;
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

const transfromNftTraits = async (value) => {
  let newTrait = {};
  await Promise.all(
    Object.keys(value).map(async (key) => {
      const { url } = value[key];
      const file = await getBase64FromUrl(url);
      newTrait[key] = file;
      return null;
    })
  );
  return newTrait;
};

export const fetchUserSession = async ({ currentUser, sessionId }) => {
  console.log("fetching");
  try {
    const result = await Promise.all([
      fetchCollectionName({ currentUser, sessionId }),
      fetchLayers({ currentUser, sessionId }),
      fetchNftLayers({ currentUser, sessionId }),
      fetchRules({ currentUser, sessionId }),
      fetchTraits({ currentUser, sessionId }),
      fetchNftTraits({ currentUser, sessionId }),
    ]);
    const [storedCollectionName, storedLayers, storedNftLayers, storedRules, storedTraits, storedNftTraits] = result;
    console.log({
      storedCollectionName,
      storedLayers,
      storedNftLayers,
      storedRules,
      storedTraits,
      storedNftTraits,
    });
    let newCollectionName = "New Collection";
    if (storedCollectionName) {
      newCollectionName = storedCollectionName.collectionName;
    }

    let newLayers = [];
    if (storedLayers) {
      const transformedTraits = await transfromTraits(storedTraits);
      newLayers = constructLayers({ storedLayers, transformedTraits });
    }

    let newNftLayers = [];
    if (storedNftLayers) {
      let startTime = performance.now();
      const transformedNftTraits = await transfromNftTraits(storedNftTraits);
      newNftLayers = constructNftLayers({ storedNftLayers, transformedNftTraits });
      let endTime = performance.now();
      console.log(`Call to fetch newNftLayers collection took ${(endTime - startTime) / 1000} seconds`);
    }

    let newRules = [];
    if (storedRules) {
      try {
        let parseRules = JSON.parse(storedRules.rules);
        newRules = constructRules({ newLayers, parseRules });
      } catch (error) {
        console.log({ error });
      }
    }

    return {
      rules: newRules,
      layers: newLayers,
      nftLayers: newNftLayers,
      collectionName: newCollectionName,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const constructLayers = ({ storedLayers, transformedTraits }) => {
  return storedLayers.layers.map(({ traits, id, ...otherLayerProps }) => {
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
};

export const constructNftLayers = ({ storedNftLayers, transformedNftTraits }) => {
  return storedNftLayers.nftLayers.map(({ id, image, ...otherLayerProps }) => {
    const file = transformedNftTraits[id];
    return { id, image: file, ...otherLayerProps };
  });
};

export const constructRules = ({ newLayers, parseRules }) => {
  const mapLayersToObj = () => {
    const mapedLayers = {};
    newLayers.forEach((layer) => (mapedLayers[layer.id] = layer));
    return mapedLayers;
  };
  const layers = mapLayersToObj();
  const transformedRules = parseRules.map((r) => {
    let iRule = r.map(({ layerId, layerTitle, imageName }) => {
      let { traits } = layers[layerId];
      let imageFile = null;
      for (let { traitTitle, image } of traits) {
        if (traitTitle === imageName) {
          imageFile = image;
          break;
        }
      }
      return { imageFile, layerId, layerTitle, imageName };
    });
    return iRule;
  });
  return transformedRules;
};
