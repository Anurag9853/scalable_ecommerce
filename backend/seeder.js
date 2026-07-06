const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const products = [
  // Kitchen & Home
  {
    name: '3L Aluminium Pressure Cooker',
    description: 'ISI certified 3 litre pressure cooker suitable for gas stoves.',
    category: 'Kitchen & Home',
    mrp: 2199,
    price: 1699,
    stock: 40,
    rating: 4.3,
    targetUser: 'FAMILY'
  },
  {
    name: '750W Mixer Grinder with 3 Jars',
    description: 'Powerful 750W mixer grinder with stainless steel jars and overload protection.',
    category: 'Kitchen & Home',
    mrp: 4999,
    price: 3799,
    stock: 25,
    rating: 4.4,
    targetUser: 'FAMILY'
  },
  {
    name: 'Electric Kettle 1.8L',
    description: 'Automatic cut-off electric kettle for tea, coffee and instant noodles.',
    category: 'Kitchen & Home',
    mrp: 1899,
    price: 1299,
    stock: 60,
    rating: 4.2,
    targetUser: 'FAMILY'
  },
  {
    name: 'Cotton Bedsheet Set (Queen)',
    description: '100% cotton double bedsheet with 2 pillow covers, Jaipur print.',
    category: 'Kitchen & Home',
    mrp: 1999,
    price: 1299,
    stock: 35,
    rating: 4.1,
    targetUser: 'FAMILY'
  },
  // Electronics
  {
    name: 'Smart LED Bulb Pack of 4',
    description: '9W B22 smart LED bulbs with mobile app control and schedules.',
    category: 'Electronics',
    mrp: 1599,
    price: 999,
    stock: 80,
    rating: 4.0,
    targetUser: 'FAMILY'
  },
  {
    name: '4 Socket Extension Board',
    description: 'Surge protected extension board with 4 universal sockets and 2m cable.',
    category: 'Electronics',
    mrp: 1299,
    price: 799,
    stock: 70,
    rating: 4.2,
    targetUser: 'FAMILY'
  },
  {
    name: 'Bluetooth Earphones with Mic',
    description: 'In-ear Bluetooth earphones with 12 hours battery life and quick charge.',
    category: 'Electronics',
    mrp: 2499,
    price: 1699,
    stock: 55,
    rating: 4.3,
    targetUser: 'STUDENT'
  },
  // Student Essentials
  {
    name: 'School Backpack 30L',
    description: 'Water resistant backpack with laptop compartment and padded straps.',
    category: 'Student Essentials',
    mrp: 1899,
    price: 1299,
    stock: 45,
    rating: 4.4,
    targetUser: 'STUDENT'
  },
  {
    name: 'Steel Water Bottle 1L',
    description: 'Insulated stainless steel water bottle keeps water cold for 18 hours.',
    category: 'Student Essentials',
    mrp: 999,
    price: 649,
    stock: 100,
    rating: 4.5,
    targetUser: 'STUDENT'
  },
  {
    name: 'Study Table LED Lamp',
    description: 'Eye-friendly LED study lamp with 3 brightness modes and flexible neck.',
    category: 'Student Essentials',
    mrp: 1499,
    price: 999,
    stock: 60,
    rating: 4.2,
    targetUser: 'STUDENT'
  },
  {
    name: 'Notebook Pack of 6',
    description: 'Soft cover ruled notebooks, 200 pages each, exam friendly.',
    category: 'Student Essentials',
    mrp: 699,
    price: 449,
    stock: 120,
    rating: 4.3,
    targetUser: 'STUDENT'
  },
  // Kids & Baby
  {
    name: 'Baby Diapers Medium Pack',
    description: 'Ultra soft baby diapers with wetness indicator, size M (7-12kg).',
    category: 'Kids & Baby',
    mrp: 999,
    price: 749,
    stock: 90,
    rating: 4.4,
    targetUser: 'CHILD'
  },
  {
    name: 'Kids Story Books Set of 5',
    description: 'Illustrated moral story books for kids age 4-8 years.',
    category: 'Kids & Baby',
    mrp: 899,
    price: 599,
    stock: 50,
    rating: 4.5,
    targetUser: 'CHILD'
  },
  // Men
  {
    name: 'Mens Casual Cotton Shirt',
    description: 'Slim fit checked shirt for daily office and college wear.',
    category: 'Men',
    mrp: 1999,
    price: 1199,
    stock: 40,
    rating: 4.1,
    targetUser: 'MEN'
  },
  {
    name: 'Beard Trimmer with USB Charging',
    description: 'Cordless beard trimmer with 90 minutes runtime and travel lock.',
    category: 'Men',
    mrp: 2499,
    price: 1599,
    stock: 65,
    rating: 4.3,
    targetUser: 'MEN'
  },
  // Women
  {
    name: 'Womens Cotton Kurti',
    description: 'Straight fit cotton kurti with 3/4th sleeves and Jaipur prints.',
    category: 'Women',
    mrp: 1799,
    price: 1099,
    stock: 50,
    rating: 4.2,
    targetUser: 'WOMEN'
  },
  {
    name: 'Hair Dryer 1200W',
    description: 'Compact foldable hair dryer with hot and cold settings.',
    category: 'Women',
    mrp: 1699,
    price: 999,
    stock: 55,
    rating: 4.0,
    targetUser: 'WOMEN'
  },
  // Office & Study
  {
    name: 'Executive Lunch Box Set',
    description: 'Stainless steel lunch box with 3 containers and insulated bag.',
    category: 'Office & Study',
    mrp: 1499,
    price: 949,
    stock: 70,
    rating: 4.2,
    targetUser: 'FAMILY'
  },
  {
    name: 'Office Chair Cushion',
    description: 'Memory foam seat cushion for long sitting comfort.',
    category: 'Office & Study',
    mrp: 1999,
    price: 1399,
    stock: 30,
    rating: 4.1,
    targetUser: 'FAMILY'
  },
  // Health & Personal Care
  {
    name: 'Yoga Mat 6mm',
    description: 'Anti-skid yoga mat suitable for home workouts and meditation.',
    category: 'Health & Personal Care',
    mrp: 1499,
    price: 899,
    stock: 80,
    rating: 4.4,
    targetUser: 'FAMILY'
  },
  {
    name: 'Digital Weighing Scale',
    description: 'Tempered glass digital body weight scale with LCD display.',
    category: 'Health & Personal Care',
    mrp: 2299,
    price: 1599,
    stock: 35,
    rating: 4.2,
    targetUser: 'FAMILY'
  },
  {
    name: 'Home First Aid Kit',
    description: 'Compact first aid kit with bandages, antiseptic and crepe bandage.',
    category: 'Health & Personal Care',
    mrp: 1299,
    price: 899,
    stock: 45,
    rating: 4.3,
    targetUser: 'FAMILY'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();

    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

    const adminUser = await User.create({
      name: process.env.ADMIN_NAME || 'Bharat Admin',
      email: process.env.ADMIN_EMAIL || 'admin@bharatmart.in',
      password: adminPassword,
      role: 'ADMIN'
    });

    const createdProducts = await Product.insertMany(products);

    console.log('Admin user created:', adminUser.email);
    console.log('Products seeded:', createdProducts.length);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();

