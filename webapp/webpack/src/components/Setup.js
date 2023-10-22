import React from 'react';
import { addGallery, removeGallery} from "../database/gallery";
import { addGalleryEntry, removeGalleryEntry, testUpload, testDownload} from "../database/galleryEntry";
//import { addGalleryEntryAttribute, removeGalleryEntryAttribute} from "../database/galleryEntryAttribute";

import testImage1 from "../../stage/pinball.jpg";
import testImage2 from "../../stage/hiro.png";

//Initialize the ARArtGallery with a demo gallery
export default class setup extends React.Component {
  constructor() {
    super();
  }

  setupDemoGallery() {
    addGallery("Demo", "Frank's Clothing Store", "123 Washington Way", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII");
    addGalleryEntry("Demo", "Demo Artwork #1", "Demo Artist Paul", "10.00", testImage1);
    addGalleryEntry("Demo", "Demo Artwork #2", "Demo Artist Paul ", "100.00", testImage2);
    addGalleryEntry("Demo", "Demo Artwork #3", "Demo Artist Mark", "55.00", testImage1);
    addGalleryEntry("Demo", "Demo Artwork #4", "Demo Artist Jenny", "99.50", testImage2);
    addGalleryEntry("Demo", "Demo Artwork #5", "Demo Artist Alice", "1.00", testImage1);
  }
 
  dummy() {
    addGalleryEntry("Demo", "Test Artwork", "Test Artist Zach", "550.00", testImage1);
  }

  dismantleDemoGallery() {
    removeGalleryEntry("Demo", "Demo Artwork #1");
    removeGalleryEntry("Demo", "Demo Artwork #2");
    removeGalleryEntry("Demo", "Demo Artwork #3");
    removeGalleryEntry("Demo", "Demo Artwork #4");
    removeGalleryEntry("Demo", "Demo Artwork #5");
    removeGallery("Demo");
  }

  render() {
    return <div> 
           <h2>Setup Page</h2>
           <button
             type="button"
             onClick={this.setupDemoGallery}
            >Setup Demo Gallery</button>
           <button
             type="button"
             onClick={this.dismantleDemoGallery}
            >Dismantle Demo Gallery</button>
           <button
             type="button"
             onClick={this.dummy}
            >Dummy</button>
           </div>
  }
}
