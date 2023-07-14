import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const Modal = ({ url, title, setUrl, setTitle, handleSaveClick, handleClose }) => {
  const inputRef = useRef(null);
  const [urlWarning, setUrlWarning] = useState('');

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);

    if (!value.startsWith('http')) {
      setUrlWarning('URL must start with "http:// or https://"');
    } else {
      setUrlWarning('');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-gray-700 rounded shadow-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Add Custom Embed</h2>
        <input
          type="url"
          className="w-full py-2 px-4 text-gray-500 rounded border border-gray-300 mb-4"
          placeholder="https://"
          value={url}
          onChange={handleUrlChange}
          ref={inputRef}
        />
        {urlWarning && <p className="text-red-500 mb-2">{urlWarning}</p>}
        <input
          type="text"
          className="w-full py-2 px-4 text-gray-500 rounded border border-gray-300 mb-4"
          placeholder="Website Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            className="py-2 px-4 font-bold bg-blue-500 text-white rounded mr-2"
            onClick={handleSaveClick}
            disabled={!url.startsWith('http')}
          >
            Save
          </button>
          <button className="py-2 px-4 font-bold bg-gray-500 text-gray-100 rounded" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  setUrl: PropTypes.func.isRequired,
  setTitle: PropTypes.func.isRequired,
  handleSaveClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default Modal;
