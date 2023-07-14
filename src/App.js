import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import Modal from './Modal';

const EMBEDS_DATA_KEY = 'embedsData';

const App = () => {
  const initialEmbedsData = localStorage.getItem(EMBEDS_DATA_KEY);
  const embedsData = initialEmbedsData ? JSON.parse(initialEmbedsData) : getDefaultEmbedsData();

  const [embeds, setEmbeds] = useState(embedsData);
  const [customEmbeds, setCustomEmbeds] = useState([]);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [showSecondMenu, setShowSecondMenu] = useState(false); // Define the state variable for the second menu

  const toggleEmbed = useCallback((embedId) => {
    setEmbeds((prevEmbeds) =>
      prevEmbeds.map((embed) => ({
        ...embed,
        active: embed.id === embedId,
      }))
    );
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

  const deleteCustomEmbeds = () => {
    setCustomEmbeds([]);
    setEmbeds((prevEmbeds) => prevEmbeds.filter((embed) => !embed.id.startsWith('custom-')));
    localStorage.removeItem(EMBEDS_DATA_KEY);
  };

  useEffect(() => {
    const storedEmbedsData = localStorage.getItem(EMBEDS_DATA_KEY);
    const storedEmbeds = storedEmbedsData ? JSON.parse(storedEmbedsData) : embedsData;
    setEmbeds(storedEmbeds);

    window.addEventListener('beforeunload', handlePageUnload);

    return () => {
      window.removeEventListener('beforeunload', handlePageUnload);
    };
  }, []);

  const handlePageUnload = () => {
    setEmbeds((prevEmbeds) =>
      prevEmbeds.map((embed) => ({
        ...embed,
        active: false,
      }))
    );
    setButtonClicked(false);
  };

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleSaveClick = () => {
    if (url && title) {
      addCustomEmbed(url, title);
      setShowModal(false);
      setUrl('');
      setTitle('');
    }
  };

  const handleDeleteAllClick = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete all custom embeds?');
    if (confirmDelete) {
      deleteCustomEmbeds();
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col justify-center items-center">
      {!buttonClicked && (
        <div>
          <div style={{ position: 'fixed', left: '7%', top: '17%' }}>
            <h1 className="text-4xl font-bold mt-4 mb-4">NostrNet.work</h1>
            <h2 className="text-l font-bold mr-8 mb-4">Dashboard For Micro-App & use any website as PWA.</h2>
          </div>
          <div style={{ position: 'fixed', left: '85%', bottom: '0' }}>
            <button className="px-4 py-2 text-sm rounded font-bold text-white" onClick={handleDeleteAllClick}>
              Reset
            </button>
          </div>
        </div>
      )}

      {!embeds.some((embed) => embed.active) && !showSecondMenu ? ( // Hide the second grid menu conditionally
        <nav className="flex justify-center mb-0">
          <div className="grid grid-cols-3 gap-4 mt-2">
            {embeds.map((embed) => (
              <button
                key={embed.id}
                className={`menu-item px-2 py-2 font-bold text-1xl rounded ${
                  embed.active ? 'bg-gray-600 text-xxs hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => toggleEmbed(embed.id)}
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
          <a href="https://nostrnet.work" rel="noopener noreferrer">
              <button className="px-4 py-1 text-sm mr-2 rounded bg-gray-800 font-bold text-white ">
                Home
              </button>
            </a>
          {showSecondMenu ? (
            <button
              className="px-4 py-1 text-sm rounded mr-2 bg-gray-800 font-bold text-white "
              onClick={() => setShowSecondMenu(false)}
            >
              Hide Menu
            </button>
            
            
          ) : (
            <button
              className="px-4 py-1 text-sm mr-2 rounded bg-gray-800 font-bold text-white "
              onClick={() => setShowSecondMenu(true)}
            >
              Show Menu
            </button>
          )}
        </div>
      )}

      {showSecondMenu && ( // Render the second grid menu when showSecondMenu is true
        <nav className="flex justify-center mb-0">
          <div className="grid grid-cols-3 gap-4 mt-2">
            {embeds.map((embed) => (
              <button
                key={embed.id}
                className={`menu-item px-2 py-2 font-bold text-sm rounded ${
                  embed.active ? 'bg-blue-600 text-sm hover:bg-blue-700' : 'bg-gray-800 hover:bg-blue-700'
                }`}
                onClick={() => toggleEmbed(embed.id)}
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
        {embeds.map((embed) => (
          <div key={embed.id} className={`embed-container ${embed.active ? 'active' : ''}`}>
            {embed.active && (
              <iframe src={embed.url} frameBorder="0" scrolling="yes" className="embed-iframe" title={embed.title} />
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

const getDefaultEmbedsData = () => {
  return [{
    id: 'nostrchat-embed',
    url: 'https://snort.social/notes',
    title: 'Snort',
    active: false,
  },
    { id: 'zaplife-embed', url: 'https://zaplife.lol/', title: 'Zaplife', active: false },
    { id: 'nostrnests-embed', url: 'https://highlighter.com/global/newest', title: 'Highlighter', active: false },
    
  ];
};


App.propTypes = {
  // PropTypes definition here
};

const EmbedButton = ({ embed, active, buttonClicked, toggleEmbed }) => {
  // EmbedButton component code here
};

EmbedButton.propTypes = {
  // PropTypes definition here
};

const EmbedContainer = ({ embed }) => {
  // EmbedContainer component code here
};

EmbedContainer.propTypes = {
  // PropTypes definition here
};

export default App;
