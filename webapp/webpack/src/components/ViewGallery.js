import React, { useEffect, useRef, useState } from 'react';
import 'aframe';
import 'mind-ar/dist/mindar-image-aframe.prod.js';
import { getGalleryEntries, getGalleryByName } from '../database/gallery';

const ViewGallery = () => {
  const sceneRef = useRef(null);
  const [galleryName] = useState('Demo');
  const [galleryMind, setGalleryMind] = useState();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
          const loadedEntries = await getGalleryEntries(galleryName);
          const galleryInfo = await getGalleryByName(galleryName);
          setEntries(loadedEntries);
          setGalleryMind(galleryInfo.mindFileURL);
          console.log("FETCHED ENTRIES!");
      } catch (error) {
        console.error('Error loading entries:', error);
      }
    };

    if (!entries.length) {
      fetchData();
    }

    if (entries.length && sceneRef.current) {
      const arSystem = sceneRef.current.systems['mindar-image-system'];
      arSystem.start();
    }
  }, [entries]);

  return (
    <div>
      {entries && galleryMind && (
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
      </a-scene>
      )}
    </div>
  );
};

export default ViewGallery;
