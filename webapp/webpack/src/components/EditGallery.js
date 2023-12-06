import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { setGalleryMindFile, getGalleryEntries } from "../database/gallery";
import { addGalleryEntry, updateGalleryEntry, removeGalleryEntry } from "../database/galleryEntry";
import { Compiler } from 'mind-ar/dist/mindar-image.prod.js';
import * as base64 from 'base64-js';

const EditGallery = () => {
  const { galleryId } = useParams();

  const [galleryName, setGalleryName] = useState(undefined);
  const [entries, setEntries] = useState([]);
  const [mindAR, setMindAR] = useState(undefined);
  const [newEntry, setNewEntry] = useState({
    name: "New Name",
    gallery: "",
    artist: "Artist Name",
    appraisal: "0.00",
    imageData: ""
  });

  const handleNameChange = (index, newName) => {
    setEntries(prevEntries => {
      const updatedEntries = [...prevEntries];
      updatedEntries[index].name = newName;
      return updatedEntries;
    });
  };

  const handleArtistChange = (index, newArtist) => {
    setEntries(prevEntries => {
      const updatedEntries = [...prevEntries];
      updatedEntries[index].artist = newArtist;
      return updatedEntries;
    });
  };

  const handleAppraisalChange = (index, newAppraisal) => {
    setEntries(prevEntries => {
      const updatedEntries = [...prevEntries];
      updatedEntries[index].appraisal = newAppraisal;
      return updatedEntries;
    });
  };

  const handleImageChange = (index, newImage) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageData = event.target.result;
      setEntries(prevEntries => {
        const updatedEntries = [...prevEntries];
        updatedEntries[index].imageData = imageData;
        return updatedEntries;
      });
    };

    reader.readAsDataURL(newImage);
  };

  const handleNewEntryChange = (field, event) => {
    if (event.target.files) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const imageData = event.target.result;
        setNewEntry(prevNewEntry => ({
          ...prevNewEntry,
          [field]: imageData,
        }));
      };

      reader.readAsDataURL(event.target.files[0]);
    } else {
      setNewEntry(prevNewEntry => ({
        ...prevNewEntry,
        [field]: event.target.value,
      }));
    }
  };

  const addEntry = () => {
    addGalleryEntry(galleryId, newEntry.name, newEntry.artist, newEntry.appraisal, newEntry.imageData);
    console.log("Adding entry:", newEntry);
  };

  const saveEntry = (index) => {
    const entryData = entries[index];
    updateGalleryEntry(entryData.id, entryData.name, entryData.artist, entryData.appraisal, entryData.imageData);
    console.log("Saving entries:", entries[index], entries);
  };

  const deleteEntry = (index) => {
    const updatedEntries = entries.filter((_, i) => i !== index);
    setEntries(updatedEntries);
  };

  const generateMindARFile = async () => {
    const compiler = new Compiler();

    const loadImage = async (file) => {
      const img = new Image();
      return new Promise((resolve, reject) => {
        img.crossOrigin = "Anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = file;
      });
    };

    const images = [];
    for (let i = 0; i < entries.length; i++) {
      images.push(await loadImage(entries[i].imageData));
    }

    const dataList = await compiler.compileImageTargets(images, (progress) => {
      console.log("Progress: ", progress.toFixed(2));
    });

    const exportedBuffer = await compiler.exportData();
    if (!exportedBuffer) {
      alert("Failed to generate MindAR file... Try again!");
      console.log("Failed to generate MindAR file... Try again!");
    } else {
      const b64 = base64.fromByteArray(exportedBuffer);
      console.log("Successfully generated MindAR file", b64.length);
      setMindAR(b64);
      setGalleryMindFile(galleryId, b64);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let entriesData = await getGalleryEntries(galleryId);
        if (entriesData) {
          setEntries(entriesData);
        }
      } catch (error) {
        // Handle error if necessary
        console.error("Error fetching gallery entries:", error);
      }
    };

    fetchData();
  }, [galleryId]);

  return (
    <div className="editGallery">
      <button onClick={() => generateMindARFile()}>Generate Augmented Files</button>
      <div className="galleryEntries">
        {entries.map((entry, index) => (
          <div key={index} className="galleryEntry">
            <img src={entry.imageData} alt={`Gallery Entry ${index}`} />
            <div className="overlay">
              <div className="text">
                <span>Name: <input value={entry.name} onChange={(e) => handleNameChange(index, e.target.value)} /></span>
                <span>Artist: <input value={entry.artist} onChange={(e) => handleArtistChange(index, e.target.value)} /></span>
                <span>Appraisal: <input value={entry.appraisal} onChange={(e) => handleAppraisalChange(index, e.target.value)} /></span>
                <span>Image: <input type="file" onChange={(e) => handleImageChange(index, e.target.files[0])} /></span>
              </div>
              <div className="buttons">
                <button onClick={() => saveEntry(index)}>Save</button>
                <button onClick={() => deleteEntry(index)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
        <div className="galleryEntry">
          <img src={newEntry.imageData || "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"} alt="New Gallery Entry" />
          <div className="overlay">
            <div className="text">
              <span>Name: <input value={newEntry.name} onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })} /></span>
              <span>Artist: <input value={newEntry.artist} onChange={(e) => setNewEntry({ ...newEntry, artist: e.target.value })} /></span>
              <span>Appraisal: <input value={newEntry.appraisal} onChange={(e) => setNewEntry({ ...newEntry, appraisal: e.target.value })} /></span>
              <span>Image: <input type="file" onChange={(e) => handleNewEntryChange("imageData", e)} /></span>
            </div>
            <div className="buttons">
              <button onClick={addEntry}>New</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGallery;
