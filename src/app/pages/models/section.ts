import { Product } from "./product";

export interface Section {
  id: string;
  type: string;
  products: Product[];
}
