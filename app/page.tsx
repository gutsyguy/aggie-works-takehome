"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Modal from "@/components/modal";
import { Item } from "@/lib/interfaces"; // Assuming `Item` is an interface like below:
// interface Item {
//   id: string;
//   item: string;
//   quantity: number;
//   type: string;
// }

export default function Home() {
  const [inventory, setInventory] = useState<Item[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [openRemove, setOpenRemove] = useState<boolean>(false);
  const [item, setItem] = useState<string>("");
  const [itemType, setItemType] = useState<string>("");
  const [itemQuantity, setItemQuantity] = useState<number | "">("");
  const [search, setSearch] = useState<string>("");

  const updateInventory = async (): Promise<void> => {
    const snapshot = query(collection(db, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList: Item[] = docs.docs.map((doc) => ({
      id: doc.id,
      item: doc.data().item,
      quantity: doc.data().quantity,
      type: doc.data().type,
    }));
    setInventory(inventoryList);
  };

  const addItem = async (): Promise<void> => {
    if (!item || !itemType || itemQuantity === "") {
      alert("Please fill out all fields.");
      return;
    }

    const existingItemDoc = inventory.find((entry) => entry.item === item);

    if (existingItemDoc) {
      const docRef = doc(db, "inventory", existingItemDoc.id);
      const newQuantity = existingItemDoc.quantity + (itemQuantity as number);
      await updateDoc(docRef, { item, quantity: newQuantity, type: itemType });
    } else {
      const docRef = doc(collection(db, "inventory"));
      await setDoc(docRef, { item, quantity: itemQuantity, type: itemType });
    }

    await updateInventory();
    setOpen(false);
    resetFormFields();
  };

  const removeItem = async (): Promise<void> => {
    if (!item || itemQuantity === "") {
      alert("Please fill out all fields.");
      return;
    }

    const existingItemDoc = inventory.find((entry) => entry.item === item);

    if (!existingItemDoc) {
      alert("Item not found in inventory.");
      return;
    }

    const docRef = doc(db, "inventory", existingItemDoc.id);

    if (existingItemDoc.quantity <= (itemQuantity as number)) {
      await deleteDoc(docRef);
    } else {
      const newQuantity = existingItemDoc.quantity - (itemQuantity as number);
      await updateDoc(docRef, { quantity: newQuantity });
    }

    await updateInventory();
    setOpenRemove(false);
    resetFormFields();
  };

  const resetFormFields = (): void => {
    setItem("");
    setItemType("");
    setItemQuantity("");
  };

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => {
    setOpen(false);
    resetFormFields();
  };

  const handleRemoveOpen = (): void => setOpenRemove(true);
  const handleRemoveClose = (): void => {
    setOpenRemove(false);
    resetFormFields();
  };

  const searchItem = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setSearch(e.target.value);

  useEffect(() => {
    updateInventory();
  }, []);

  const filteredInventory = inventory.filter((entry) =>
    entry.item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="text-black mx-[10rem] border border-black">
        <h1 className="bg-blue-200 text-center text-[3rem] border border-black">
          Inventory List
        </h1>
        <div className="flex flex-row justify-evenly text-[2rem] border border-black text-white">
          <button
            className="bg-blue-400 px-[1rem] rounded-xl"
            onClick={handleOpen}
          >
            Add Item
          </button>
          <button
            className="bg-blue-400 px-[1rem] rounded-xl"
            onClick={handleRemoveOpen}
          >
            Remove Item
          </button>
          <form className="border border-black text-black">
            <input
              type="text"
              value={search}
              placeholder="Search items"
              onChange={searchItem}
              className="p-[0.5rem]"
            />
          </form>
        </div>

        <div className="flex flex-row justify-evenly text-[2rem]">
          <div className="flex flex-col text-center">
            <h1>Item</h1>
            {filteredInventory.map((entry) => (
              <h2 key={entry.id}>{entry.item}</h2>
            ))}
          </div>
          <div className="flex flex-col text-center">
            <h1>Quantity</h1>
            {filteredInventory.map((entry) => (
              <h2 key={entry.id}>{entry.quantity}</h2>
            ))}
          </div>
          <div className="flex flex-col text-center">
            <h1>Type</h1>
            {filteredInventory.map((entry) => (
              <h2 key={entry.id}>{entry.type}</h2>
            ))}
          </div>
        </div>

        <Modal isOpen={open} onClose={handleClose}>
          <>
            <h1 className="text-[2rem] mb-[1rem]">Add Items</h1>
            <div className="flex flex-col space-y-[1rem]">
              <input
                type="text"
                value={item}
                placeholder="Item Name"
                onChange={(e) => setItem(e.target.value)}
                className="p-[0.5rem] border border-gray-300"
              />
              <input
                type="number"
                value={itemQuantity}
                placeholder="Quantity"
                onChange={(e) => setItemQuantity(Number(e.target.value))}
                className="p-[0.5rem] border border-gray-300"
              />
              <input
                type="text"
                value={itemType}
                placeholder="Item Type"
                onChange={(e) => setItemType(e.target.value)}
                className="p-[0.5rem] border border-gray-300"
              />
              <button
                className="bg-blue-400 px-[1rem] my-[1rem] rounded-xl text-[1.5rem]"
                onClick={addItem}
              >
                Add Item
              </button>
            </div>
          </>
        </Modal>

        <Modal isOpen={openRemove} onClose={handleRemoveClose}>
          <>
            <h1 className="text-[2rem] mb-[1rem]">Remove Items</h1>
            <div className="flex flex-col space-y-[1rem]">
              <input
                type="text"
                value={item}
                placeholder="Item Name"
                onChange={(e) => setItem(e.target.value)}
                className="p-[0.5rem] border border-gray-300"
              />
              <input
                type="number"
                value={itemQuantity}
                placeholder="Quantity"
                onChange={(e) => setItemQuantity(Number(e.target.value))}
                className="p-[0.5rem] border border-gray-300"
              />
              <button
                className="bg-blue-400 px-[1rem] my-[1rem] rounded-xl text-[1.5rem]"
                onClick={removeItem}
              >
                Remove Item
              </button>
            </div>
          </>
        </Modal>
      </div>
    </div>
  );
}
