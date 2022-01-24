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

export const handleImage = async props => {
  const { canvas, images, image } = props;
  const { height, width } = await getImageSize(image);
  console.log(height, width);
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  const ctx = canvas.getContext("2d");
  for (let img of images) {
    const image = await new Promise(resolve => {
      const image = new Image();
      image.src = URL.createObjectURL(img);
      image.onload = () => {
        resolve(image);
      };
    });
    image && ctx.drawImage(image, 0, 0, width, height);
  };
};

export const handleBlankImage = async props => {
  const { img, canvas } = props
  const { height, width } = await getImageSize(img);
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  const ctx = canvas.getContext("2d");
  const image = await new Promise(resolve => {
    const image = new Image();
    image.src = "/assets/blank.png";
    image.onload = () => {
      resolve(image);
    };
  });
  image && ctx.drawImage(image, 0, 0, width, height);
};
