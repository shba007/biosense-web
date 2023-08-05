import { NextApiRequest, NextApiResponse } from "next";
import { ofetch } from 'ofetch'

import sharp from "sharp";
import { Box, Product } from "../utils/models";
import { convertBox, resize, reshape, base64ToArray } from "../utils/helper";

const CLASS_DIM: [number, number] = [224, 224]

function argmax(array: number[]) {
  if (!Array.isArray(array) || array.length === 0) {
    throw new Error('Input must be a non-empty array.');
  }

  let maxIndex = 0;
  let maxValue = array[0];

  for (let i = 1; i < array.length; i++) {
    if (array[i] > maxValue) {
      maxValue = array[i];
      maxIndex = i;
    }
  }

  return maxIndex;
}

async function cropImage(image: Buffer, boxes: Box[]): Promise<Buffer[]> {
  const imageSharp = sharp(image);
  const { width: imgWidth, height: imgHeight } = await imageSharp.metadata()
  // Convert boxes of CCWH to XYWH int
  return Promise.all(boxes.map(async ({ x, y, width, height }) => {
    const box = convertBox([x / 100, y / 100, width / 100, height / 100], [imgWidth, imgHeight], "CCWH", true, "XYWH", false).map((num) => Math.floor(num));
    const temp = await imageSharp.resize({ width: imgWidth, height: imgHeight })
      .extract({ left: box[0], top: box[1], width: box[2], height: box[3] })
      .toBuffer();

    // saveUint8ArrayAsImage(temp, [imgWidth, imgHeight], `assets/test-${Math.floor(x)}.jpg`)
    return temp
  }))
}

async function preprocess(images: Buffer[]): Promise<number[][]> {
  const reshapedImagesArray = await Promise.all(images.map(async (image) => {
    // Resize into 640x640
    const [resizedImageArray, dim] = await resize(image, CLASS_DIM)
    // console.log({ resizedImageArray })
    return reshape(resizedImageArray, CLASS_DIM)
  }))
  // console.log({ reshapedImageArray })

  return reshapedImagesArray
}

async function predict(images: Buffer[]): Promise<number[][]> {
  const config = { apiUrl: process.env.API_URL }

  const preprocessedImages = await preprocess(images)
  try {
    const embeddings = await ofetch("/plant_disease:predict", { baseURL: config.apiUrl, method: "POST", body: { "instances": preprocessedImages } })

    return postprocess(embeddings['predictions'])
  } catch (error) {
    throw Error("Failed request Tensorflow Serving /feature_extractor:predict", error)
  }
}

async function postprocess(embeddings: number[][]): Promise<string[][]> {
  const filteredProductsSKUs: string[][] = []

  await Promise.all(embeddings.map(async (embedding) => {
    try {
      /*  const result = await qdrant.search("Earrings", {
         vector: embedding,
         limit: 20,
       });

      const products: { lakeId: string, sku: string }[] = result.map(({ payload }) => ({ lakeId: payload.lakeId as string, sku: payload.sku as string }))
      const filteredProductSKUs = new Set<string>()
      products.filter((product) => product.sku !== '')
        .forEach((product) => filteredProductSKUs.add(product.sku))

      filteredProductsSKUs.push([...filteredProductSKUs]) */
      // ["bacterial leaf spot pothos","fine","yellow leaf"]

      filteredProductsSKUs.push([...embedding])
    } catch (error) {
      throw Error("Failed request Qdrant", error)
    }
  }))
  // console.log(filteredProductsSKUs);

  return filteredProductsSKUs
}

export interface SearchProduct extends Omit<Product, 'ratings'> {
  totalRating: number
  averageRating: number,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let { image } = req.body as { image: string };

    const boxes = [{
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      conf: 100,
    }]
    // Open image with that id
    const imageArray = await base64ToArray(image)
    // Make image Crops using the boxes
    const images = await cropImage(imageArray, boxes)
    // console.log({ images });
    const labels = await predict(images)
    const diseases = ["bacterial leaf spot pothos", "fine", "yellow leaf"]

    return res.status(200).json(labels[0].map((prob, index) => ({
      disease: diseases[index],
      prob: prob * 100
    })))
  } catch (error: any) {
    if (error?.statusCode === 404)
      throw error

    console.error("API search POST", error);

    throw new Error(JSON.stringify({ statusCode: 500, statusMessage: 'Some Unknown Error Found' }))
  }
}