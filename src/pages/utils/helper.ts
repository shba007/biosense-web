import sharp from "sharp";

function convertBox(initBox: number[], imageDim, initFormat: "CCWH" | "XYWH" | "XYXY" = 'XYXY', initNormalized = false, finalFormat: "CCWH" | "XYWH" | "XYXY" = 'CCWH', finalNormalized = false, isDebug = false): [number, number, number, number] {
	const finalBox = new Array(4).fill(0) as [number, number, number, number];
	const [imgWidth, imgHeight] = imageDim

	if (initNormalized) {
		initBox[0] *= imgWidth;
		initBox[1] *= imgHeight;
		initBox[2] *= imgWidth;
		initBox[3] *= imgHeight;
	}

	let xCenter, yCenter, width, height;

	// Convert from "XYXY" or "XYWH" to "CCWH"
	if (initFormat === 'XYXY') {
		xCenter = (initBox[0] + initBox[2]) / 2;
		yCenter = (initBox[1] + initBox[3]) / 2;
		width = initBox[2] - initBox[0];
		height = initBox[3] - initBox[1];
	} else if (initFormat === 'XYWH') {
		xCenter = initBox[0] + initBox[2] / 2;
		yCenter = initBox[1] + initBox[3] / 2;
		width = initBox[2];
		height = initBox[3];
	} else {
		xCenter = initBox[0]
		yCenter = initBox[1]
		width = initBox[2]
		height = initBox[3]
	}

	// if (isDebug)
	// 	console.log({ xCenter, yCenter, width, height });

	// Convert from "CCWH" to "XYXY" or "XYWH"
	if (finalFormat === 'XYXY') {
		finalBox[0] = xCenter - width / 2;
		finalBox[1] = yCenter - height / 2;
		finalBox[2] = xCenter + width / 2;
		finalBox[3] = yCenter + height / 2;
	} else if (finalFormat === 'XYWH') {
		finalBox[0] = xCenter - width / 2;
		finalBox[1] = yCenter - height / 2;
		finalBox[2] = width;
		finalBox[3] = height;
	} else {
		finalBox[0] = xCenter;
		finalBox[1] = yCenter;
		finalBox[2] = width;
		finalBox[3] = height;
	}

	// if (isDebug)
	// 	console.log({ finalBox });

	if (finalNormalized) {
		finalBox[0] /= imgWidth;
		finalBox[1] /= imgHeight;
		finalBox[2] /= imgWidth;
		finalBox[3] /= imgHeight;
	}

	// if (isDebug)
	// 	console.log({ finalBoxNormalized: finalBox });

	return finalBox;
}

async function base64ToArray(base64Image) {
	try {
		// Convert the base64 image to a buffer
		const buffer = Buffer.from(base64Image.split(",")[1], "base64");

		return buffer;
	} catch (error) {
		console.error(error);
	}
}

async function resize(
	image: Buffer,
	dim: [number, number],
	background_color = [255, 255, 255]
): Promise<[Buffer, [number, number]]> {
	const bufferedImage = Buffer.from(image);
	const { width, height } = await sharp(bufferedImage).metadata();
	const oldDim = [width, height] as [number, number]

	let result = sharp(bufferedImage);

	if (width !== height) {
		const aspectRatio = width / height;
		let paddingSize;
		let topPadding = 0;
		let bottomPadding = 0;
		let leftPadding = 0;
		let rightPadding = 0;

		if (aspectRatio > 1) {
			// Image is taller (portrait)
			paddingSize = Math.round((width - height) / 2);
			topPadding = paddingSize;
			bottomPadding = paddingSize;
		} else {
			// Image is wider (landscape)
			paddingSize = Math.round((height - width) / 2);
			leftPadding = paddingSize;
			rightPadding = paddingSize;
		}

		result = result.extend({
			top: topPadding,
			bottom: bottomPadding,
			left: leftPadding,
			right: rightPadding,
			background: {
				r: background_color[0],
				g: background_color[1],
				b: background_color[2],
				alpha: 1
			}, // Change the background color if needed
		})
		// saveUint8ArrayAsImage(result, [0, 0], "assets/images/square.jpg")
	}

	const squaredImage = await result.toBuffer()
	const resizedImage = await sharp(squaredImage).resize({ width: dim[0], height: dim[1] }).toBuffer()

	// saveUint8ArrayAsImage(resizedImage, dim, "assets/images/resize.jpg")

	return [resizedImage, oldDim];
}

// Convert the image to a width x height x 3 shape array

// Convert the image to a width x height x 3 shape array
async function reshape(buffer: Buffer, [width, height]: [number, number]) {
	buffer = await sharp(buffer).raw().toBuffer()

	const flatArray = new Uint8Array(buffer);
	const channels = 3
	const shapeArray = []

	for (let i = 0; i < height; i++) {
		const row = [];
		for (let j = 0; j < width; j++) {
			const pixel = [];
			for (let k = 0; k < channels; k++)
				pixel.push(flatArray[(i * width + j) * channels + k])
			row.push(pixel);
		}
		shapeArray.push(row);
	}

	// console.log(shapeArray);
	return shapeArray as unknown as number[]
}

export { resize, reshape, convertBox, base64ToArray };
