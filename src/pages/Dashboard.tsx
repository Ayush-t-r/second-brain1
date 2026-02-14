import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { itemsApi } from '../services/api';
import { Item } from '../types';
import Layout from '../components/Layout/Layout';
import SearchBar from '../components/Items/SearchBar';
import ItemCard from '../components/Items/ItemCard';
import { PlusIcon, FileTextIcon, LinkIcon, SearchIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadItems();
    }
  }, [user]);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, selectedTags]);

  const loadItems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await itemsApi.getItems(user._id);
      setItems(data);
      
      // Extract unique tags
      const tags = new Set<string>();
      data.forEach(item => {
        item.tags.forEach(tag => tags.add(tag));
      });
      setAvailableTags(Array.from(tags));
    } catch (error) {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item =>
        selectedTags.every(tag => item.tags.includes(tag))
      );
    }

    setFilteredItems(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await itemsApi.deleteItem(id);
      setItems(items.filter(item => item._id !== id));
      toast.success('Item deleted successfully');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleToggleShare = async (id: string) => {
    const item = items.find(i => i._id === id);
    if (!item) return;

    try {
      const updates: Partial<Item> = {
        isPublic: !item.isPublic,
        shareId: !item.isPublic ? `share-${Date.now()}` : undefined
      };
      
      const updatedItem = await itemsApi.updateItem(id, updates);
      setItems(items.map(i => i._id === id ? updatedItem : i));
      
      toast.success(updatedItem.isPublic ? 'Item is now public' : 'Item is now private');
    } catch (error) {
      toast.error('Failed to update sharing settings');
    }
  };

  const noteCount = items.filter(item => item.type === 'note').length;
  const linkCount = items.filter(item => item.type === 'link').length;

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}
            </h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">
              Your personal knowledge base
            </p>
          </div>
          <Link
            to="/add"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Item
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Notes
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {noteCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <LinkIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Links
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {linkCount}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-md rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <SearchIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Total Items
                    </dt>
                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                      {items.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          availableTags={availableTags}
        />

        {/* Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <FileTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {items.length === 0 ? 'No items yet' : 'No items match your filters'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {items.length === 0 
                ? 'Get started by adding your first note or link.'
                : 'Try adjusting your search terms or clearing filters.'
              }
            </p>
            {items.length === 0 && (
              <div className="mt-6">
                <Link
                  to="/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add your first item
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                onDelete={handleDelete}
                onToggleShare={handleToggleShare}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;