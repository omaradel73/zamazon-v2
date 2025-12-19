const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data
let users = []; // In-memory user storage
let orders = []; // In-memory order storage

const products = [
  {
    id: 1,
    name: "Zamazon Echo Dot",
    price: 2500,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1543512214-318c77a07298?auto=format&fit=crop&q=80&w=400",
    description: "Voice controlled smart speaker with Alexa."
  },
  {
    id: 2,
    name: "Zamazon Kindle Paperwhite",
    price: 7000,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1592434134753-a70baf7979d5?auto=format&fit=crop&q=80&w=400",
    description: "Now with a 6.8” display and warmer light."
  },
  {
    id: 3,
    name: "Z-Phone 15 Pro",
    price: 55000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1616410011236-7a4211f92276?auto=format&fit=crop&q=80&w=400",
    description: "The ultimate smartphone experience."
  },
  {
    id: 4,
    name: "Gaming Laptop Z-Series",
    price: 65000,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400",
    description: "High performance gaming on the go."
  },
  {
    id: 5,
    name: "Wireless Headphones",
    price: 15000,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400",
    description: "Immersive sound with premium comfort."
  },
  {
    id: 6,
    name: "4K Ultra HD Smart TV",
    price: 25000,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1593784991095-a20506948430?auto=format&fit=crop&q=80&w=400",
    description: "Vibrant colors and incredible detail."
  }
];

// Routes
app.get('/', (req, res) => {
  res.send('Zamazon API is running');
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
    const { name, price, description, image, category } = req.body;
    const newProduct = {
        id: Date.now(),
        name,
        price: parseFloat(price),
        description,
        image: image || "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=400",
        rating: 0
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id == id);
    if (index !== -1) {
        products[index] = { ...products[index], ...req.body };
        res.json(products[index]);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id == id);
    if (index !== -1) {
        products.splice(index, 1);
        res.status(200).json({ message: "Product deleted" });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

// Auth Routes
app.post('/api/register', (req, res) => {
    const { email, password, name } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: "User already exists" });
    }
    const newUser = { id: Date.now(), name, email, password };
    users.push(newUser);
    res.status(201).json({ message: "User registered", user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email } });
});

const nodemailer = require('nodemailer');

// Email Configuration
let transporter;

const setupEmail = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
     // Real SMTP
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
    // Ethereal Fallback
    console.log("No SMTP credentials found in .env. Creating Ethereal Test Account...");
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

// Order Routes
app.post('/api/orders', async (req, res) => {
  const { userId, email, items, total, shipping, deliveryDate } = req.body;
  
  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  const order = {
    id: Date.now(),
    userId,
    items,
    total,
    shipping,
    deliveryDate,
    date: new Date(),
    status: 'pending'
  };

  orders.push(order);

  // Send Email
  console.log(`[EMAIL] Sending order confirmation to ${email}...`);
  
  if (transporter) {
      try {
        const info = await transporter.sendMail({
            from: '"Zamazon Store" <orders@zamazon.com>', 
            to: email, 
            subject: `Order Confirmation #${order.id}`, 
            text: `Thank you for your order! Total: $${total}. Shipping to: ${shipping.address}`, 
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
                    <div style="background: white; padding: 20px; border-radius: 10px;">
                        <h1 style="color: #6d28d9;">Thank you for your order!</h1>
                        <p>Your order <b>#${order.id}</b> is confirmed.</p>
                        
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
                        <p>We will notify you when it ships.</p>
                    </div>
                </div>
            `,
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log("---------------------------------------------------");
            console.log("Preview URL: %s", previewUrl);
            console.log("---------------------------------------------------");
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
  } else {
      console.log("Transporter not ready yet.");
  }

  res.status(201).json({ message: "Order placed successfully", orderId: order.id });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
