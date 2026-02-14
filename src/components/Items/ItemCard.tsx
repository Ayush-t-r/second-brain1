import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../../types';
import { 
  FileTextIcon, 
  LinkIcon, 
  ShareIcon, 
  EditIcon, 
  TrashIcon,
  ExternalLinkIcon,
  ClockIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ItemCardProps {
  item: Item;
  onDelete: (id: string) => void;
  onToggleShare: (id: string) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onDelete, onToggleShare }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPreviewContent = (content: string) => {
    // Strip HTML tags for preview
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > 120 ? textContent.substring(0, 120) + '...' : textContent;
  };

  const copyShareLink = () => {
    if (item.shareId) {
      const shareUrl = `${window.location.origin}/share/${item.shareId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    }
  };

  const openExternalLink = () => {
    if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden group">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className={`p-2 rounded-lg ${
              item.type === 'note' 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
            }`}>
              {item.type === 'note' ? (
                <FileTextIcon className="h-5 w-5" />
              ) : (
                <LinkIcon className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <Link 
                to={`/item/${item._id}`}
                className="block text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
              >
                {item.title}
              </Link>
              <div className="flex items-center space-x-2 mt-1">
                <ClockIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(item.createdAt)}
                </span>
                {item.isPublic && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    Public
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {item.type === 'link' && item.url && (
              <button
                onClick={openExternalLink}
                className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Open link"
              >
                <ExternalLinkIcon className="h-4 w-4" />
              </button>
            )}
            
            <Link
              to={`/item/${item._id}/edit`}
              className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Edit"
            >
              <EditIcon className="h-4 w-4" />
            </Link>
            
            <button
              onClick={() => onToggleShare(item._id)}
              className={`p-2 rounded-lg transition-colors ${
                item.isPublic
                  ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
                  : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'
              } hover:bg-gray-100 dark:hover:bg-gray-700`}
              title={item.isPublic ? 'Make private' : 'Share publicly'}
            >
              <ShareIcon className="h-4 w-4" />
            </button>
            
            <button
              onClick={() => onDelete(item._id)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Delete"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
          {getPreviewContent(item.content)}
        </p>

        {/* URL for links */}
        {item.type === 'link' && item.url && (
          <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded border">
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 break-all transition-colors"
            >
              {item.url}
            </a>
          </div>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Share Link */}
        {item.isPublic && item.shareId && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={copyShareLink}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            >
              Copy share link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;