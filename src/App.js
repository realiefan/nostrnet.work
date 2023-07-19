import React, { useState, useEffect, useCallback, useMemo } from 'react';

import './App.css';
import Modal from './Modal';

const EMBEDS_DATA_KEY = 'embedsData';

const App = () => {
  const [embeds, setEmbeds] = useState(getEmbedsData().map((embed) => ({ ...embed, loading: false })));
  const [, setCustomEmbeds] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [showSecondMenu, setShowSecondMenu] = useState(false);
  const [activeEmbedId, setActiveEmbedId] = useState(null);

  const toggleEmbed = useCallback((embedId) => {
    setEmbeds((prevEmbeds) =>
      prevEmbeds.map((embed) => ({
        ...embed,
        active: embed.id === embedId,
        loading: embed.id === embedId ? true : embed.loading,
      }))
    );
    setActiveEmbedId(embedId);
    setButtonClicked(true);
  }, []);

  const addCustomEmbed = useCallback((url, title) => {
    const newEmbed = {
      id: `custom-${Date.now()}`,
      url,
      title,
      active: false,
    };

    setEmbeds((prevEmbeds) => {
      const updatedEmbeds = [...prevEmbeds, newEmbed];
      localStorage.setItem(EMBEDS_DATA_KEY, JSON.stringify(updatedEmbeds));
      return updatedEmbeds;
    });

    setCustomEmbeds((prevCustomEmbeds) => [...prevCustomEmbeds, newEmbed]);
  }, []);

  const deleteCustomEmbeds = useCallback(() => {
    setCustomEmbeds([]);
    setEmbeds((prevEmbeds) => prevEmbeds.filter((embed) => !embed.id.startsWith('custom-')));
    localStorage.removeItem(EMBEDS_DATA_KEY);
  }, []);

  useEffect(() => {
    const storedEmbedsData = localStorage.getItem(EMBEDS_DATA_KEY);
    const storedEmbeds = storedEmbedsData ? JSON.parse(storedEmbedsData) : getEmbedsData();
    setEmbeds(storedEmbeds.map((embed) => ({ ...embed, loading: false })));
  }, []);

  const handleAddClick = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleSaveClick = useCallback(() => {
    if (url && title) {
      addCustomEmbed(url, title);
      setShowModal(false);
      setUrl('');
      setTitle('');
    }
  }, [url, title, addCustomEmbed]);

  const handleDeleteAllClick = useCallback(() => {
    const confirmDelete = window.confirm('Are you sure you want to delete all custom embeds?');
    if (confirmDelete) {
      deleteCustomEmbeds();
    }
  }, [deleteCustomEmbeds]);

  const handleHomeButtonClick = useCallback(() => {
    setActiveEmbedId(null);
    setButtonClicked(false);
  }, []);

  const memoizedEmbeds = useMemo(() => {
    return embeds.map((embed) => ({
      ...embed,
      handleClick: () => toggleEmbed(embed.id),
    }));
  }, [embeds, toggleEmbed]);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col justify-start items-center w-screen">
      {!buttonClicked && (
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <div>
            <h1 className="text-3xl font-bold mt-4 px-5 mb-2">NostrNet.work</h1>
            <h2 className="text-sm font-bold mb-4 px-5">One PWA to organize all Nostr WebApps and other PWAs & use any website as a Native App. (Mobile only)</h2>
          </div>
          <div style={{ position: 'fixed', right: '5%', bottom: '0' }}>
            <button className="px-4 py-2 text-sm rounded font-bold text-white" onClick={handleDeleteAllClick}>
              Reset
            </button>
          </div>
        </div>
      )}
      {!embeds.some((embed) => embed.active) && !showSecondMenu ? (
        <nav className="flex justify-center mb-0">
          <div className="grid grid-cols-3 gap-4 mt-2 mx-auto max-w-2xl md:max-w-4xl md:grid-cols-5 lg:grid-cols-8">
            {memoizedEmbeds.map((embed) => (
              <button
                key={embed.id}
                className={`menu-item px-2 py-2 font-bold text-sm rounded ${
                  embed.active ? 'bg-gray-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={embed.handleClick}
                aria-label={`${embed.active ? 'Hide' : 'Show'} ${embed.title}`}
              >
                <span className="embed-title">{embed.title}</span>
              </button>
            ))}
            {!embeds.some((embed) => embed.active) && (
              <button
                className={`px-4 py-2 text-sm rounded bg-purple-600 font-bold text-white ${
                  buttonClicked ? 'text-sm' : ''
                }`}
                onClick={handleAddClick}
              >
                Add
              </button>
            )}
          </div>
        </nav>
      ) : (
        <div className="pt-1 mb-0">
          <a rel="noopener noreferrer">
            <button
              className="px-4 py-1 text-sm mr-2 rounded bg-gray-900 font-bold text-gray-200"
              onClick={handleHomeButtonClick}
            >
              Home
            </button>
          </a>
          {showSecondMenu ? (
            <button
              className="px-4 py-1 text-sm rounded mr-2 bg-purple-900 font-bold text-gray-200 "
              onClick={() => setShowSecondMenu(false)}
            >
              Hide Menu
            </button>
          ) : (
            <button
              className="px-4 py-1 text-sm mr-2 rounded bg-gray-900 font-bold text-gray-200 "
              onClick={() => setShowSecondMenu(true)}
            >
              Show Menu
            </button>
          )}
        </div>
      )}
      {showSecondMenu && (
        <nav className="flex justify-center mb-0">
          <div className="grid grid-cols-3 gap-4 mt-2">
            {memoizedEmbeds.map((embed) => (
              <button
                key={embed.id}
                className={`menu-item px-2 py-2 font-bold text-sm rounded ${
                  embed.active ? 'bg-blue-600 text-sm hover:bg-blue-700' : 'bg-gray-800 hover:bg-blue-700'
                }`}
                onClick={embed.handleClick}
                aria-label={`${embed.active ? 'Hide' : 'Show'} ${embed.title}`}
              >
                <span className="embed-title">{embed.title}</span>
              </button>
            ))}
            {!embeds.some((embed) => embed.active) && (
              <button
                className={`px-4 py-2 text-sm rounded bg-purple-600 font-bold text-white ${
                  buttonClicked ? 'text-sm' : ''
                }`}
                onClick={handleAddClick}
              >
                Add
              </button>
            )}
          </div>
        </nav>
      )}
      <div className="flex flex-col items-center mt-2">
        {memoizedEmbeds.map((embed) => (
          <div key={embed.id} className={`embed-container ${embed.active ? 'active' : ''}`}>
            {embed.loading && (
              <div className="embed-loading">
                {/* Add loading spinner or placeholder here */}
              </div>
            )}
            {embed.active && activeEmbedId === embed.id && (
              <iframe
                src={embed.url}
                frameBorder="0"
                scrolling="yes"
                className="embed-iframe"
                title={embed.title}
                onLoad={() => {
                  setEmbeds((prevEmbeds) =>
                    prevEmbeds.map((prevEmbed) =>
                      prevEmbed.id === embed.id ? { ...prevEmbed, loading: false } : prevEmbed
                    )
                  );
                }}
              />
            )}
          </div>
        ))}
      </div>
      {showModal && (
        <Modal
          url={url}
          title={title}
          setUrl={setUrl}
          setTitle={setTitle}
          handleSaveClick={handleSaveClick}
          handleClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

const getEmbedsData = () => {
  const initialEmbedsData = localStorage.getItem(EMBEDS_DATA_KEY);
  return initialEmbedsData ? JSON.parse(initialEmbedsData) : getDefaultEmbedsData();
};

const getDefaultEmbedsData = () => {
  return [
    {
      id: 'nostrchat-embed',
      url: 'https://snort.social/notes',
      title: 'Snort',
      active: false,
    },
    {
      id: 'zaplife-embed',
      url: 'https://zaplife.lol/',
      title: 'Zaplife',
      active: false,
    },
    {
      id: 'nostrnests-embed',
      url: 'https://highlighter.com/global/newest',
      title: 'Highlighter',
      active: false,
    },
  ];
};

export default App;
