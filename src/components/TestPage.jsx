import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addUser, getUsers } from '../services/userService';

const TestPage = () => {
  const { currentUser, isAuthenticated, login } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const demoUser = {
    additional_info: {
      insurance: "",
      rocky_mountain_account: ""
    },
    lease: {
      building_type: "Half",
      lease_end: "",
      lease_start: "",
      square_footage: "3600",
      term: "",
      units_occupied: ["A1"]
    },
    payment_info: {
      last_payment_date: new Date().toISOString(),
      next_due_date: "Oct 1st",
      rent_structure: {
        base_rent: "3623",
        cam_fee: "500",
        early_payment: "$3916.85 (5% discount)",
        late_payment: "$4329.15 (5% penalty)",
        total_rent: "4123"
      }
    },
    tenant: {
      contact: {
        additional: [
          {
            email: "demo@example.com",
            name: "Demo Contact",
            phone: "123-456-7890"
          }
        ],
        primary: {
          email: "nitsuaustin11@gmail.com",
          phone: "385-250-9653",
          name: "austin bradshaw"
        }
      }
    },
    userEmail: "nitsuaustin11@gmail.com"
  };

  const handleAddAuthState = async () => {
    setLoading(true);
    setMessage('Adding user to database...');

    const result = await addUser(demoUser);

    if (result.success) {
      login(demoUser.userEmail);
      setMessage(`User added successfully! ID: ${result.id}`);
    } else {
      setMessage(`Error: ${result.error}`);
    }

    setLoading(false);
  };

  const handleGetUsers = async () => {
    setLoading(true);
    setMessage('Fetching users from database...');

    const result = await getUsers();

    if (result.success) {
      setUsers(result.users);
      setMessage(`Successfully fetched ${result.users.length} user(s)`);
    } else {
      setMessage(`Error: ${result.error}`);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Firebase Test Page</h1>

      {/* Auth Status Display */}
      <div style={{
        padding: '15px',
        marginBottom: '20px',
        backgroundColor: isAuthenticated ? '#d4edda' : '#f8d7da',
        border: `1px solid ${isAuthenticated ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '5px'
      }}>
        <h2>Auth Status</h2>
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>Current User:</strong> {currentUser || 'None'}</p>
      </div>

      {/* Action Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleAddAuthState}
          disabled={loading}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Add Auth State
        </button>

        <button
          onClick={handleGetUsers}
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Get Users
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '20px',
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: '5px'
        }}>
          {message}
        </div>
      )}

      {/* Users Display */}
      {users.length > 0 && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '5px'
        }}>
          <h2>Users from Database</h2>
          {users.map((user, index) => (
            <div
              key={user.id}
              style={{
                marginBottom: '15px',
                padding: '10px',
                backgroundColor: 'white',
                border: '1px solid #ced4da',
                borderRadius: '5px'
              }}
            >
              <h3>User {index + 1}</h3>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.userEmail}</p>
              <p><strong>Primary Contact:</strong> {user.tenant?.contact?.primary?.name}</p>
              <p><strong>Phone:</strong> {user.tenant?.contact?.primary?.phone}</p>
              <details>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Full Data</summary>
                <pre style={{
                  backgroundColor: '#f4f4f4',
                  padding: '10px',
                  borderRadius: '5px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(user, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestPage;
