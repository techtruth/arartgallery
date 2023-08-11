import { doc, query, where, addDoc, getDocs, deleteDoc, collection } from "@firebase/firestore"
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
 