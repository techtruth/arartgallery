import { addDoc, updateDoc, deleteDoc, getDocs, query, where, collection } from "@firebase/firestore"
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
              data.id = doc.id;
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

export const getGalleryByName = async (galleryName) => {
    try {
        const galleryQuery = query(collection(firestore, 'gallery'), where('name', '==', galleryName));
        const galleryQuerySnapshot = await getDocs(galleryQuery);

        if (!galleryQuerySnapshot.empty) {
            const doc = galleryQuerySnapshot.docs[0];
            let data = doc.data();
            let imageData = await getGalleryImage(doc.id);
            data.imageData = imageData;
    console.log("CALLED!", data);
            return data;
        } else {
            console.log(`Gallery with name ${galleryName} not found.`);
            return null; // Gallery not found
        }
    } catch (err) {
        console.error(err);
        return null; // Handle error appropriately
    }
};


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


export const setGalleryMindFile = async (galleryName, newMindFile) => {
    try {
        // Query for the gallery document based on the name
        const galleryQuery = query(collection(firestore, 'gallery'), where('name', '==', galleryName));
        const galleryQuerySnapshot = await getDocs(galleryQuery);

        // Check if the gallery with the given name exists
        if (!galleryQuerySnapshot.empty) {
            // Assuming there is only one gallery with the given name, get its reference
            const galleryDocRef = galleryQuerySnapshot.docs[0].ref;

            // Create a reference to the file in Firebase Storage
            const storageRef = ref(storage, `gallery/${galleryName}/mindFile`);

            // Upload the file to Firebase Storage
            await uploadString(storageRef, newMindFile, 'base64', { contentType: 'application/octet-stream' });

            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(storageRef);

            // Update the gallery document with the download URL of the file
            await updateDoc(galleryDocRef, {
                mindFileURL: downloadURL
            });
        } else {
            console.log(`Gallery with name ${galleryName} not found.`);
        }
    } catch (err) {
        console.error(err);
    }
};
