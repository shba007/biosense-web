export interface Box {
	x: number;
	y: number;
	width: number;
	height: number;
	conf: number;
}

export interface Detection {
	id: string;
	boxes: Box[];
}

export interface Product {
	id: string;
	image: string;
	banner: 'popular' | 'newest' | 'treading' | null;
	name: string;
	categories: string;
	price: {
		original: number;
		discounted: number;
	};
	rank: number;
	totalRating: number;
	averageRating: number;
	stock: boolean;
}
