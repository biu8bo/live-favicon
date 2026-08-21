function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
}

async function decodeImage(dataUrl) {
  if (typeof createImageBitmap === 'function') {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return createImageBitmap(blob);
  }

  return loadImage(dataUrl);
}

function createCanvas(size) {
  if (typeof OffscreenCanvas === 'function') {
    return new OffscreenCanvas(size, size);
  }

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

async function canvasToDataUrl(canvas) {
  if (typeof canvas.convertToBlob === 'function') {
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  return canvas.toDataURL('image/png');
}

/** 将视窗图像缩小为浏览器认可的 favicon 尺寸。 */
export async function compressToPng(dataUrl, size) {
  const image = await decodeImage(dataUrl);
  const canvas = createCanvas(size);
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('A 2D canvas context is unavailable.');
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, size, size);

  if (typeof image.close === 'function') {
    image.close();
  }

  return canvasToDataUrl(canvas);
}
