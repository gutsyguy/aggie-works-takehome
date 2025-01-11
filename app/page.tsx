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
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setRemoveModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    item: "",
    type: "",
    quantity: "" as number | "",
  });
  const [search, setSearch] = useState("");

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ item: "", type: "", quantity: "" });
  };

  const updateInventory = async () => {
    const snapshot = query(collection(db, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = docs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Item[];
    setInventory(inventoryList);
  };

  const validateForm = (): boolean => {
    const { item, type, quantity } = formData;
    if (!item || !type || quantity === "") {
      alert("All fields are required.");
      return false;
    }
    return true;
  };

  const addItem = async () => {
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
      setAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const removeItem = async () => {
    if (!validateForm()) return;

    const { item, quantity } = formData;
    const existingItem = inventory.find((entry) => entry.item === item);

    if (!existingItem) {
      alert("Item not found.");
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
      setRemoveModalOpen(false);
      resetForm();
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
      <header className="bg-blue-200 text-center text-3xl font-bold py-4">
        Inventory Management
      </header>

      <div className="flex justify-between px-10 py-4">
        <button className="btn" onClick={() => setAddModalOpen(true)}>
          Add Item
        </button>
        <button className="btn" onClick={() => setRemoveModalOpen(true)}>
          Remove Item
        </button>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
          className="input"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 px-10">
        <div>
          <h2>Item</h2>
          {filteredInventory.map((entry) => (
            <p key={entry.id}>{entry.item}</p>
          ))}
        </div>
        <div>
          <h2>Quantity</h2>
          {filteredInventory.map((entry) => (
            <p key={entry.id}>{entry.quantity}</p>
          ))}
        </div>
        <div>
          <h2>Type</h2>
          {filteredInventory.map((entry) => (
            <p key={entry.id}>{entry.type}</p>
          ))}
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <h2>Add Item</h2>
        <input
          name="item"
          value={formData.item}
          onChange={handleFormChange}
          placeholder="Item Name"
          className="input"
        />
        <input
          name="quantity"
          value={formData.quantity}
          onChange={handleFormChange}
          placeholder="Quantity"
          className="input"
          type="number"
        />
        <input
          name="type"
          value={formData.type}
          onChange={handleFormChange}
          placeholder="Item Type"
          className="input"
        />
        <button onClick={addItem} className="btn">
          Save
        </button>
      </Modal>

      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => setRemoveModalOpen(false)}
      >
        <h2>Remove Item</h2>
        <input
          name="item"
          value={formData.item}
          onChange={handleFormChange}
          placeholder="Item Name"
          className="input"
        />
        <input
          name="quantity"
          value={formData.quantity}
          onChange={handleFormChange}
          placeholder="Quantity"
          className="input"
          type="number"
        />
        <button onClick={removeItem} className="btn">
          Remove
        </button>
      </Modal>
    </div>
  );
}
