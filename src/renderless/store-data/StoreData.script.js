import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, setDoc, getFirestore, getDoc, query } from "firebase/firestore";

import { app } from "../../utils/firebase";
import { dataURItoBlob } from "../../utils";

const storage = getStorage(app);
const firestore = getFirestore();

export const saveCollectionName = async ({ user, sessionId, collectionName }) => {
  if (user && sessionId) {
    const docRef = doc(firestore, `users/${user.uid}/${sessionId}/collectionName`);
    setDoc(docRef, { collectionName });
  }
};

export const saveLayers = ({ user, sessionId, layers }) => {
  if (user && sessionId) {
    const docRef = doc(firestore, `users/${user.uid}/${sessionId}/layers`);
    setDoc(docRef, { layers });
  }
};

export const saveTraits = async ({ user, sessionId, id, traits }) => {
  if (!traits.length) return;
  if (user && sessionId) {
    traits.forEach(async ({ traitTitle, image }) => {
      const traitRef = ref(storage, `${user.uid}/${sessionId}/${id}/${traitTitle}`);
      try {
        await uploadBytes(traitRef, image);
      } catch (error) {
        console.log(`error ${error}`);
      }
    });
  }
};

export const renameTrait = async ({ user, sessionId, id, oldName, newName, image }) => {
  if (user && sessionId) {
    const traitRef = ref(storage, `${user.uid}/${sessionId}/${id}/${newName}`);
    // upload the new file
    try {
      await uploadBytes(traitRef, image);
    } catch (error) {
      console.log(`error ${error}`);
    }

    const deleteRef = ref(storage, `${user.uid}/${sessionId}/${id}/${oldName}`);
    // Delete the old file
    try {
      await deleteObject(deleteRef);
    } catch (error) {
      console.log(`error ${error}`);
    }
  }
};

export const deleteTrait = async ({ user, sessionId, id, traitTitle }) => {
  if (user && sessionId) {
    const deleteRef = ref(storage, `${user.uid}/${sessionId}/${id}/${traitTitle}`);
    try {
      await deleteObject(deleteRef);
    } catch (error) {
      console.log(`error ${error}`);
    }
  }
};

export const deleteAllTraits = async ({ user, sessionId, id }) => {
  if (user && sessionId) {
    const listRef = ref(storage, `${user.uid}/${sessionId}/${id}`);

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

export const fetchTraits = async ({ user, sessionId }) => {
  if (user && sessionId) {
    const listRef = ref(storage, `${user.uid}/${sessionId}/`);
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
            key = metadata.fullPath.split("/")[1];
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

export const fetchLayers = async ({ user, sessionId }) => {
  if (user && sessionId) {
    const querySnapshot = query(doc(firestore, `users/${user.uid}/${sessionId}/layers`));
    const docSnapshot = await getDoc(querySnapshot);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("document does not exist");
    }
  }
};

export const fetchCollectionName = async ({ user, sessionId }) => {
  if (user && sessionId) {
    const querySnapshot = query(doc(firestore, `users/${user.uid}/${sessionId}/collectionName`));
    const docSnapshot = await getDoc(querySnapshot);
    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("document does not exist");
    }
  }
};

export const constructLayers = async ({ dispatch, storedCollectionName, storedLayers, storedTraits }) => {
  console.log("storedCollectionName: ", storedCollectionName);
  console.log("storedLayers: ", storedLayers);
  console.log("storedTraits: ", storedTraits);
  const transformedTraits = await transfromTraits(storedTraits);
  console.log({ transformedTraits });

  // const newLayers = storedLayers.map(({ traits, id, ...otherLayerProps }) => {
  // const arr = transformedTraits[id];
  // console.log({id});
  // const newTraits = traits.map(({ image, traitTitle, ...otherTraitProps }) => {
  //   let file = null;
  //   for (let a of arr) {
  //     if (a.name === traitTitle) {
  //       file = a;
  //       break;
  //     }
  //   }
  //   return { image: file, ...otherTraitProps };
  // });
  // return { traits: newTraits, ...otherLayerProps };
  // });

  console.log({ newLayers });
};

const getFile = async (url, name, type) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], name, { type });
  return file;
};

const transfromTraits = async (traits) => {
  const newTraits = {};
  await Promise.all(
    traits.map(async (traitObj) => {
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
