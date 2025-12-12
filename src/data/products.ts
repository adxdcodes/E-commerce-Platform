export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  colors: string[];
  sizes: string[];
  images: string[];
  description: string;
  materials: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isTrending?: boolean;
  isSale?: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Quantum Flux Jacket",
    brand: "NEXUS",
    price: 459,
    category: "men",
    subcategory: "outerwear",
    colors: ["#1A1A1A", "#2D3748", "#1A9FFF"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80"
    ],
    description: "Engineered for the modern explorer. Water-resistant tech fabric with thermal regulation and magnetic closures.",
    materials: "92% Recycled Polyester, 8% Elastane. DWR coating.",
    rating: 4.8,
    reviews: 127,
    isNew: true,
    isTrending: true
  },
  {
    id: "2",
    name: "Void Runner Sneakers",
    brand: "AETHER",
    price: 289,
    originalPrice: 350,
    category: "men",
    subcategory: "footwear",
    colors: ["#0A0A0F", "#FFFFFF", "#A259FF"],
    sizes: ["40", "41", "42", "43", "44", "45"],
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80"
    ],
    description: "Ultra-lightweight running shoes with reactive foam technology. Zero-gravity feel.",
    materials: "Mesh upper, Flyknit construction, EVA midsole.",
    rating: 4.9,
    reviews: 342,
    isSale: true,
    isTrending: true
  },
  {
    id: "3",
    name: "Neural Link Hoodie",
    brand: "SYNTH",
    price: 189,
    category: "women",
    subcategory: "tops",
    colors: ["#12121A", "#1A9FFF", "#A259FF"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800&q=80"
    ],
    description: "Premium oversized hoodie with hidden tech pockets and reflective accents.",
    materials: "100% Organic Cotton, French Terry, 380 GSM.",
    rating: 4.7,
    reviews: 89,
    isNew: true
  },
  {
    id: "4",
    name: "Stealth Cargo Pants",
    brand: "GHOST",
    price: 245,
    category: "women",
    subcategory: "bottoms",
    colors: ["#0A0A0F", "#23232F"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
      "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&q=80"
    ],
    description: "Technical cargo pants with magnetic closures and articulated knees.",
    materials: "65% Cotton, 35% Nylon. Water-resistant finish.",
    rating: 4.6,
    reviews: 156,
    isTrending: true
  },
  {
    id: "5",
    name: "Cipher Watch",
    brand: "QUANTUM",
    price: 599,
    category: "accessories",
    subcategory: "watches",
    colors: ["#0A0A0F", "#1A9FFF"],
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80"
    ],
    description: "Minimalist timepiece with sapphire crystal and Swiss movement.",
    materials: "316L Stainless Steel, Italian Leather Strap.",
    rating: 4.9,
    reviews: 78,
    isNew: true
  },
  {
    id: "6",
    name: "Horizon Bomber",
    brand: "SKYLINE",
    price: 395,
    originalPrice: 495,
    category: "men",
    subcategory: "outerwear",
    colors: ["#23232F", "#1A9FFF"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=800&q=80"
    ],
    description: "Classic bomber silhouette with modern tech fabrics and thermal lining.",
    materials: "Water-resistant nylon, Thinsulate insulation.",
    rating: 4.7,
    reviews: 203,
    isSale: true
  },
  {
    id: "7",
    name: "Pulse Crossbody",
    brand: "ORBIT",
    price: 175,
    category: "accessories",
    subcategory: "bags",
    colors: ["#0A0A0F", "#A259FF", "#1A9FFF"],
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
    ],
    description: "Compact crossbody with RFID protection and hidden compartments.",
    materials: "Ballistic Nylon, YKK zippers.",
    rating: 4.5,
    reviews: 112,
    isTrending: true
  },
  {
    id: "8",
    name: "Eclipse Dress",
    brand: "LUNA",
    price: 329,
    category: "women",
    subcategory: "dresses",
    colors: ["#0A0A0F", "#23232F"],
    sizes: ["XS", "S", "M", "L"],
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80"
    ],
    description: "Sculptural midi dress with asymmetric hem and hidden pockets.",
    materials: "95% Viscose, 5% Elastane. Made in Italy.",
    rating: 4.8,
    reviews: 67,
    isNew: true
  },
  {
    id: "9",
    name: "Phantom Tee",
    brand: "SHADE",
    price: 85,
    category: "men",
    subcategory: "tops",
    colors: ["#0A0A0F", "#FFFFFF", "#23232F"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
    ],
    description: "Essential heavyweight tee with dropped shoulders and raw hem.",
    materials: "100% Egyptian Cotton, 280 GSM.",
    rating: 4.6,
    reviews: 445,
    isTrending: true
  },
  {
    id: "10",
    name: "Apex Sunglasses",
    brand: "PRISM",
    price: 225,
    category: "accessories",
    subcategory: "eyewear",
    colors: ["#0A0A0F", "#1A9FFF"],
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80"
    ],
    description: "Geometric frames with polarized lenses and titanium temples.",
    materials: "Acetate frame, Zeiss lenses.",
    rating: 4.7,
    reviews: 89,
    isNew: true
  },
  {
    id: "11",
    name: "Nova Leggings",
    brand: "PULSE",
    price: 125,
    category: "women",
    subcategory: "bottoms",
    colors: ["#0A0A0F", "#A259FF", "#1A9FFF"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80",
      "https://images.unsplash.com/photo-1548357108-d6c1f1c6b3c2?w=800&q=80"
    ],
    description: "High-performance leggings with compression zones and hidden pocket.",
    materials: "78% Recycled Nylon, 22% Lycra.",
    rating: 4.8,
    reviews: 234,
    isTrending: true
  },
  {
    id: "12",
    name: "Drift Backpack",
    brand: "NOMAD",
    price: 295,
    originalPrice: 350,
    category: "accessories",
    subcategory: "bags",
    colors: ["#0A0A0F", "#23232F"],
    sizes: ["One Size"],
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80"
    ],
    description: "30L technical backpack with laptop compartment and sternum strap.",
    materials: "1000D Cordura, DWR coating.",
    rating: 4.9,
    reviews: 156,
    isSale: true
  }
];

export const categories = [
  {
    id: "men",
    name: "Men",
    image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80",
    description: "Curated essentials for the modern man"
  },
  {
    id: "women",
    name: "Women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
    description: "Elevated style for every occasion"
  },
  {
    id: "streetwear",
    name: "Streetwear",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=800&q=80",
    description: "Urban culture meets high fashion"
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    description: "The finishing touches"
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(p => p.category === category);
};

export const getTrendingProducts = (): Product[] => {
  return products.filter(p => p.isTrending);
};

export const getNewProducts = (): Product[] => {
  return products.filter(p => p.isNew);
};

export const getSaleProducts = (): Product[] => {
  return products.filter(p => p.isSale);
};
