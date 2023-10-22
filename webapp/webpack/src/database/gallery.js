import { addDoc, deleteDoc, getDocs, query, where, collection } from "@firebase/firestore"
import { ref, uploadString, getDownloadURL } from "@firebase/storage"
import { getGalleryEntryImage } from "./galleryEntry";
import { firestore, storage } from "./firebase";



export const getGalleryEntries = async (name) => {
    try {
        const galleryQuery = query(collection(firestore, "gallery"), where('name', '==', name));
        const galleryQuerySnapshot = await getDocs(galleryQuery);
        if (!galleryQuerySnapshot.empty) {
          // Assuming gallery names are unique, so there should be only one matching document
          const galleryId = galleryQuerySnapshot.docs[0].id;
          
          const entryQuery = query(collection(firestore, "galleryEntry"), 
                                   where('gallery', '==', galleryId)); 
          const entryQuerySnapshot = await getDocs(entryQuery);
          let galleryEntries = new Array();
          if (!entryQuerySnapshot.empty) {
            for( let i =0; i < entryQuerySnapshot.docs.length; i++) {
              const doc = entryQuerySnapshot.docs[i];
              let data = doc.data();
              let imageData = await getGalleryEntryImage(doc.id);
              data.imageData = imageData;
              galleryEntries.push(data);
            };
            return galleryEntries;
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

export const getAllGalleries = async () => {
    try {
        const galleryQuery = query(collection(firestore, "gallery"));
        const galleryQuerySnapshot = await getDocs(galleryQuery);
        if (!galleryQuerySnapshot.empty) {
          let galleries = new Array();
          for( let i =0; i < galleryQuerySnapshot.docs.length; i++) {
            const doc = galleryQuerySnapshot.docs[i];
            let data = doc.data();
            let imageData = await getGalleryImage(doc.id);
            data.imageData = imageData;
            galleries.push(data);
          };
          return galleries;
        } else {
          console.log("No galleries are in the system. Did you run the setup page?");
          return null; // Galleries not found
        }
    } catch(err) {
        console.log(err)
    }
}

export const addGallery = async (name, locationName, locationAddress, imageData) => {
    let data = {
        name: name || "Unknown",
        locationName: locationName || "Unknown",
        locationAddress: locationAddress || "Unknown"
    }

    try {
        const galleryRef = await addDoc(collection(firestore, "gallery"), data);
        const imageRef = ref(storage, galleryRef.id);
        await uploadString(imageRef, imageData, 'data_url');
    } catch(err) {
        console.log(err)
    }
}
 
export const removeGallery = async (name) => {
    try {
        const q = query(collection(firestore, "gallery"), where("name", "==", name));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          querySnapshot.forEach(function(doc) {
            deleteDoc(doc.ref);
          }); 
        } else {
          console.log("No such gallery!");
          return null; // Gallery not found
        }
      
      } catch(err) {
          console.log(err)
      }

}

export const getGalleryImage = async (imageId) => {
    try {
      const imageRef = ref(storage, imageId);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch(err) {
        console.log(err)
    }
}
