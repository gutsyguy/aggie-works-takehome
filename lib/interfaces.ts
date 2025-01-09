export enum Type{
    Vegetable = "Vegetable",
    Fruit = "Fruit"
}

export interface Item {
    item: string,
    quantity: Number,
    type: Type

}