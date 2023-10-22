import React, { useState } from 'react';
import { getAllGalleries } from "../database/gallery";

//Show images in a gallery, and allow editing of the attributes.
// Also provide a button to generate the AR.js mind files
export default class listGallery extends React.Component {
  constructor() {
    super();

    this.state = {
      galleries: new Array()
    }
  }

  async componentDidMount() {
    let galleries = await getAllGalleries()
    this.setState({ galleries });
  }

  ListAllGalleries = (props) => {
      const { galleries } = props;
      return <div className="listGallery">
                 { galleries.map( (gallery, index) => (
                   <div key={ index } className="galleryEntry">
                     <img src={ gallery.imageData } />
                     <div className="overlay">
                       <div className="text">
                         <span>Name: { gallery.name } </span>
                         <span>Address: { gallery.locationAddress } </span>
                         <span>Location: { gallery.locationName } </span>
                       </div>
                     </div>
                   </div>
                 ) ) }
             </div>
  }

  render() {
    const { galleries } = this.state;
    if (galleries.length) {
      return (<this.ListAllGalleries galleries={galleries}/>)
    } else {
      return <div><h2>No Galleries! Have you run the setup page?</h2></div>
    }
  }
}
