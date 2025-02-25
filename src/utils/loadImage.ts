export async function loadImage(img: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = img;
    image.onload = () => resolve(image);
    image.onerror = reject;
  });
}
