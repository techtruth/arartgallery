import { doc, getDoc, updateDoc, query, where, addDoc, getDocs, deleteDoc, collection } from "@firebase/firestore"
import { ref, uploadString, getDownloadURL } from "@firebase/storage"
import { firestore, storage } from "./firebase";

export const addGalleryEntry = async (galleryName, entryName, artistName, appraisalValue, imageData) => {

    try {
      const q = query(collection(firestore, "gallery"), where('name', '==', galleryName));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Assuming gallery names are unique, so there should be only one matching document
        const galleryId = querySnapshot.docs[0].id;

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

export const updateGalleryEntry = async (entryId, entryName, artistName, appraisalValue) => {
  try {
    console.log('Updating gallery entry with ID:', entryId);

    // Directly get the gallery entry by document ID
    const galleryEntryDoc = doc(collection(firestore, "galleryEntry"), entryId);
    const galleryEntrySnapshot = await getDoc(galleryEntryDoc);

    if (galleryEntrySnapshot.exists()) {
      // Gallery entry exists, update only the provided values
      await updateDoc(galleryEntryDoc, {
        name: entryName || "Unknown",
        artist: artistName || "Unknown",
        appraisal: appraisalValue || "Unknown",
      });
      console.log('Gallery entry updated successfully!');
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
 
