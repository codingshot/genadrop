export const getImageSize = async (img) => {
  return new Promise(resolve => {
    const image = new Image();
    if(typeof(img) === "string"){
      image.src = img
    }else {
     image.src = URL.createObjectURL(img);
    }
    image.onload = () => {
      resolve({height: image.height, width: image.width});
    };
  })
}
