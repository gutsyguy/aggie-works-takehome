"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
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
import { Item } from "@/lib/interfaces";

export default function Home() {
  const [inventory, setInventory] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const [formData, setFormData] = useState({
    item: "",
    type: "",
    quantity: "" as number | "",
  });
  const [search, setSearch] = useState("");

  const resetFormFields = (): void => {
    setFormData({ item: "", type: "", quantity: "" });
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const updateInventory = async (): Promise<void> => {
    try {
      const snapshot = query(collection(db, "inventory"));
      const docs = await getDocs(snapshot);
      const inventoryList: Item[] = docs.docs.map((doc) => ({
        id: doc.id,
        item: doc.data().item,
        quantity: doc.data().quantity,
        type: doc.data().type,
      }));
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const validateForm = (): boolean => {
    const { item, quantity } = formData;
    if (!item || quantity === "") {
      alert("Please fill out all fields.");
      return false;
    }
    return true;
  };

  const addItem = async (): Promise<void> => {
    if (!validateForm()) return;

    const { item, type, quantity } = formData;
    const existingItem = inventory.find((entry) => entry.item === item);

    try {
      if (existingItem) {
        const docRef = doc(db, "inventory", existingItem.id);
        await updateDoc(docRef, {
          quantity: existingItem.quantity + Number(quantity),
          type,
        });
      } else {
        const docRef = doc(collection(db, "inventory"));
        await setDoc(docRef, { item, quantity: Number(quantity), type });
      }
      await updateInventory();
      setOpen(false);
      resetFormFields();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const removeItem = async (): Promise<void> => {
    if (!validateForm()) return;

    const { item, quantity } = formData;
    const existingItem = inventory.find((entry) => entry.item === item);

    if (!existingItem) {
      alert("Item not found in inventory.");
      return;
    }

    try {
      const docRef = doc(db, "inventory", existingItem.id);
      if (existingItem.quantity <= Number(quantity)) {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, {
          quantity: existingItem.quantity - Number(quantity),
        });
      }
      await updateInventory();
      setOpenRemove(false);
      resetFormFields();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const filteredInventory = inventory.filter((entry) =>
    entry.item.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    updateInventory();
  }, []);

  return (
    <div>
      <div className="text-black mx-[10rem] border border-black">
        <h1 className="bg-blue-200 text-center text-[3rem] border border-black">
          Inventory List
        </h1>
        <div className="flex flex-row justify-evenly text-[2rem] border border-black text-white">
          <button
            className="bg-blue-400 px-[1rem] rounded-xl"
            onClick={() => setOpen(true)}
          >
            Add Item
          </button>
          <button
            className="bg-blue-400 px-[1rem] rounded-xl"
            onClick={() => setOpenRemove(true)}
          >
            Remove Item
          </button>
          <form className="border border-black text-black">
            <input
              type="text"
              value={search}
              placeholder="Search items"
              onChange={(e) => setSearch(e.target.value)}
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

        <Modal isOpen={open} onClose={() => setOpen(false)}>
          <>
            <h1 className="text-[2rem] mb-[1rem]">Add Items</h1>
            <div className="flex flex-col space-y-[1rem]">
              <input
                name="item"
                type="text"
                value={formData.item}
                placeholder="Item Name"
                onChange={handleFormChange}
                className="p-[0.5rem] border border-gray-300"
              />
              <input
                name="quantity"
                type="number"
                value={formData.quantity}
                placeholder="Quantity"
                onChange={handleFormChange}
                className="p-[0.5rem] border border-gray-300"
              />
              <input
                name="type"
                type="text"
                value={formData.type}
                placeholder="Item Type"
                onChange={handleFormChange}
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

        <Modal isOpen={openRemove} onClose={() => setOpenRemove(false)}>
          <>
            <h1 className="text-[2rem] mb-[1rem]">Remove Items</h1>
            <div className="flex flex-col space-y-[1rem]">
              <input
                name="item"
                type="text"
                value={formData.item}
                placeholder="Item Name"
                onChange={handleFormChange}
                className="p-[0.5rem] border border-gray-300"
              />
              <input
                name="quantity"
                type="number"
                value={formData.quantity}
                placeholder="Quantity"
                onChange={handleFormChange}
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
