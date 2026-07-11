import sareeLogo from '../assets/sarreelogo.png';
import kurtiLogo from '../assets/kurtilogo.png';
import shawlLogo from '../assets/shawllogo.png';
import trouserLogo from '../assets/trouserlogo.png';
import kidsLogo from '../assets/kidslogo.png';
import topLogo from '../assets/toplogo.png';
import nightLogo from '../assets/nightlogo.png';
import bagLogo from '../assets/baglogo.png';
import churidarLogo from '../assets/churidarlogo.png';
import bodyconLogo from '../assets/bodycon.png';
import casualLogo from '../assets/casuallogo.png';
import cordLogo from '../assets/cord.png';

export const CATEGORIES = [
  { _id:'c1',  name:'Saree',          slug:'saree',          icon:'🥻', image: sareeLogo, color:'#F8F0FF', accent:'#4A1068' },
  { _id:'c2',  name:'Kurti',          slug:'kurti',          icon:'🪡', image: kurtiLogo, color:'#EDD6FF', accent:'#4A1068' },
  { _id:'c3',  name:'Crop Top',       slug:'croptop',        icon:'👚', image: topLogo, color:'#FDF2F8', accent:'#BE185D' },
  { _id:'c4',  name:'Pants',          slug:'pants',          icon:'👖', image: trouserLogo, color:'#EFF6FF', accent:'#2563EB' },
  { _id:'c5',  name:'Shawl',          slug:'shawl',          icon:'🧶', image: shawlLogo, color:'#FFF7ED', accent:'#EA580C' },
  { _id:'c6',  name:'Kidswear',       slug:'kidswear',       icon:'🧸', image: kidsLogo, color:'#ECFDF5', accent:'#059669' },
  { _id:'c7',  name:'Night Gown',     slug:'night-gown',     icon:'👗', image: nightLogo, color:'#F5F3FF', accent:'#7C3AED' },
  { _id:'c8',  name:'Co-ord Sets',    slug:'coord-sets',     icon:'🎽', image: cordLogo, color:'#FBF0D5', accent:'#C9963C' },
  { _id:'c9',  name:'Bags',           slug:'bags',           icon:'👛', image: bagLogo, color:'#FEF3C7', accent:'#B45309' },
  { _id:'c10', name:'Bodycon',        slug:'bodycon',        icon:'💃', image: bodyconLogo, color:'#FCE7F3', accent:'#DB2777' },
  { _id:'c11', name:'Casuals',        slug:'casuals',        icon:'👕', image: casualLogo, color:'#F0FDF4', accent:'#16A34A' },
  { _id:'c12', name:'Churidar Sets',  slug:'churidar-sets',  icon:'🪢', image: churidarLogo, color:'#F8F0FF', accent:'#4A1068' },
];

export const PRODUCTS = [
  {
    _id:'60d5ec4f9b19ca22a03e2c01', name:'Royal Kanjivaram Silk Saree',
    price:9499, originalPrice:14999,
    category:{ name:'Saree', slug:'saree' },
    images:[
      { url:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&q=85', alt:'Kanjivaram Saree' },
      { url:'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=700&q=85', alt:'Saree drape' },
      { url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85', alt:'Saree fabric' },
    ],
    ratings:0, numReviews:0, isFeatured:true, isBestSeller:true, isActive:true,
    description:'Handwoven Kanjivaram silk saree from Tamil Nadu\'s master weavers. Rich zari border with peacock motifs. Includes matching blouse piece. A true heirloom piece that gets passed down through generations.',
    shortDescription:'Handwoven Kanjivaram silk with zari peacock border',
    sizes:[{size:'Free Size',stock:12}], stock:12, sold:189,
    material:'Pure Kanjivaram Silk', occasion:['Wedding','Festival','Party'],
    tags:['silk','kanjivaram','wedding','zari','south-indian'], badge:'Bestseller',
    careInstructions:'Dry clean only. Store in muslin cloth away from direct sunlight.',
    returnPolicy:'15 days easy return',
  },
  {
    _id:'60d5ec4f9b19ca22a03e2c02', name:'Bridal Lehenga — Rani Pink & Gold',
    price:28999, originalPrice:42000,
    category:{ name:'Churidar Sets', slug:'churidar-sets' },
    images:[
      { url:'https://images.unsplash.com/photo-1609502855685-5f4c4b59aabd?w=700&q=85', alt:'Bridal Lehenga' },
      { url:'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=700&q=85', alt:'Lehenga detail' },
    ],
    ratings:0, numReviews:0, isFeatured:true, isActive:true,
    description:'Show-stopping bridal lehenga with heavy hand-embroidered Zardozi work, 3D floral appliqués and real mirror accents. Includes lehenga, blouse & dupatta. Custom stitching available.',
    shortDescription:'Heavy Zardozi & 3D floral bridal lehenga — full set',
    sizes:[{size:'XS',stock:2},{size:'S',stock:4},{size:'M',stock:6},{size:'L',stock:4},{size:'XL',stock:2}],
    stock:18, sold:62, material:'Net & Raw Silk with Velvet Blouse',
    occasion:['Bridal','Wedding'], tags:['bridal','lehenga','zardozi','wedding'], badge:'Luxury',
  },
  {
    _id:'60d5ec4f9b19ca22a03e2c03', name:'Lucknowi Chikankari Kurti Set',
    price:2899, originalPrice:4200,
    category:{ name:'Kurti', slug:'kurti' },
    images:[
      { url:'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=700&q=85', alt:'Chikankari Kurti' },
      { url:'https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=700&q=85', alt:'Kurti detail' },
    ],
    ratings:0, numReviews:0, isNewArrival:true, isActive:true,
    description:'Authentic Lucknowi chikankari kurti with palazzo set. Hand-embroidered by skilled artisans. Lightweight georgette fabric, perfect for all-day wear at office or casual outings.',
    shortDescription:'Authentic hand-embroidered Lucknowi chikankari set',
    sizes:[{size:'XS',stock:8},{size:'S',stock:14},{size:'M',stock:18},{size:'L',stock:12},{size:'XL',stock:7},{size:'XXL',stock:4}],
    stock:63, sold:278, material:'Georgette',
    occasion:['Casual','Office','Festival'], tags:['chikankari','kurti','lucknow','palazzo'], badge:'New Arrival',
  },
  {
    _id:'60d5ec4f9b19ca22a03e2c04', name:'Polki Kundan Bridal Jewelry Set',
    price:4599, originalPrice:7200,
    category:{ name:'Bags', slug:'bags' },
    images:[
      { url:'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=85', alt:'Kundan Set' },
      { url:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=85', alt:'Necklace close up' },
      { url:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700&q=85', alt:'Earrings' },
    ],
    ratings:0, numReviews:0, isNewArrival:true, isFeatured:true, isActive:true,
    description:'Complete 6-piece polki kundan set: necklace, maang tikka, jhumka earrings, nath, haathphool & kamarbandh. Set in 22k gold plating with genuine kundan stones.',
    shortDescription:'6-piece polki kundan bridal set — 22k gold plated',
    sizes:[{size:'Free Size',stock:20}], stock:20, sold:112,
    material:'Gold Plated Brass with Kundan', occasion:['Bridal','Wedding','Festival'],
    tags:['kundan','jewelry','bridal','polki','gold'], badge:'Trending',
  },
  {
    _id:'60d5ec4f9b19ca22a03e2c05', name:'Navratri Chaniya Choli — Peacock Blue',
    price:6499, originalPrice:9800,
    category:{ name:'Churidar Sets', slug:'churidar-sets' },
    images:[
      { url:'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=700&q=85', alt:'Chaniya Choli' },
      { url:'https://images.unsplash.com/photo-1617627143233-51eba64c4756?w=700&q=85', alt:'Embroidery detail' },
    ],
    ratings:0, numReviews:0, isFestival:true, festivalTag:'Navratri Special', isActive:true,
    description:'Stunning peacock-blue chaniya choli with mirror work and hand-embroidered gota patti. Comes with printed dupatta. Lightweight and comfortable for Garba nights.',
    shortDescription:'Mirror-work Navratri chaniya choli with dupatta',
    sizes:[{size:'S',stock:7},{size:'M',stock:10},{size:'L',stock:8},{size:'XL',stock:4}],
    stock:29, sold:44, material:'Rayon & Cotton Blend',
    occasion:['Festival','Garba','Wedding'], tags:['navratri','chaniya','garba','festive'], badge:'Festival Special',
  },
  {
    _id:'60d5ec4f9b19ca22a03e2c06', name:'Banarasi Brocade Saree — Midnight Blue',
    price:5499, originalPrice:10500,
    category:{ name:'Saree', slug:'saree' },
    images:[
      { url:'https://images.unsplash.com/photo-1617627143233-51eba64c4756?w=700&q=85', alt:'Brocade Saree' },
      { url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85', alt:'Brocade weave' },
    ],
    ratings:0, numReviews:0, isFlashSale:true, flashSalePrice:5499, isActive:true,
    description:'Classic midnight-blue Banarasi brocade saree with gold zari weave and floral bootis. A timeless heirloom weave from Varanasi master weavers.',
    shortDescription:'Midnight blue Banarasi brocade with gold zari weave',
    sizes:[{size:'Free Size',stock:9}], stock:9, sold:161,
    material:'Banarasi Brocade Silk', occasion:['Wedding','Party','Festival'],
    tags:['banarasi','brocade','silk','zari'], badge:'Flash Sale',
  },
  {
    _id:'60d5ec4f9b19ca22a03e2c07', name:'Phulkari Embroidered Dupatta',
    price:1599, originalPrice:2400,
    category:{ name:'Shawl', slug:'shawl' },
    images:[
      { url:'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=85', alt:'Phulkari Dupatta' },
      { url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85', alt:'Phulkari close up' },
    ],
    ratings:0, numReviews:0, isNewArrival:true, isActive:true,
    description:'Hand-embroidered Phulkari dupatta in vibrant multicolour thread work on tussar silk base. Each piece is unique — crafted by Punjab artisans using traditional techniques.',
    shortDescription:'Hand-embroidered Phulkari — authentic Punjabi artisan craft',
    sizes:[{size:'Free Size',stock:25}], stock:25, sold:89,
    material:'Tussar Silk', occasion:['Casual','Festival','Wedding'],
    tags:['phulkari','dupatta','punjab','embroidery'], badge:'Artisan Pick',
  },
  {
    _id:'60d5ec4f9b19ca22a03e2c08', name:'Kids Festive Lehenga — Coral & Gold',
    price:1699, originalPrice:2500,
    category:{ name:'Kidswear', slug:'kidswear' },
    images:[
      { url:'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=700&q=85', alt:'Kids Lehenga' },
      { url:'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=700&q=85', alt:'Kids wear detail' },
    ],
    ratings:0, numReviews:0, isNewArrival:true, isFeatured:true, isActive:true,
    description:'Adorable coral and gold lehenga choli for little princesses. Soft fabric, easy-wear design with velcro back closure. Perfect for Diwali, weddings & birthday celebrations.',
    shortDescription:'Soft coral lehenga for girls — velcro back, easy-wear',
    sizes:[{size:'2-3Y',stock:8},{size:'3-4Y',stock:10},{size:'4-5Y',stock:9},{size:'5-6Y',stock:7},{size:'6-7Y',stock:5},{size:'7-8Y',stock:4}],
    stock:43, sold:97, material:'Soft Satin & Net',
    occasion:['Festival','Wedding','Birthday'], tags:['kids','lehenga','girls','diwali'], badge:'Kids Pick',
  },
  {
    _id:'60d5ec4f9b19ca22a03e2c09', name:'Hand-Block Print Anarkali Suit',
    price:3499, originalPrice:5200,
    category:{ name:'Churidar Sets', slug:'churidar-sets' },
    images:[
      { url:'https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=700&q=85', alt:'Anarkali Suit' },
      { url:'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=700&q=85', alt:'Block print detail' },
    ],
    ratings:0, numReviews:0, isFeatured:true, isActive:true,
    description:'Regal hand-block-printed anarkali in Sanganeri print with contrast dupatta. Semi-stitched for custom fitting. Jaipur block-print heritage meets contemporary silhouette.',
    shortDescription:'Hand-block-printed anarkali — Jaipur heritage craft',
    sizes:[{size:'S',stock:6},{size:'M',stock:9},{size:'L',stock:7},{size:'XL',stock:4},{size:'XXL',stock:3}],
    stock:29, sold:54, material:'Pure Cotton',
    occasion:['Casual','Office','Festival'], tags:['anarkali','block-print','jaipur','cotton'], badge:'Artisan',
  },
  {
    _id:'60d5ec4f9b19ca22a03e2c0a', name:'Oxidised Silver Jhumka Set',
    price:899, originalPrice:1400,
    category:{ name:'Bags', slug:'bags' },
    images:[
      { url:'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=85', alt:'Jhumka earrings' },
      { url:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700&q=85', alt:'Earrings close up' },
    ],
    ratings:0, numReviews:0, isBestSeller:true, isActive:true,
    description:'Oversized oxidised silver jhumkas with delicate ghungroo detailing. Lightweight yet impactful. Pairs beautifully with both ethnic and indo-western outfits.',
    shortDescription:'Oxidised silver jhumkas with ghungroo drops',
    sizes:[{size:'Free Size',stock:45}], stock:45, sold:234,
    material:'Oxidised German Silver', occasion:['Casual','Festival','Office'],
    tags:['jhumka','silver','earrings','oxidised'], badge:'Bestseller',
  },
  {
    _id:'60d5ec4f9b19ca22a03e2c0b', name:'Embroidered Velvet Potli Bag',
    price:1299, originalPrice:1999,
    category:{ name:'Bags', slug:'bags' },
    images:[
      { url:'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=700&q=85', alt:'Potli bag' },
      { url:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=85', alt:'Bag interior' },
    ],
    ratings:0, numReviews:0, isNewArrival:true, isActive:true,
    description:'Handcrafted velvet potli bag with zardozi embroidery and gold tassels. Spacious enough for essentials. Perfect gifting option and bridal accessory.',
    shortDescription:'Velvet potli bag with zardozi embroidery & gold tassels',
    sizes:[{size:'Free Size',stock:30}], stock:30, sold:48,
    material:'Velvet & Silk Lining', occasion:['Wedding','Festival','Party'],
    tags:['potli','bag','velvet','zardozi'], badge:'Gifting',
  },
  {
    _id:'60d5ec4f9b19ca22a03e2c0c', name:'Pashmina Sozni Embroidered Shawl',
    price:4299, originalPrice:6500,
    category:{ name:'Shawl', slug:'shawl' },
    images:[
      { url:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=85', alt:'Pashmina Shawl' },
      { url:'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&q=85', alt:'Shawl embroidery' },
    ],
    ratings:0, numReviews:0, isFeatured:true, isBestSeller:true, isActive:true,
    description:'Genuine Kashmiri pashmina shawl with sozni needle embroidery. Feather-light warmth, exquisite craftsmanship — a lifetime investment in luxury.',
    shortDescription:'Genuine Kashmiri pashmina with sozni embroidery',
    sizes:[{size:'Free Size',stock:14}], stock:14, sold:76,
    material:'Pure Pashmina Wool', occasion:['Winter','Wedding','Party'],
    tags:['pashmina','kashmir','shawl','luxury'], badge:'Luxury',
  },
];

export const HERO_BANNERS = [
  { id:1, image:'/images/photo2forbanner.png', gradient:'from-transparent via-violet-900/15 to-plum/65' },
  { id:2,  image:'/images/banner2.png', gradient:'bg-gradient-to-r from-transparent via-rose-600/20 to-rose-600/45' },
  { id:3,  image:'/images/banner3.png', gradient:'from-transparent via-indigo-600/30 to-indigo-650/35' },
];

export const TESTIMONIALS = [
  { id:1, name:'Priya Sharma',    city:'New Delhi',  rating:5, review:'The Kanjivaram saree exceeded every expectation. Wore it to my sister\'s wedding and received compliments all evening! Packaging was exquisite too.', avatar:'PS', product:'Kanjivaram Silk Saree', verified:true },
  { id:2, name:'Kavya Nair',      city:'Bangalore',  rating:5, review:'The chikankari kurti set is so elegant and comfortable. Worn it to three events and always get asked where it\'s from. Will definitely order more!', avatar:'KN', product:'Chikankari Kurti Set', verified:true },
  { id:3, name:'Sneha Iyer',      city:'Chennai',    rating:5, review:'The polki kundan set is absolutely stunning. Every piece is so well made — got so many compliments after posting photos of it!', avatar:'SI', product:'Polki Kundan Set', verified:true },
  { id:4, name:'Ritu Agarwal',    city:'Jaipur',     rating:5, review:'The pashmina shawl is unbelievably soft and warm. It elevated my winter outfits and the weaving craftsmanship is truly premium.', avatar:'RA', product:'Pashmina Shawl', verified:true },
  { id:5, name:'Anita Desai',     city:'Mumbai',     rating:5, review:'The linen palazzo pants set is my new wardrobe favourite. The fit is flattering, the fabric breathes, and it feels chic for both work and weekend.', avatar:'AD', product:'Linen Palazzo Pants Set', verified:true },
  { id:6, name:'Maya Joshi',      city:'Pune',       rating:5, review:'The kids ethnic festive set was perfect for my little one. Soft, bright, and easy to wear — she loved the outfit and it lasted the whole celebration.', avatar:'MJ', product:'Kids Ethnic Festive Set', verified:true },
];

export const TRUST_BADGES = [
  { icon:'🚚', title:'Fast Dispatch', desc:'Quick delivery on every order' },
  { icon:'🔒', title:'Secure Payment', desc:'100% safe transactions' },
  { icon:'↩️', title:'Easy Returns', desc:'15-day hassle-free returns' },
  { icon:'🪡', title:'Artisan Made', desc:'Supporting Indian craftsmen' },
  { icon:'⭐', title:'Premium Quality', desc:'Curated with care' },
];

export const formatPrice = (p) => p != null ? `₹${Number(p).toLocaleString('en-IN')}` : '';
export const getDiscount = (orig, curr) => orig > curr ? Math.round(((orig - curr) / orig) * 100) : 0;
