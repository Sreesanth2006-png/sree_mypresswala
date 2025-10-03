// FIX: To prevent name collisions with other potential global types (like the DOM's `Request` and `Response`),
// the express import is changed to a default import, and types are referenced via the `express` object.
import express from 'express';
import cors from 'cors';

// FIX: Explicitly typing `app` as `express.Express` helps the TypeScript compiler resolve the correct
// types for express middleware and route handlers. This resolves errors with `app.use`, `req.body`,
// `res.status`, and `res.json`.
const app: express.Express = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Mock Data & In-Memory User Store ---
let users = [
    { name: 'Priya Sharma', email: 'customer@example.com', password: 'password123', role: 'customer' },
    { name: 'QuickClean Irons', email: 'vendor@example.com', password: 'password123', role: 'vendor' },
    { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'super-admin' },
    { name: 'Delivery Staff', email: 'delivery@example.com', password: 'password123', role: 'delivery-staff' },
];

const initialOrders = [
  { id: 'ORD-7892', status: 'Ironing in Process', itemCount: 12, date: '2024-07-28', tower: 'B', flat: '503' },
  { id: 'ORD-7891', status: 'Delivered', itemCount: 8, date: '2024-07-26', tower: 'A', flat: '101' },
  { id: 'ORD-7890', status: 'Paid', itemCount: 15, date: '2024-07-22', tower: 'C', flat: '1204' },
  { id: 'ORD-8112', status: 'Pending Pickup', itemCount: 15, date: '2024-07-29', tower: 'A', flat: '101' },
  { id: 'ORD-8111', status: 'Pending Pickup', itemCount: 5, date: '2024-07-29', tower: 'C', flat: '1204' },
  { id: 'ORD-7888', status: 'Picked Up', itemCount: 22, date: '2024-07-28', tower: 'D', flat: '808' },
  { id: 'ORD-7955', status: 'Ready for Delivery', itemCount: 18, date: '2024-07-29', tower: 'B', flat: '1101' },
];

const initialCommunities = [
    { name: 'Prestige Lakeside Habitat', location: 'Bangalore', vendors: 5 },
    { name: 'Sobha Dream Acres', location: 'Bangalore', vendors: 3 },
    { name: 'Brigade Exotica', location: 'Bangalore', vendors: 2 },
];

const initialVendors = [
    { name: 'QuickClean Irons', owner: 'Ramesh Kumar', status: 'Active' },
    { name: 'SuperPress Services', owner: 'Sunita Sharma', status: 'Active' },
    { name: 'DailyPress Co.', owner: 'Amit Patel', status: 'Inactive' },
];


// --- API Routes ---

// Sign Up Route
// FIX: Explicitly type request and response objects to resolve errors.
app.post('/api/signup', (req: express.Request, res: express.Response) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
    }

    const newUser = { name, email, password, role };
    users.push(newUser);

    res.status(201).json({ message: 'User created successfully' });
});

// Login Route
// FIX: Explicitly type request and response objects to resolve errors.
app.post('/api/login', (req: express.Request, res: express.Response) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required' });
    }
    
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    
    if (user) {
        // Don't send the password back to the client
        const { password: _, ...userToReturn } = user;
        res.json(userToReturn);
    } else {
        res.status(401).json({ message: 'Invalid credentials or role' });
    }
});


// FIX: Explicitly type request and response objects using express.Request and express.Response
app.get('/api/orders', (req: express.Request, res: express.Response) => {
    res.json(initialOrders);
});

// FIX: Explicitly type request and response objects using express.Request and express.Response
app.get('/api/communities', (req: express.Request, res: express.Response) => {
    res.json(initialCommunities);
});

// FIX: Explicitly type request and response objects using express.Request and express.Response
app.get('/api/vendors', (req: express.Request, res: express.Response) => {
    res.json(initialVendors);
});

// --- Server Start ---
app.listen(port, () => {
    console.log(`API Server is running on http://localhost:${port}`);
});