const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zamazon';

app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- Schemas & Models ---
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    address: String,
    city: String,
    phone: String,
    isVerified: { type: Boolean, default: false },
    verificationCode: String,
    resetToken: String,
    resetTokenExpiry: Date
});

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    rating: Number
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: String,
    items: Array,
    total: Number,
    shipping: Object,
    deliveryDate: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// ... (Seed Data remains same)

// --- Profile Routes ---
app.put('/api/users/profile', async (req, res) => {
    const { userId, name, address, city, phone, password } = req.body;
    try {
        const updateData = { name, address, city, phone };
        if (password && password.trim() !== "") {
            updateData.password = password; // In prod use bcrypt hash!
        }
        
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        res.json({ 
            message: "Profile updated", 
            user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, address: user.address, city: user.city, phone: user.phone } 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/orders/myorders', async (req, res) => {
    const { userId } = req.query;
    try {
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Seed Data (Products) ---
const seedProducts = async () => {
    const count = await Product.countDocuments();
    if (count === 0) {
        const products = [
            {
                name: "Zamazon Echo Dot",
                price: 2500,
                rating: 4.5,
                image: "https://images.unsplash.com/photo-1543512214-318c77a07298?auto=format&fit=crop&q=80&w=400",
                description: "Voice controlled smart speaker with Alexa."
            },
            {
                name: "Zamazon Kindle Paperwhite",
                price: 7000,
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?auto=format&fit=crop&q=80&w=400",
                description: "Now with a 6.8” display and warmer light."
            },
            {
                name: "Z-Phone 15 Pro",
                price: 55000,
                rating: 4.7,
                image: "https://images.unsplash.com/photo-1616410011236-7a4211f92276?auto=format&fit=crop&q=80&w=400",
                description: "The ultimate smartphone experience."
            },
            {
                name: "Gaming Laptop Z-Series",
                price: 65000,
                rating: 4.6,
                image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400",
                description: "High performance gaming on the go."
            },
            {
                name: "Wireless Headphones",
                price: 15000,
                rating: 4.4,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
                description: "Immersive sound with premium comfort."
            },
            {
                name: "4K Ultra HD Smart TV",
                price: 25000,
                rating: 4.3,
                image: "https://images.unsplash.com/photo-1593784991095-a20506948430?auto=format&fit=crop&q=80&w=400",
                description: "Vibrant colors and incredible detail."
            }
        ];
        await Product.insertMany(products);
        console.log("Seeded Products");
    }
};
seedProducts();

// --- Auth Whitelist ---
// Emails that automatically get Admin access
const ADMIN_EMAILS = [
    'omaradel73@gmail.com',
    'admin@zamazon.com'
];

// --- Routes ---

app.get('/', (req, res) => {
  res.send('Zamazon API is running with MongoDB');
});

// Products
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const { name, price, description, image } = req.body;
        const newProduct = new Product({
            name,
            price: parseFloat(price),
            description,
            image: image || "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=400",
            rating: 0
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// --- Auth ---

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

app.post('/api/register', async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        // Auto-assign admin if in whitelist
        const isAdmin = ADMIN_EMAILS.includes(email);
        const verificationCode = generateCode();

        const newUser = new User({ 
            name, 
            email, 
            password, 
            isAdmin, 
            isVerified: false, 
            verificationCode 
        });
        await newUser.save();

        // Send Verification Email
        if (transporter) {
            transporter.sendMail({
                from: '"Zamazon Security" <security@zamazon.com>',
                to: email,
                subject: "Verify your email",
                text: `Your verification code is: ${verificationCode}`
            }).catch(console.error);
        }
        
        res.status(201).json({ 
            message: "User registered. Please verify your email.", 
            user: { id: newUser._id, name: newUser.name, email: newUser.email, isAdmin: newUser.isAdmin, isVerified: false } 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/verify', async (req, res) => {
    const { email, code } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.verificationCode === code) {
            user.isVerified = true;
            user.verificationCode = undefined;
            await user.save();
            res.json({ message: "Email verified successfully!", user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, isVerified: true } });
        } else {
            res.status(400).json({ message: "Invalid code" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const resetCode = generateCode(); // Using code instead of token for simplicity
        user.resetToken = resetCode;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
        await user.save();

        if (transporter) {
            transporter.sendMail({
                from: '"Zamazon Security" <security@zamazon.com>',
                to: email,
                subject: "Reset Password",
                text: `Your password reset code is: ${resetCode}`
            }).catch(console.error);
        }

        res.json({ message: "Reset code sent to email" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/reset-password', async (req, res) => {
    const { email, code, newPassword } = req.body;
    try {
        const user = await User.findOne({ 
            email, 
            resetToken: code, 
            resetTokenExpiry: { $gt: Date.now() } 
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired code" });

        user.password = newPassword; // Setup hashing in prod
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password }); // In prod use bcrypt!
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.json({ 
            message: "Login successful", 
            user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, isVerified: user.isVerified } 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Admin Routes ---
// Middleware to check if user is admin would be better, but for now we check inside
const checkAdmin = async (req, res, next) => {
    // In a real app, verify JWT token here. 
    // For this simple demo, we will trust the client to send the user ID/Email or simple header?
    // Actually, we are using stateless auth (just storing user in frontend). 
    // To secure this properly without JWT, we'd need sessions.
    // For this "Clone", we will pass a header 'x-admin-email' from frontend to verify identity against DB.
    const email = req.headers['x-admin-email'];
    if (!email) return res.status(401).json({ message: "Unauthorized" });
    
    const user = await User.findOne({ email });
    if (!user || !user.isAdmin) return res.status(403).json({ message: "Forbidden" });
    next();
};

app.get('/api/admin/orders', checkAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/admin/users', checkAdmin, async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/admin/users/:id/role', checkAdmin, async (req, res) => {
    try {
        const { isAdmin } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { isAdmin }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Email Setup
let transporter;
const setupEmail = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
     transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("Configured with provided SMTP credentials.");
  } else {
    try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: testAccount.user, 
                pass: testAccount.pass, 
            },
        });
        console.log(`[ETHEREAL] Test Account Created: ${testAccount.user}`);
    } catch (err) {
        console.error("Failed to create Ethereal account", err);
    }
  }
};
setupEmail();

// Orders
app.post('/api/orders', async (req, res) => {
  const { userId, email, items, total, shipping, deliveryDate } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  try {
      const order = new Order({
        userId,
        email,
        items,
        total,
        shipping,
        deliveryDate,
        status: 'pending'
      });
      await order.save();

      // Send Email
      if (transporter) {
          try {
            const info = await transporter.sendMail({
                from: '"Zamazon Store" <orders@zamazon.com>', 
                to: email, 
                subject: `Order Confirmation #${order._id}`, 
                text: `Thank you for your order! Total: $${total}. Shipping to: ${shipping.address}`, 
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
                        <div style="background: white; padding: 20px; border-radius: 10px;">
                            <h1 style="color: #6d28d9;">Thank you for your order!</h1>
                            <p>Your order <b>#${order._id}</b> is confirmed.</p>
                            
                            <div style="background: #f9fafb; padding: 15px; margin: 15px 0; border-radius: 8px;">
                                <h3>Shipping Details</h3>
                                <p><b>Address:</b> ${shipping.address}, ${shipping.city}</p>
                                <p><b>Phone:</b> ${shipping.phone}</p>
                                <p><b>Estimated Delivery:</b> ${deliveryDate}</p>
                            </div>

                            <h3>Total: EGP ${total}</h3>
                            <ul>
                                ${items.map(item => `<li>${item.name} - EGP ${item.price} x ${item.quantity}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                `,
            });
            console.log("Message sent: %s", info.messageId);
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) console.log("Preview URL: %s", previewUrl);
          } catch (error) {
            console.error("Error sending email:", error);
          }
      }

      res.status(201).json({ message: "Order placed successfully", orderId: order._id });

  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
