import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const USERS_COLLECTION = 'users';

export const addUser = async (userData) => {
  try {
    const userWithTimestamp = {
      ...userData,
      timestamp: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, USERS_COLLECTION), userWithTimestamp);
    console.log('User added with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding user:', error);
    return { success: false, error: error.message };
  }
};

export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    console.log('Fetched users:', users);
    return { success: true, users };
  } catch (error) {
    console.error('Error getting users:', error);
    return { success: false, error: error.message };
  }
};
