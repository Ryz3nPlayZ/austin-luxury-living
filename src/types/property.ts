export interface Property {
  id: string;
  images: string[];
  price: number;
  address: string;
  neighborhood: string;
  beds: number;
  baths: number;
  sqft: number;
  status: "New" | "Under Contract" | null;
  isPocket: boolean;
}
