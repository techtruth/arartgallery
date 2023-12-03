import React, { useState } from 'react';
import { setGalleryMindFile, getGalleryEntries } from "../database/gallery";
import { addGalleryEntry, updateGalleryEntry, removeGalleryEntry } from "../database/galleryEntry";
//import { addGalleryEntryAttribute, removeGalleryEntryAttribute} from "../database/galleryEntryAttribute";
import { Compiler } from 'mind-ar/dist/mindar-image.prod.js'
import * as base64 from 'base64-js';

//Show images in a gallery, and allow editing of the attributes.
// Also provide a button to generate the AR.js mind files
export default class editGallery extends React.Component {
  constructor() {
    super();

    this.state = {
      galleryName: "Demo",
      entries: new Array(),
      mindAR: undefined,
      newEntry: {
        name: "New Name",
        gallery: "",
        artist: "Artist Name",
        appraisal: "0.00",
        imageData: ""
      }
    }
  }

  handleNameChange = (index, newName) => {
    const updatedEntries = [...this.state.entries];
    updatedEntries[index].name = newName;
    this.setState({ entries: updatedEntries });
  };

  handleArtistChange = (index, newArtist) => {
    const updatedEntries = [...this.state.entries];
    updatedEntries[index].artist = newArtist;
    this.setState({ entries: updatedEntries });
  };

  handleAppraisalChange = (index, newAppraisal) => {
    const updatedEntries = [...this.state.entries];
    updatedEntries[index].appraisal = newAppraisal;
    this.setState({ entries: updatedEntries });
  };
  handleImageChange = (index, newImage) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageData = event.target.result;
      const updatedEntries = [...this.state.entries];
      updatedEntries[index].imageData = imageData;
      this.setState({ entries: updatedEntries });
      console.log("LOL WHAT", index, updatedEntries[index], imageData);
    };

    reader.readAsDataURL(event.target.files[0]);
  };



  //Process the values changed for the new entry
  handleNewEntryChange = (field, event) => {
    if(event.target.files) {
    // Use FileReader to read the file and handle it appropriately
    const reader = new FileReader();

    reader.onload = (event) => {
      const imageData = event.target.result;
      this.setState((prevState) => ({
      newEntry: {
        ...prevState.newEntry,
        [field]: imageData,
      },
      }));
    };

    reader.readAsDataURL(event.target.files[0]);
    } else {

    this.setState((prevState) => ({
      newEntry: {
        ...prevState.newEntry,
        [field]: event.target.value,
      },
    }));
    }
  };

  addEntry = () => {
    // Here you can save the updated entries to your backend or perform any other necessary actions.
    addGalleryEntry(this.state.galleryName,
                    this.state.newEntry.name,
                    this.state.newEntry.artist,
                    this.state.newEntry.appraisal,
                    this.state.newEntry.imageData);
    console.log("Adding entry:", );
  };

  saveEntry = (index) => {
    // Here you can save the updated entries to your backend or perform any other necessary actions.
    const entryData = this.state.entries[index];
    updateGalleryEntry(entryData.id, entryData.name, entryData.artist, entryData.appraisal, entryData.imageData);
    console.log("Saving entries:", this.state.entries[index], this.state);
  };

  deleteEntry = (index) => {
    const updatedEntries = this.state.entries.filter((_, i) => i !== index);
    this.setState({ entries: updatedEntries });
  };


  generateMindARFile = async () => {
      const compiler = new Compiler();

      const loadImage = async (file) => {
        const img = new Image();

        return new Promise((resolve, reject) => {
          let img = new Image()
          img.crossOrigin = "Anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = file;
        })
      }

      const images = [];
      for (let i = 0; i < this.state.entries.length; i++) {
        images.push(await loadImage(this.state.entries[i].imageData));
      }
      const dataList = await compiler.compileImageTargets(images, (progress) => {
        console.log("Progress: ", progress.toFixed(2));
      });
      const exportedBuffer = await compiler.exportData();
      if(!exportedBuffer) {
        alert("Failed to generate MindAR file... Try again!");
        console.log("Failed to generate MindAR file... Try again!");
      } else {
        const b64 = base64.fromByteArray(exportedBuffer);
        console.log("Successfully generated MindAR file", b64);
        this.setState({ mindAR: b64 });
        setGalleryMindFile(this.state.galleryName, b64);
      }
  };

  async componentDidMount() {
    let entries = await getGalleryEntries(this.state.galleryName)
    this.setState({ entries });
  }

  Gallery = (props) => {
      const { entries } = props;
      return <div className="editGallery">
               <button onClick={() => this.generateMindARFile()}>Generate Augmented Files</button>
               <div className="galleryEntries">
                 { entries.map( (entry, index) => (
                   <div key={ index } className="galleryEntry">
                     <img src={ entry.imageData } />
                     <div className="overlay">
                       <div className="text">
                         <span>Name: <input value={ entry.name } 
                                            onChange={(e) => this.handleNameChange(index, e.target.value)} /></span>
                         <span>Artist: <input value={ entry.artist } 
                                            onChange={(e) => this.handleArtistChange(index, e.target.value)} /></span>
                         <span>Appraisal: <input value={ entry.appraisal } 
                                            onChange={(e) => this.handleAppraisalChange(index, e.target.value)} /></span>
                         <span>Image: <input type="file" 
                                            onChange={(e) => this.handleImageChange(index, e)} /></span>
                       </div>
                       <div className="buttons">
                         <button onClick={() => this.saveEntry(index)} >Save</button>
                         <button onClick={() => this.deleteEntry(index)} >Delete</button>
                       </div>
                     </div>
                   </div>
                 ) ) }
        <div className="galleryEntry">
          <img src={this.state.newEntry.imageData}/>
                     <div className="overlay">
                       <div className="text">
          <span>Name: <input value={this.state.newEntry.name} onChange={(e) => this.handleNewEntryChange("name", e)} /></span>
          <span>Artist: <input value={this.state.newEntry.artist} onChange={(e) => this.handleNewEntryChange("artist", e)} /></span>
          <span>Appraisal: <input value={this.state.newEntry.appraisal} onChange={(e) => this.handleNewEntryChange("appraisal", e)} /></span>
          <span>Image: <input type="file" onChange={(e) => this.handleNewEntryChange("imageData", e)} /></span>
          </div>
                       <div className="buttons">
          <button onClick={this.addEntry}>New</button>
                       </div>
                     </div>
        </div>
               </div>
             </div>
  }

  render() {
    const { galleryName, entries } = this.state;
    if (entries.length) {
      return <div> 
             <h2>Edit { galleryName } Gallery Page</h2>
             <this.Gallery entries={entries}/>
             </div>
    } else {
      return <div><h2>No Entries in { galleryName } this gallery!</h2></div>
    }

  }
}
