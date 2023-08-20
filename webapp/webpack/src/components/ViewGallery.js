import React, { useState, useEffect, useRef } from 'react';
import { getGalleryEntries } from "../database/gallery";
import 'aframe';
import 'mind-ar/dist/mindar-image-aframe.prod.js';

//Show images in a gallery, and allow editing of the attributes.
// Also provide a button to generate the AR.js mind files
export default class editGallery extends React.Component {
  constructor() {
    super();
    this.state = {
      galleryName: "Demo",
      galleryMind: "/some-url.mind",
      entries: new Array(),
    }
  }

  async componentDidMount() {
      const sceneEl = document.querySelector('a-scene');
      sceneEl.addEventListener('loaded', () => {
        const arSystem = sceneEl.systems['mindar-image-system'];
        sceneEl.addEventListener('renderstart', () => {
          //arSystem.start(); // start AR 
        });
        //let entries = await getGalleryEntries(this.state.galleryName)
        //this.setState({ entries });
      });
  }

  Gallery = (props) => {
      const { galleryMind, entries } = props;
      return
        <a-scene className="viewGallery"
                 mindar-image="imageTargetSrc: { galleryMind }; uiLoading: no;"
                 color-space="sRGB" 
                 renderer="colorManagement: true, physicallyCorrectLights" 
                 vr-mode-ui="enabled: false" 
                 device-orientation-permission-ui="enabled: false">

          <a-camera position="0 0 0" look-controls="enabled: false">

          </a-camera>

          { entries.map( (entry, index) => (
            <a-entity key={ index } mindar-image-target="targetIndex: 0">
              <a-entity position="0 -0.7 0" 
                        geometry="primitive: plane; width: 0.5; height: 0.25" 
                        material="color: gray">
                <a-entity text="value: { entry.name }; align: center;" 
                          position="0 0.05 0" />
                <a-entity text="value: by { entry.artist }; align: center;" 
                          position="0 0 0" />
                <a-entity text="value: valued at ${ entry.appraisal }; align: center;" 
                          position="0 -0.05 0" />
              </a-entity>
            </a-entity>
          ) ) }
        </a-scene>

  }

  render() {
      return (<a-scene class="viewGallery"
               mindar-image="imageTargetSrc: /ar.mind; autoStart: true; uiLoading: true; uiError: yes; uiScanning: yes;"
               color-space="sRGB"
               embedded renderer="colorManagement: true, physicallyCorrectLights"
               vr-mode-ui="enabled: false"
               device-orientation-permission-ui="enabled: false">
      <a-assets>
        <img id="card" src="/card.png" />
      </a-assets>

      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

      <a-entity mindar-image-target="targetIndex: 0">
        <a-plane src="#card" position="0 0 0" height="0.552" width="1" rotation="0 0 0"></a-plane>
      </a-entity>
    </a-scene>)
  }
}
