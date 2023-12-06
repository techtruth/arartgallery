import { doc, getDoc, updateDoc, query, where, addDoc, getDocs, deleteDoc, collection } from "@firebase/firestore"
import { ref, uploadString, getDownloadURL } from "@firebase/storage"
import { firestore, storage } from "./firebase";

export const addGalleryEntry = async (galleryId, entryName, artistName, appraisalValue, imageData) => {

    try {
      const galleryDoc = doc(collection(firestore, "gallery"), galleryId);
      const gallerySnapshot = await getDoc(galleryDoc);
      if (gallerySnapshot.exists()) {
        // Assuming gallery names are unique, so there should be only one matching document

        let data = {
          name: entryName || "Unknown",
          artist: artistName || "Unknown",
          appraisal: appraisalValue || "Unknown",
          gallery: galleryId
        }

        const galleryEntryRef = await addDoc(collection(firestore, "galleryEntry"), data);
        const imageRef = ref(storage, galleryEntryRef.id);
        await uploadString(imageRef, imageData, 'data_url'); 

      } else {
        console.log("No such gallery!");
        return null; // Gallery not found
      }

    } catch(err) {
        console.log(err)
    }
}

export const updateGalleryEntry = async (entryId, entryName, artistName, appraisalValue, imageData) => {
  try {

    const galleryEntryDoc = doc(collection(firestore, "galleryEntry"), entryId);
    const galleryEntrySnapshot = await getDoc(galleryEntryDoc);

    if (galleryEntrySnapshot.exists()) {
      const updatedFields = {};

      // Conditionally update name if provided
      if (entryName) {
        updatedFields.name = entryName;
      }

      // Conditionally update artistName if provided
      if (artistName) {
        updatedFields.artist = artistName;
      }

      // Conditionally update appraisalValue if provided
      if (appraisalValue) {
        updatedFields.appraisal = appraisalValue;
      }

      // Update the image in Firebase storage only if imageData is provided
      if (imageData.startsWith("data:")) {
        const imageRef = ref(storage, entryId);
        await uploadString(imageRef, imageData, 'data_url');
        const imageUrl = await getDownloadURL(imageRef);
        updatedFields.imageData = imageUrl;
      }

      // Update gallery entry with the new or existing values
      await updateDoc(galleryEntryDoc, updatedFields);

      console.log('Gallery entry updated successfully!');
      return galleryEntrySnapshot.data();

    } else {
      console.log("No such gallery entry with the provided document ID:", entryId);
      return null; // Gallery entry not found
    }

  } catch (err) {
    console.error('Error updating gallery entry:', err);
  }
};

export const removeGalleryEntry = async (galleryName, entryName) => {
    try {
      const galleryQuery = query(collection(firestore, "gallery"), where('name', '==', galleryName));
      const galleryQuerySnapshot = await getDocs(galleryQuery);
      if (!galleryQuerySnapshot.empty) {
        // Assuming gallery names are unique, so there should be only one matching document
        const galleryId = galleryQuerySnapshot.docs[0].id;
        
        const entryQuery = query(collection(firestore, "galleryEntry"), 
                                 where('gallery', '==', galleryId), 
                                 where('name', '==', entryName));
        const entryQuerySnapshot = await getDocs(entryQuery);
        if (!entryQuerySnapshot.empty) {
          entryQuerySnapshot.forEach(function(doc) {
            deleteDoc(doc.ref);
          }); 
        } else {
          console.log("No such gallery entry!");
          return null; // Gallery entry not found
        }

      } else {
        console.log("No such gallery!");
        return null; // Gallery not found
      }

    } catch(err) {
        console.log(err)
    }
}
 
export const getGalleryEntryImage = async (imageId) => {
    try {
      const imageRef = ref(storage, imageId);
      const url = await getDownloadURL(imageRef); 
      return url;
    } catch(err) {
        console.log(err)
    }
}
 
