export enum Type{
    Vegetable = "Vegetable",
    Fruit = "Fruit"
}

export interface Item {
    id: string;
    item: string,
    quantity: number,
    type:string 

}