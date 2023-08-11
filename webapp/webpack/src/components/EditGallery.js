import React from 'react';
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

  async componentDidMount() {
    let entries = await getGalleryEntries(this.state.galleryName)
    this.setState({ entries });
  }

  Gallery(props) {
      return <div>
               { props.entries.map( (entry, index) => (
                 <ul key={ index }>
                   <li>Name: { entry.name }</li>
                   <li>Artist: { entry.artist }</li>
                   <li>Appraisal: { entry.appraisal }</li>
                   <li>Image: <img src={ entry.imageData }/></li>
                 </ul>    
               ) ) }
             </div> 
  }

  render() {
    const { galleryName, entries } = this.state;
    //console.log("RENDERING", this.state, galleryName, entries, entries.length);
    if (entries.length) {
      return <div> 
             <h2>Edit Gallery Page</h2>
             <this.Gallery entries={entries}/>
             </div>
    } else {
      return <div><h2>No Entries in this gallery!</h2></div>
    }

  }
}
