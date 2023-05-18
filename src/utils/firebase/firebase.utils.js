import { initializeApp } from 'firebase/app';
import { 
    getAuth,
    signInWithPopup, 
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    writeBatch
} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDhhi81p9hyca3Lzy4iQIUXV85C276thcY",
  authDomain: "clothing-store-db-98e63.firebaseapp.com",
  projectId: "clothing-store-db-98e63",
  storageBucket: "clothing-store-db-98e63.appspot.com",
  messagingSenderId: "1058143097966",
  appId: "1:1058143097966:web:4934a5b9088dd6e2d2027f"
};

initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: "select_account"
})

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore();

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = collection(db, collectionKey);
    const batch = writeBatch(db);

    objectsToAdd.forEach((object) => {
        const docRef = doc(collectionRef, object.title.toLowerCase());

        batch.set(docRef, object);
    })

    await batch.commit();
    console.log('done');
}

export const createUserDocumentFromAuth = async (
    userAuth, 
    additionalInformation = {}
) => {
    if(!userAuth) return;

    const userDocRef = doc(db, 'users', userAuth.uid);

    const userSnapshot = await getDoc(userDocRef);

    if(!userSnapshot.exists()){
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {
                displayName,
                email,
                createdAt,
                ...additionalInformation
            });
        } catch (error) {
            console.log('Error creating user', error.message);
        }
    }

    return userDocRef
}

export const createAuthUserWithEmailAndPassword = async (email, password) => {
    if(!email || !password) return;
    
    return await createUserWithEmailAndPassword(auth, email, password)
}

export const signInAuthWithEmailAndPassword = async (email, password) => {
    if(!email || !password) return;
    
    return await signInWithEmailAndPassword(auth, email, password)
}

export const signOutUser = async() => await signOut(auth);

export const authStateChangedListener = (callback) => onAuthStateChanged(auth, callback);