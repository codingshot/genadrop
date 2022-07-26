import { useRef } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { addRule, setCollectionName, setLayers, setPreview } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import { dataURItoBlob } from "../../utils";

const StoreData = () => {
  const { layers, rule, preview, collectionName, dispatch } = useContext(GenContext);
  const mountRef = useRef(false);

  const getFile = ({ imageUrl, fileName, fileType }) => {
    const imageFile = new File([dataURItoBlob(imageUrl)], fileName, { type: `image/${fileType}` });
    return imageFile;
  };

  async function getBase64(file) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function (error) {
        reject("Error: ", error);
      };
    });
  }

  useEffect(() => {
    if (layers.length || mountRef.current) {
      (async function transformLayerToStorageFormat() {
        const newLayers = await Promise.all(
          layers.map(async ({ traits, ...othersLayerProps }) => {
            const newTrait = await Promise.all(
              traits.map(async ({ image, ...otherTraits }) => {
                const name = image.name.replace(/\.+\s*\./, ".").split(".");
                const fileName = image.name;
                const fileType = name.slice(name.length - 1).join();
                const loadImage = async () => {
                  const dataUrl = await getBase64(image);
                  return { image: dataUrl, fileName, fileType, ...otherTraits };
                };
                return await loadImage();
              })
            );
            return { traits: newTrait, ...othersLayerProps };
          })
        );
        const cache = JSON.stringify(newLayers);
        window.localStorage.storedLayers = cache;
      })();
    } else {
      if (!window.localStorage.storedLayers) return [];
      const layers = JSON.parse(window.localStorage.storedLayers);
      setTimeout(() => {
        (async function transformLayerToStorageFormat() {
          const newLayers = await Promise.all(
            layers.map(async ({ traits, ...othersLayerProps }) => {
              const newTrait = await Promise.all(
                traits.map(async ({ image, fileType, fileName, ...otherTraits }) => {
                  const file = getFile({ imageUrl: image, fileType, fileName });
                  return { image: file, ...otherTraits };
                })
              );
              return { traits: newTrait, ...othersLayerProps };
            })
          );
          dispatch(setLayers(newLayers));
        })();
      }, 0);
      mountRef.current = true;
    }
  }, [layers]);

  useEffect(() => {
    if (preview.length || mountRef.current) {
      (async function transformLayerToStorageFormat() {
        const newPreview = await Promise.all(
          preview.map(async ({ imageFile, ...otherTraits }) => {
            const name = imageFile.name.replace(/\.+\s*\./, ".").split(".");
            const fileName = imageFile.name;
            const fileType = name.slice(name.length - 1).join();
            const loadImage = async () => {
              const dataUrl = await getBase64(imageFile);
              return { imageFile: dataUrl, fileName, fileType, ...otherTraits };
            };
            return await loadImage();
          })
        );
        const cache = JSON.stringify(newPreview);
        window.localStorage.storedPreview = cache;
      })();
    } else {
      if (!window.localStorage.storedPreview) return [];
      const preview = JSON.parse(window.localStorage.storedPreview);
      setTimeout(() => {
        (async function transformLayerToStorageFormat() {
          const newPreview = await Promise.all(
            preview.map(async ({ imageFile, fileType, fileName, ...otherTraits }) => {
              const file = getFile({ imageUrl: imageFile, fileType, fileName });
              return { imageFile: file, ...otherTraits };
            })
          );
          dispatch(setPreview(newPreview));
        })();
      }, 0);
    }
  }, [preview]);

  useEffect(() => {
    if (rule.length || mountRef.current) {
      (async function transformLayerToStorageFormat() {
        const newRule = await Promise.all(
          rule.map(async (r) => {
            const newLayer = await Promise.all(
              r.map(async ({ imageFile, ...otherTraits }) => {
                const name = imageFile.name.replace(/\.+\s*\./, ".").split(".");
                const fileName = imageFile.name;
                const fileType = name.slice(name.length - 1).join();
                const loadImage = async () => {
                  const dataUrl = await getBase64(imageFile);
                  return { imageFile: dataUrl, fileName, fileType, ...otherTraits };
                };
                return await loadImage();
              })
            );
            return [...newLayer];
          })
        );
        const cache = JSON.stringify(newRule);
        window.localStorage.storedRule = cache;
      })();
    } else {
      if (!window.localStorage.storedRule) return [];
      const rule = JSON.parse(window.localStorage.storedRule);
      setTimeout(() => {
        (async function transformLayerToStorageFormat() {
          const newRule = await Promise.all(
            rule.map(async (r) => {
              const newLayer = await Promise.all(
                r.map(async ({ imageFile, fileType, fileName, ...otherTraits }) => {
                  const file = getFile({ imageUrl: imageFile, fileType, fileName });
                  return { imageFile: file, ...otherTraits };
                })
              );
              return [...newLayer];
            })
          );
          dispatch(addRule(newRule));
        })();
      }, 0);
    }
  }, [rule]);

  useEffect(() => {
    if (collectionName) {
      window.localStorage.storedCollectionName = collectionName;
    } else {
      dispatch(setCollectionName(window.localStorage.storedCollectionName));
    }
  }, [collectionName]);

  return null;
};

export default StoreData;
