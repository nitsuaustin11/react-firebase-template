import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Centralized Firebase Firestore Service
 * Handles all database operations with consistent error handling
 */

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Gets server timestamp for consistent time tracking
 */
export const getServerTimestamp = () => serverTimestamp();

/**
 * Converts a date to Firestore Timestamp
 */
export const toTimestamp = (date) => Timestamp.fromDate(new Date(date));

/**
 * Formats Firestore response consistently
 */
const formatResponse = (success, data = null, error = null) => ({
  success,
  data,
  error
});

/**
 * Handles errors and returns formatted response
 */
const handleError = (error, operation) => {
  console.error(`Firebase ${operation} error:`, error);
  return formatResponse(false, null, error.message || 'An error occurred');
};

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Creates a new document with auto-generated ID
 * @param {string} collectionPath - Path to collection (e.g., 'users', 'posts')
 * @param {object} data - Data to store
 * @returns {Promise<{success: boolean, data: {id: string, ...data}, error: string|null}>}
 */
export const createDocument = async (collectionPath, data) => {
  try {
    const timestamp = getServerTimestamp();
    const docData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const collectionRef = collection(db, collectionPath);
    const docRef = await addDoc(collectionRef, docData);

    return formatResponse(true, { id: docRef.id, ...data });
  } catch (error) {
    return handleError(error, 'createDocument');
  }
};

/**
 * Creates a document with a specific ID
 * @param {string} collectionPath - Path to collection
 * @param {string} docId - Document ID to use
 * @param {object} data - Data to store
 * @param {boolean} merge - Whether to merge with existing data
 * @returns {Promise<{success: boolean, data: object, error: string|null}>}
 */
export const createDocumentWithId = async (collectionPath, docId, data, merge = false) => {
  try {
    const timestamp = getServerTimestamp();
    const docData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const docRef = doc(db, collectionPath, docId);
    await setDoc(docRef, docData, { merge });

    return formatResponse(true, { id: docId, ...data });
  } catch (error) {
    return handleError(error, 'createDocumentWithId');
  }
};

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Reads a single document by ID
 * @param {string} collectionPath - Path to collection
 * @param {string} docId - Document ID
 * @returns {Promise<{success: boolean, data: object|null, error: string|null}>}
 */
export const readDocument = async (collectionPath, docId) => {
  try {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return formatResponse(false, null, 'Document not found');
    }

    return formatResponse(true, { id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    return handleError(error, 'readDocument');
  }
};

/**
 * Reads all documents from a collection
 * @param {string} collectionPath - Path to collection
 * @param {object} options - Query options
 * @param {Array} options.filters - Array of filter objects [{field, operator, value}]
 * @param {string} options.orderByField - Field to order by
 * @param {string} options.orderDirection - 'asc' or 'desc'
 * @param {number} options.limitCount - Maximum number of documents to return
 * @returns {Promise<{success: boolean, data: Array, error: string|null}>}
 */
export const readCollection = async (collectionPath, options = {}) => {
  try {
    const { filters = [], orderByField = null, orderDirection = 'asc', limitCount = null } = options;

    let q = collection(db, collectionPath);

    // Build query with filters
    const queryConstraints = [];

    // Add where clauses
    filters.forEach(({ field, operator, value }) => {
      queryConstraints.push(where(field, operator, value));
    });

    // Add ordering
    if (orderByField) {
      queryConstraints.push(orderBy(orderByField, orderDirection));
    }

    // Add limit
    if (limitCount) {
      queryConstraints.push(limit(limitCount));
    }

    // Execute query if there are constraints
    if (queryConstraints.length > 0) {
      q = query(q, ...queryConstraints);
    }

    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return formatResponse(true, documents);
  } catch (error) {
    return handleError(error, 'readCollection');
  }
};

/**
 * Reads documents from a collection with custom query
 * @param {string} collectionPath - Path to collection
 * @param {Array} queryConstraints - Array of Firestore query constraints
 * @returns {Promise<{success: boolean, data: Array, error: string|null}>}
 */
export const readCollectionWithQuery = async (collectionPath, queryConstraints = []) => {
  try {
    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, ...queryConstraints);

    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return formatResponse(true, documents);
  } catch (error) {
    return handleError(error, 'readCollectionWithQuery');
  }
};

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Updates an existing document
 * @param {string} collectionPath - Path to collection
 * @param {string} docId - Document ID
 * @param {object} updates - Fields to update
 * @returns {Promise<{success: boolean, data: object, error: string|null}>}
 */
export const updateDocument = async (collectionPath, docId, updates) => {
  try {
    const docRef = doc(db, collectionPath, docId);

    const updateData = {
      ...updates,
      updatedAt: getServerTimestamp()
    };

    await updateDoc(docRef, updateData);

    return formatResponse(true, { id: docId, ...updates });
  } catch (error) {
    return handleError(error, 'updateDocument');
  }
};

/**
 * Updates a document or creates it if it doesn't exist
 * @param {string} collectionPath - Path to collection
 * @param {string} docId - Document ID
 * @param {object} data - Data to set
 * @returns {Promise<{success: boolean, data: object, error: string|null}>}
 */
export const upsertDocument = async (collectionPath, docId, data) => {
  try {
    const docRef = doc(db, collectionPath, docId);

    const updateData = {
      ...data,
      updatedAt: getServerTimestamp()
    };

    await setDoc(docRef, updateData, { merge: true });

    return formatResponse(true, { id: docId, ...data });
  } catch (error) {
    return handleError(error, 'upsertDocument');
  }
};

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Deletes a document
 * @param {string} collectionPath - Path to collection
 * @param {string} docId - Document ID
 * @returns {Promise<{success: boolean, data: {id: string}, error: string|null}>}
 */
export const deleteDocument = async (collectionPath, docId) => {
  try {
    const docRef = doc(db, collectionPath, docId);
    await deleteDoc(docRef);

    return formatResponse(true, { id: docId });
  } catch (error) {
    return handleError(error, 'deleteDocument');
  }
};

// ============================================
// SUBCOLLECTION OPERATIONS
// ============================================

/**
 * Creates a document in a subcollection
 * @param {string} parentPath - Path to parent document (e.g., 'users/userId')
 * @param {string} subcollectionName - Name of subcollection
 * @param {object} data - Data to store
 * @returns {Promise<{success: boolean, data: object, error: string|null}>}
 */
export const createSubDocument = async (parentPath, subcollectionName, data) => {
  const fullPath = `${parentPath}/${subcollectionName}`;
  return createDocument(fullPath, data);
};

/**
 * Reads all documents from a subcollection
 * @param {string} parentPath - Path to parent document
 * @param {string} subcollectionName - Name of subcollection
 * @param {object} options - Query options (same as readCollection)
 * @returns {Promise<{success: boolean, data: Array, error: string|null}>}
 */
export const readSubCollection = async (parentPath, subcollectionName, options = {}) => {
  const fullPath = `${parentPath}/${subcollectionName}`;
  return readCollection(fullPath, options);
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Checks if a document exists
 * @param {string} collectionPath - Path to collection
 * @param {string} docId - Document ID
 * @returns {Promise<boolean>}
 */
export const documentExists = async (collectionPath, docId) => {
  try {
    const docRef = doc(db, collectionPath, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking document existence:', error);
    return false;
  }
};

/**
 * Gets the count of documents in a collection
 * @param {string} collectionPath - Path to collection
 * @param {object} options - Query options (filters)
 * @returns {Promise<number>}
 */
export const getCollectionCount = async (collectionPath, options = {}) => {
  try {
    const result = await readCollection(collectionPath, options);
    return result.success ? result.data.length : 0;
  } catch (error) {
    console.error('Error getting collection count:', error);
    return 0;
  }
};

// ============================================
// EXPORTS
// ============================================

export default {
  // Create
  createDocument,
  createDocumentWithId,
  createSubDocument,

  // Read
  readDocument,
  readCollection,
  readCollectionWithQuery,
  readSubCollection,

  // Update
  updateDocument,
  upsertDocument,

  // Delete
  deleteDocument,

  // Utilities
  documentExists,
  getCollectionCount,
  getServerTimestamp,
  toTimestamp
};
