export enum Type{
    Vegetable = "Vegetable",
    Fruit = "Fruit"
}

export interface Item {
    item: String,
    quantity: Number,
    type: Type

}