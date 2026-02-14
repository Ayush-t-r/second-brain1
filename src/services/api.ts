import { Item } from '../types';

// Simulate API calls using localStorage
export const itemsApi = {
  // Get all items for current user
  getItems: async (userId: string): Promise<Item[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    return items.filter((item: Item) => item.userId === userId);
  },

  // Create new item
  createItem: async (itemData: Omit<Item, '_id' | 'createdAt' | 'updatedAt'>): Promise<Item> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    
    const newItem: Item = {
      ...itemData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    items.push(newItem);
    localStorage.setItem('items', JSON.stringify(items));
    return newItem;
  },

  // Update item
  updateItem: async (id: string, updates: Partial<Item>): Promise<Item> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const itemIndex = items.findIndex((item: Item) => item._id === id);
    
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }
    
    items[itemIndex] = {
      ...items[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem('items', JSON.stringify(items));
    return items[itemIndex];
  },

  // Delete item
  deleteItem: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const filteredItems = items.filter((item: Item) => item._id !== id);
    localStorage.setItem('items', JSON.stringify(filteredItems));
  },

  // Get item by ID
  getItem: async (id: string): Promise<Item | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    return items.find((item: Item) => item._id === id) || null;
  },

  // Get public item by share ID
  getPublicItem: async (shareId: string): Promise<Item | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    return items.find((item: Item) => item.shareId === shareId && item.isPublic) || null;
  }
};