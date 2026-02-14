import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { itemsApi } from '../services/api';
import { Item } from '../types';
import Layout from '../components/Layout/Layout';
import { 
  FileTextIcon, 
  LinkIcon, 
  EditIcon, 
  ShareIcon, 
  ExternalLinkIcon,
  ArrowLeftIcon,
  ClockIcon,
  TagIcon,
  CopyIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

const ViewItem: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadItem(id);
    }
  }, [id]);

  const loadItem = async (itemId: string) => {
    try {
      setLoading(true);
      const data = await itemsApi.getItem(itemId);
      
      if (!data) {
        toast.error('Item not found');
        navigate('/dashboard');
        return;
      }

      // Check if user owns this item
      if (data.userId !== user?._id) {
        toast.error('You don\'t have permission to view this item');
        navigate('/dashboard');
        return;
      }

      setItem(data);
    } catch (error) {
      toast.error('Failed to load item');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleShare = async () => {
    if (!item) return;

    try {
      const updates: Partial<Item> = {
        isPublic: !item.isPublic,
        shareId: !item.isPublic ? `share-${Date.now()}` : undefined
      };
      
      const updatedItem = await itemsApi.updateItem(item._id, updates);
      setItem(updatedItem);
      
      toast.success(updatedItem.isPublic ? 'Item is now public' : 'Item is now private');
    } catch (error) {
      toast.error('Failed to update sharing settings');
    }
  };

  const copyShareLink = () => {
    if (item?.shareId) {
      const shareUrl = `${window.location.origin}/share/${item.shareId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!item) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Item not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${
                item.type === 'note' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
              }`}>
                {item.type === 'note' ? (
                  <FileTextIcon className="h-6 w-6" />
                ) : (
                  <LinkIcon className="h-6 w-6" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                    <ClockIcon className="h-4 w-4" />
                    <span className="text-sm">Created {formatDate(item.createdAt)}</span>
                  </div>
                  {item.isPublic && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                      Public
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {item.type === 'link' && item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <ExternalLinkIcon className="h-4 w-4" />
                  <span>Open Link</span>
                </a>
              )}
              
              <button
                onClick={handleToggleShare}
                className={`inline-flex items-center space-x-2 px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                  item.isPublic
                    ? 'border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <ShareIcon className="h-4 w-4" />
                <span>{item.isPublic ? 'Make Private' : 'Share Publicly'}</span>
              </button>
              
              <Link
                to={`/item/${item._id}/edit`}
                className="inline-flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <EditIcon className="h-4 w-4" />
                <span>Edit</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6">
            {/* URL for links */}
            {item.type === 'link' && item.url && (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border">
                <div className="flex items-center space-x-2">
                  <LinkIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">URL:</span>
                </div>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 break-all transition-colors"
                >
                  {item.url}
                </a>
              </div>
            )}

            {/* Main Content */}
            <div 
              className="prose prose-lg max-w-none dark:prose-invert prose-indigo"
              dangerouslySetInnerHTML={{ __html: item.content }}
            />

            {/* Tags */}
            {item.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-3">
                  <TagIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share Link */}
            {item.isPublic && item.shareId && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                      Public Share Link
                    </h3>
                    <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                      Anyone with this link can view this item
                    </p>
                  </div>
                  <button
                    onClick={copyShareLink}
                    className="inline-flex items-center space-x-2 px-3 py-2 border border-green-300 dark:border-green-600 rounded-lg text-sm font-medium text-green-700 dark:text-green-300 bg-white dark:bg-green-800 hover:bg-green-50 dark:hover:bg-green-700 transition-colors"
                  >
                    <CopyIcon className="h-4 w-4" />
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ViewItem;