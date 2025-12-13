# WebSocket (Socket.IO) Setup Guide

## ✅ Status: **FULLY CONFIGURED**

The WebSocket connection is now **fully integrated** and will work automatically when users are authenticated.

## How It Works

### Automatic Connection
1. **On Login/Register** - Socket automatically connects with the access token
2. **On Page Load** - If user is already authenticated, socket connects automatically
3. **On Token Refresh** - Socket automatically reconnects with the new token
4. **On Logout** - Socket automatically disconnects

### Integration Points

#### 1. Authentication Flow (`useAuth` hook)
- ✅ Socket initializes after successful login
- ✅ Socket initializes after successful registration
- ✅ Socket disconnects on logout
- ✅ Socket reconnects when token is refreshed

#### 2. Layout Components
- ✅ `CustomerLayout` - Socket connected for customer pages
- ✅ `VendorLayout` - Socket connected for vendor pages
- ✅ `AdminLayout` - Socket connected for admin pages

#### 3. API Client
- ✅ Automatically reconnects socket when access token is refreshed (on 401 errors)

## Socket Events

### Available Events

#### 1. **Notifications** (`notification`)
Real-time notifications from the backend.

```javascript
// In any component
import { useSocket } from '../hooks/useSocket';

function MyComponent() {
  useSocket({
    onNotification: (data) => {
      console.log('New notification:', data);
      // Show toast, update state, etc.
    },
  });
}
```

#### 2. **Order Updates** (`orderUpdate`)
Real-time order status updates.

```javascript
useSocket({
  onOrderUpdate: (data) => {
    console.log('Order updated:', data);
    // Update order status in UI
  },
});
```

### Custom Events

You can also emit custom events:

```javascript
import { emitEvent } from '../socket/socketClient';

// Emit a custom event
emitEvent('customEvent', { data: 'value' });
```

## Usage Examples

### Example 1: Listen to Notifications in a Component

```javascript
import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import toast from 'react-hot-toast';

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useSocket({
    onNotification: (data) => {
      // Add new notification to state
      setNotifications(prev => [data, ...prev]);
      // Show toast
      toast.success(data.message || 'New notification');
    },
  });

  return (
    <div>
      {notifications.map(notif => (
        <div key={notif.id}>{notif.message}</div>
      ))}
    </div>
  );
}
```

### Example 2: Listen to Order Updates

```javascript
import { useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useNavigate } from 'react-router-dom';

function OrdersPage() {
  const navigate = useNavigate();

  useSocket({
    onOrderUpdate: (data) => {
      // Update order status in real-time
      if (data.status === 'delivered') {
        toast.success(`Order ${data.orderId} has been delivered!`);
      }
      // Refresh orders list or update specific order
    },
  });

  return <div>Orders...</div>;
}
```

### Example 3: Using Custom Events

```javascript
import { useEffect } from 'react';
import { getSocket, emitEvent } from '../socket/socketClient';

function ChatComponent() {
  useEffect(() => {
    const socket = getSocket();
    
    if (socket) {
      // Listen to custom event
      socket.on('chatMessage', (data) => {
        console.log('New message:', data);
      });

      return () => {
        socket.off('chatMessage');
      };
    }
  }, []);

  const sendMessage = (message) => {
    emitEvent('chatMessage', { message });
  };

  return <div>Chat...</div>;
}
```

### Example 4: Check Connection Status

```javascript
import { useSocket } from '../hooks/useSocket';

function Dashboard() {
  const { isConnected } = useSocket();

  return (
    <div>
      {isConnected ? (
        <span className="text-green-500">● Connected</span>
      ) : (
        <span className="text-red-500">● Disconnected</span>
      )}
    </div>
  );
}
```

## Event Listeners (Alternative Approach)

The layouts dispatch custom events that you can listen to anywhere:

```javascript
useEffect(() => {
  const handleNotification = (event) => {
    const data = event.detail;
    console.log('Notification received:', data);
    // Handle notification
  };

  const handleOrderUpdate = (event) => {
    const data = event.detail;
    console.log('Order update received:', data);
    // Handle order update
  };

  window.addEventListener('socketNotification', handleNotification);
  window.addEventListener('socketOrderUpdate', handleOrderUpdate);

  return () => {
    window.removeEventListener('socketNotification', handleNotification);
    window.removeEventListener('socketOrderUpdate', handleOrderUpdate);
  };
}, []);
```

## Configuration

### Environment Variables
```env
VITE_WS_URL=http://localhost:5001
```

### Socket Options
The socket is configured with:
- `withCredentials: true` - For CORS with credentials
- `transports: ['websocket', 'polling']` - Fallback to polling if WebSocket fails
- `auth: { token: accessToken }` - Authentication token

## Troubleshooting

### Socket Not Connecting

1. **Check Backend is Running**
   ```bash
   # Backend should be running on http://localhost:5001
   ```

2. **Check Authentication**
   - User must be logged in
   - Access token must be valid
   - Check browser console for errors

3. **Check CORS Configuration**
   - Backend must allow `http://localhost:5173`
   - `withCredentials` must be enabled

4. **Check Network Tab**
   - Look for WebSocket connection in browser DevTools
   - Check for connection errors

### Socket Disconnects Frequently

1. **Token Expiration** - Socket should auto-reconnect when token refreshes
2. **Network Issues** - Socket will automatically try to reconnect
3. **Backend Issues** - Check backend logs

### Debugging

Enable debug logging:

```javascript
import { getSocket } from '../socket/socketClient';

const socket = getSocket();
if (socket) {
  socket.on('connect', () => console.log('Connected:', socket.id));
  socket.on('disconnect', (reason) => console.log('Disconnected:', reason));
  socket.on('connect_error', (error) => console.error('Error:', error));
}
```

## Backend Requirements

Your backend Socket.IO server should:

1. **Accept authentication via `auth.token`**
   ```javascript
   // Backend example
   io.use((socket, next) => {
     const token = socket.handshake.auth.token;
     // Verify token
     if (isValidToken(token)) {
       next();
     } else {
       next(new Error('Authentication error'));
     }
   });
   ```

2. **Emit events to authenticated users**
   ```javascript
   // Backend example
   socket.emit('notification', {
     title: 'New Order',
     message: 'You have a new order',
   });
   ```

3. **Handle CORS properly**
   ```javascript
   // Backend CORS config
   cors: {
     origin: 'http://localhost:5173',
     credentials: true,
   }
   ```

## Testing

### Test Connection
1. Login to your app
2. Open browser console
3. You should see: `Socket connected: <socket-id>`
4. Check Network tab for WebSocket connection

### Test Notifications
1. Use backend to emit a notification
2. Check if it appears in your component
3. Check browser console for received events

---

**Status**: ✅ **READY** - Socket.IO is fully integrated and will work automatically when users authenticate.
