export const getImageSize = async (img) => {
  return new Promise(resolve => {
    const image = new Image();
    image.src = URL.createObjectURL(img);
    image.onload = () => {
      resolve({height: image.height, width: image.width});
    };
  })
}
