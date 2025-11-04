import { useState, useEffect, useCallback } from 'react';
import {
  readDocument,
  readCollection,
  createDocument,
  updateDocument,
  deleteDocument
} from '../services/firebaseService';

/**
 * Hook for fetching a single document from Firestore
 * @param {string} collectionPath - Path to collection
 * @param {string} docId - Document ID
 * @param {boolean} autoFetch - Whether to fetch on mount (default: true)
 * @returns {object} { data, loading, error, refetch }
 */
export function useFirebaseDocument(collectionPath, docId, autoFetch = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchDocument = useCallback(async () => {
    if (!collectionPath || !docId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await readDocument(collectionPath, docId);

    if (result.success) {
      setData(result.data);
      setError(null);
    } else {
      setError(result.error);
      setData(null);
    }

    setLoading(false);
  }, [collectionPath, docId]);

  useEffect(() => {
    if (autoFetch) {
      fetchDocument();
    }
  }, [autoFetch, fetchDocument]);

  return {
    data,
    loading,
    error,
    refetch: fetchDocument
  };
}

/**
 * Hook for fetching a collection from Firestore
 * @param {string} collectionPath - Path to collection
 * @param {object} options - Query options (filters, orderBy, limit)
 * @param {boolean} autoFetch - Whether to fetch on mount (default: true)
 * @returns {object} { data, loading, error, refetch }
 */
export function useFirebaseCollection(collectionPath, options = {}, autoFetch = true) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchCollection = useCallback(async () => {
    if (!collectionPath) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const result = await readCollection(collectionPath, options);

    if (result.success) {
      setData(result.data);
      setError(null);
    } else {
      setError(result.error);
      setData([]);
    }

    setLoading(false);
  }, [collectionPath, JSON.stringify(options)]);

  useEffect(() => {
    if (autoFetch) {
      fetchCollection();
    }
  }, [autoFetch, fetchCollection]);

  return {
    data,
    loading,
    error,
    refetch: fetchCollection
  };
}

/**
 * Hook for creating documents in Firestore
 * @param {string} collectionPath - Path to collection
 * @returns {object} { create, loading, error, data }
 */
export function useFirebaseCreate(collectionPath) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const create = useCallback(
    async (docData) => {
      setLoading(true);
      setError(null);

      const result = await createDocument(collectionPath, docData);

      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error);
        setData(null);
      }

      setLoading(false);
      return result;
    },
    [collectionPath]
  );

  return {
    create,
    loading,
    error,
    data
  };
}

/**
 * Hook for updating documents in Firestore
 * @param {string} collectionPath - Path to collection
 * @param {string} docId - Document ID
 * @returns {object} { update, loading, error, data }
 */
export function useFirebaseUpdate(collectionPath, docId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const update = useCallback(
    async (updates) => {
      setLoading(true);
      setError(null);

      const result = await updateDocument(collectionPath, docId, updates);

      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        setError(result.error);
        setData(null);
      }

      setLoading(false);
      return result;
    },
    [collectionPath, docId]
  );

  return {
    update,
    loading,
    error,
    data
  };
}

/**
 * Hook for deleting documents from Firestore
 * @param {string} collectionPath - Path to collection
 * @returns {object} { deleteDoc, loading, error }
 */
export function useFirebaseDelete(collectionPath) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteDoc = useCallback(
    async (docId) => {
      setLoading(true);
      setError(null);

      const result = await deleteDocument(collectionPath, docId);

      if (result.success) {
        setError(null);
      } else {
        setError(result.error);
      }

      setLoading(false);
      return result;
    },
    [collectionPath]
  );

  return {
    deleteDoc,
    loading,
    error
  };
}

/**
 * Hook for generic Firebase mutations (create, update, delete)
 * Useful when you need to perform multiple different operations
 * @returns {object} { mutate, loading, error, data }
 */
export function useFirebaseMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (operation, ...args) => {
    setLoading(true);
    setError(null);

    let result;

    switch (operation) {
      case 'create':
        result = await createDocument(...args);
        break;
      case 'update':
        result = await updateDocument(...args);
        break;
      case 'delete':
        result = await deleteDocument(...args);
        break;
      default:
        result = { success: false, error: 'Invalid operation' };
    }

    if (result.success) {
      setData(result.data);
      setError(null);
    } else {
      setError(result.error);
      setData(null);
    }

    setLoading(false);
    return result;
  }, []);

  return {
    mutate,
    loading,
    error,
    data
  };
}

/**
 * Hook for handling Firebase query with manual control
 * @param {Function} queryFn - Async function that performs the Firebase operation
 * @returns {object} { execute, loading, error, data, reset }
 */
export function useFirebaseQuery(queryFn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await queryFn(...args);

        if (result && result.success) {
          setData(result.data);
          setError(null);
        } else if (result && !result.success) {
          setError(result.error);
          setData(null);
        } else {
          setData(result);
          setError(null);
        }

        setLoading(false);
        return result;
      } catch (err) {
        const errorMsg = err.message || 'An error occurred';
        setError(errorMsg);
        setData(null);
        setLoading(false);
        return { success: false, error: errorMsg };
      }
    },
    [queryFn]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    execute,
    loading,
    error,
    data,
    reset
  };
}

// Export all hooks
export default {
  useFirebaseDocument,
  useFirebaseCollection,
  useFirebaseCreate,
  useFirebaseUpdate,
  useFirebaseDelete,
  useFirebaseMutation,
  useFirebaseQuery
};
