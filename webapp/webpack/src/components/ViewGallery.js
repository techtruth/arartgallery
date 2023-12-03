import React, { useEffect, useRef, useState } from 'react';
import 'aframe';
import 'mind-ar/dist/mindar-image-aframe.prod.js';
import { getGalleryEntries } from '../database/gallery';
import mindfile from '../../stage/targets.mind';

const ViewGallery = () => {
  const sceneRef = useRef(null);
  const [galleryName] = useState('Demo');
  const [galleryMind] = useState(mindfile);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(!entries.length) {
        const loadedEntries = await getGalleryEntries(galleryName);
        setEntries(loadedEntries);
        console.log("FETCHED ENTRIES!");
        } else {
         console.log("ALREDY FETCHED");
        }
      } catch (error) {
        console.error('Error loading entries:', error);
      }
    };
     if(entries.length) {
      console.log("LOL WHTA?");
      const sceneEl = sceneRef.current;
      const arSystem = sceneEl.systems['mindar-image-system'];
      arSystem.start(); // start AR

     }
      fetchData();
      return () => {
      };
  }, [entries]);

  return (
    <div>
        <a-scene
          class="viewGallery"
          ref={sceneRef}
          mindar-image={`imageTargetSrc: ${galleryMind}; autoStart: false`}
          color-space="sRGB"
          embedded
          renderer="colorManagement: true, physicallyCorrectLights"
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"
        >
          <a-camera position="0 0 0" look-controls="enabled: false" />

          {entries.map((entry, index) => (
            <a-entity key={entry.name} mindar-image-target={`targetIndex: ${index}`}>
              <a-entity position="0 -0.7 0" geometry="primitive: plane; width: 0.5; height: 0.25">
                <a-entity text={`value: ${entry.name}; align: center;`} position="0 0.05 0" />
                <a-entity text={`value: by ${entry.artist}; align: center;`} position="0 0 0" />
                <a-entity text={`value: valued at $${entry.appraisal}; align: center;`} position="0 -0.05 0" />
              </a-entity>
            </a-entity>
          ))}

          <a-entity key="6" mindar-image-target2="targetIndex: 1">
            <a-entity position="0 0 0" geometry="primitive: plane; width: 0.5; height: 0.25" material="color: gray">
              <a-entity text="value: 100; align: center;" position="0 0.05 0" />
              <a-entity text="value: by Some Artist; align: center;" position="0 0 0" />
              <a-entity text="value: valued at $500; align: center;" position="0 -0.05 0" />
            </a-entity>
          </a-entity>
        </a-scene>
    </div>
  );
};

export default ViewGallery;
