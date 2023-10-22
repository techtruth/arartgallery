import React from 'react';
import { addGallery } from "../database/gallery";                                     

//Show images in a gallery, and allow editing of the attributes.
// Also provide a button to generate the AR.js mind files
export default class newGallery extends React.Component {
  constructor() {
    super();

    this.state = {
      name: undefined,
      location: undefined,
      address: undefined,
      imageData: undefined
    }
  }

  handleNameChange = (newName) => {
    this.setState({ name: newName });
  };

  handleLocationChange = (newLocation) => {
    this.setState({ location: newLocation });
  };

  handleAddressChange = (newAddress) => {
    this.setState({ address: newAddress });
  };

  handleImageChange = (newImage) => {
    const reader = new FileReader()
    reader.onload = async (e) => { 
      const imageData = (e.target.result)
      this.setState({ imageData: imageData });
    };
    reader.readAsDataURL(newImage)
  };

  saveEntry = () => {
    // Here you can save the updated entries to your backend or perform any other necessary actions.
    console.log("Saving gallery:", this.state);
    addGallery(this.state.name, this.state.location, this.state.address, this.state.imageData);
  };

  NewGallery = (props) => {
      const { entries } = props;
      return <div className="newGallery">
                   <div className="galleryEntry">
                     <img src="" />
                     <div className="text">
                       <span>Name: <input type="text" onChange={(e) => this.handleNameChange(e.target.value)} /></span>
                       <span>Location: <input type="text" onChange={(e) => this.handleLocationChange(e.target.value)} /></span>
                       <span>Address: <input type="text" onChange={(e) => this.handleAddressChange(e.target.value)} /></span>
                       <span>Image: <input type="file" onChange={(e) => this.handleImageChange(e.target.files[0])} /></span>
                     </div>
                     <div className="buttons">
                       <button disabled={!this.state.name ||
                                         !this.state.location ||
                                         !this.state.address ||
                                         !this.state.imageData }
                               onClick={() => this.saveEntry()} >Save</button>
                     </div>
                   </div>
             </div>
  }

  render() {
      return (<div> 
             <h2>Create New Gallery Page</h2>
             <this.NewGallery/>
             </div>)
  }
}
