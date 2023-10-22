import React, { Component } from 'react';
import { getGalleryEntries } from "../database/gallery";
import 'aframe';
import 'mind-ar/dist/mindar-image-aframe.prod.js';
import mindfile from "../../stage/targets.mind";

//Show images in a gallery, and allow editing of the attributes.
// Also provide a button to generate the AR.js mind files
export default class editGallery extends Component {
  constructor() {
    super();
    this.sceneRef = React.createRef();
    this.state = {
      galleryName: "Demo",
      galleryMind: mindfile,
      entries: new Array(),
    }
  }

  async componentDidMount() {
        const sceneEl = this.sceneRef.current;
        const arSystem = sceneEl.systems['mindar-image-system'];
        console.log(arSystem)
        sceneEl.addEventListener('renderstart', async () => {
          console.log("Starting AR!");
          arSystem.start(); // start AR
        });
        sceneEl.addEventListener('loaded', async () => {
          let entries = await getGalleryEntries(this.state.galleryName)
          console.log(entries);
          this.setState({ entries });
        });

  }

  componentWillUnmount() {
    const sceneEl = this.sceneRef.current;
    const arSystem = sceneEl.systems['mindar-image-system'];
    arSystem.stop();
  }

  Gallery = (props) => {
      const { galleryMind, entries } = props;
      console.log("MIND", mindfile);
      return (
          <div>
          {entries.map((entry, index) => (
            <a-entity key={entry.name} mindar-image-target={`targetIndex: ${index}`}>
              <a-entity position="0 -0.7 0" geometry="primitive: plane; width: 0.5; height: 0.25" material="color: gray">
                <a-entity text={`value: ${entry.name}; align: center;`} position="0 0.05 0" />
                <a-entity text={`value: by ${entry.artist}; align: center;`} position="0 0 0" />
                <a-entity text={`value: valued at $${entry.appraisal}; align: center;`} position="0 -0.05 0" />
              </a-entity>
            </a-entity>
          ))}
          </div>
      )
  }

  render() {
      return (

        <a-scene class="viewGallery"
               ref={this.sceneRef}
               mindar-image={"imageTargetSrc: " + this.state.galleryMind + "; autoStart: false; uiLoading: false; uiError: false; uiScanning: false;"}
               color-space="sRGB"
               embedded renderer="colorManagement: true, physicallyCorrectLights"
               vr-mode-ui="enabled: false"
               device-orientation-permission-ui="enabled: false">

          <a-camera position="0 0 0" look-controls="enabled: false">

          </a-camera>

          <this.Gallery entries={this.state.entries} />
          <a-entity key="6" mindar-image-target="targetIndex: 1" >
            <a-entity position="0 0 0"
                      geometry="primitive: plane; width: 0.5; height: 0.25"
                      material="color: gray">
              <a-entity text="value: 100; align: center;"
                        position="0 0.05 0" />
              <a-entity text="value: by Some Artist; align: center;"
                        position="0 0 0" />
              <a-entity text="value: valued at $500; align: center;"
                        position="0 -0.05 0" />
            </a-entity>
          </a-entity>
        </a-scene> )
  }
}
