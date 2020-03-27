export interface D3TreeModel {
  name: string;
  children: D3TreeModel[];
  value: string | number | boolean | null;
}
