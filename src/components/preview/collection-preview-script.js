export const handleImage = async ({ layers, preview, canvas, width, height }) => {
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  const ctx = canvas.getContext("2d");
  const newPreview = [];
  [...layers].reverse().forEach(({ id, traits }) => {
    traits.forEach(({ traitTitle, image }) => {
      preview.forEach(({ layerId, imageName }) => {
        if (id === layerId && traitTitle === imageName) {
          newPreview.push(image);
        }
      });
    });
  });
  for (const img of newPreview) {
    const image = await new Promise((resolve) => {
      const image = new Image();
      image.src = URL.createObjectURL(img);
      image.onload = () => {
        resolve(image);
      };
    });

    image && ctx.drawImage(image, 0, 0, width, height);
  }
};
