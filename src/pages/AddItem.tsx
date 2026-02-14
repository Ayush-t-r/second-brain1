import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { itemsApi } from '../services/api';
import Layout from '../components/Layout/Layout';
import { FileTextIcon, LinkIcon, TagIcon, SaveIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AddItem: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState<'note' | 'link'>('note');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }

    if (type === 'link' && !url.trim()) {
      toast.error('URL is required for links');
      return;
    }

    try {
      setLoading(true);
      
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await itemsApi.createItem({
        userId: user._id,
        type,
        title: title.trim(),
        content: content.trim(),
        url: type === 'link' ? url.trim() : undefined,
        tags: tagsArray,
        isPublic: false
      });

      toast.success(`${type === 'note' ? 'Note' : 'Link'} created successfully!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'blockquote', 'code-block', 'link'
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Item
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create a new note or save a link to your Second Brain
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Type Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Item Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setType('note')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    type === 'note'
                      ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <FileTextIcon className="h-5 w-5" />
                  <span>Note</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('link')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    type === 'link'
                      ? 'bg-green-50 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300'
                      : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  <LinkIcon className="h-5 w-5" />
                  <span>Link</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                placeholder={`Enter ${type} title...`}
                required
              />
            </div>

            {/* URL (for links only) */}
            {type === 'link' && (
              <div className="space-y-2">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  URL *
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                  placeholder="https://example.com"
                  required
                />
              </div>
            )}

            {/* Content */}
            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Content *
              </label>
              <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder={`Write your ${type} content here...`}
                  className="dark:text-white"
                  style={{
                    backgroundColor: 'inherit',
                  }}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label htmlFor="tags" className="flex items-center space-x-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                <TagIcon className="h-4 w-4" />
                <span>Tags</span>
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-colors"
                placeholder="Enter tags separated by commas (e.g. work, important, todo)"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Tags help you organize and find your items later
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <SaveIcon className="h-4 w-4" />
                )}
                <span>{loading ? 'Creating...' : `Create ${type === 'note' ? 'Note' : 'Link'}`}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddItem;