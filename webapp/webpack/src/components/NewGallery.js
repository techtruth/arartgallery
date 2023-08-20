import React, { useState } from 'react';
import { getGalleryEntries } from "../database/gallery";
import { addGalleryEntry, removeGalleryEntry } from "../database/galleryEntry";
//import { addGalleryEntryAttribute, removeGalleryEntryAttribute} from "../database/galleryEntryAttribute";

//Show images in a gallery, and allow editing of the attributes.
// Also provide a button to generate the AR.js mind files
export default class editGallery extends React.Component {
  constructor() {
    super();

    this.state = {
      galleryName: "Demo",
      entries: new Array()
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

  saveEntry = (index) => {
    // Here you can save the updated entries to your backend or perform any other necessary actions.
    console.log("Saving entries:", this.state.entries[index]);
  };

  deleteEntry = (index) => {
    const updatedEntries = this.state.entries.filter((_, i) => i !== index);
    this.setState({ entries: updatedEntries });
    console.log("LOL EHAT", updatedEntries);
  };


  async componentDidMount() {
    let entries = await getGalleryEntries(this.state.galleryName)
    this.setState({ entries });
  }

  Gallery = (props) => {
      const { entries } = props;
      return <div className="gallery">
               <button>Generate Augmented Files</button>
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
                       </div>
                       <div className="buttons">
                         <button onClick={() => this.saveEntry(index)} >Save</button>
                         <button onClick={() => this.deleteEntry(index)} >Delete</button>
                       </div>
                     </div>
                   </div>
                 ) ) }
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
