/**
 * productImages.js
 * 
 * Maps product names and categories to specific, curated Unsplash photo IDs.
 * Each entry matches by lowercase keywords found in the product name.
 * This ensures every product shows a visually relevant image.
 */

const BASE = 'https://images.unsplash.com/photo-';
const PARAMS = '?w=480&h=480&fit=crop&q=80&auto=format';

/**
 * Keyword → array of Unsplash photo IDs (multiple = different gallery views)
 * Ordered by priority (first match wins).
 */
const KEYWORD_PHOTO_MAP = [
  /* ── Kitchen & Cooking ─────────────────────────── */
  {
    keys: ['pressure cooker', 'cooker'],
    ids: [
      '1585515195964-93b6d47baf08',
      '1631769888801-7fc0bb9e30a6',
      '1556909172-54557c7e4fb7',
      '1606787366850-de6330128bfc',
    ],
  },
  {
    keys: ['mixer grinder', 'mixer', 'grinder', 'blender'],
    ids: [
      '1570197788417-0e82375c9371',
      '1464983953574-0892a716854b',
      '1556909172-54557c7e4fb7',
      '1634728868517-3f3e9d543e2a',
    ],
  },
  {
    keys: ['kettle', 'electric kettle'],
    ids: [
      '1544787219-7f47ccb76574',
      '1510972599952-7748bc1a6971',
      '1589939705384-5185137a7f0f',
      '1594744803329-e58b31de8bf5',
    ],
  },
  {
    keys: ['bedsheet', 'bed sheet', 'pillow cover'],
    ids: [
      '1631049307264-da0ec9d70304',
      '1584100936595-c0654b55a2e2',
      '1618221195710-dd6b41faaea6',
      '1567016432779-094069958ea5',
    ],
  },

  /* ── Electronics / Smart Devices ───────────────── */
  {
    keys: ['led bulb', 'smart bulb', 'smart led', 'bulb'],
    ids: [
      '1558618666-fcd25c85cd64',
      '1507003211169-0a1dd7228f2d',
      '1516030269960-5daabc2bc625',
      '1565193566173-7a0ee3dbe261',
    ],
  },
  {
    keys: ['extension board', 'extension', 'socket', 'power strip'],
    ids: [
      '1605043702750-04f7af1b6f7c',
      '1558618666-fcd25c85cd64',
      '1587293852726-70cdb56c2866',
      '1516030269960-5daabc2bc625',
    ],
  },
  {
    keys: ['bluetooth earphone', 'earphone', 'earbuds', 'in-ear'],
    ids: [
      '1590658268037-6bf12165a8df',
      '1484704849700-f032a568e944',
      '1558618047-3c8d69a10d35',
      '1505740420928-5e560c06d30e',
    ],
  },
  {
    keys: ['headphone', 'over-ear', 'gaming headset'],
    ids: [
      '1505740420928-5e560c06d30e',
      '1484704849700-f032a568e944',
      '1546435770-a3e426bf472b',
      '1524678714210-9917a6c619c2',
    ],
  },
  {
    keys: ['smartphone', 'mobile phone', 'iphone', 'android'],
    ids: [
      '1511707171634-5f897ff02aa9',
      '1585060544812-6b45742d762f',
      '1574944985070-8f3ebc6b79d2',
      '1563203369-26f2e4a5ccf7',
    ],
  },
  {
    keys: ['laptop', 'macbook', 'notebook computer'],
    ids: [
      '1496181133206-80ce9b88a853',
      '1517336714731-489689fd1ca8',
      '1603302576837-37561b2e2302',
      '1525547719571-a2d4ac8945e2',
    ],
  },
  {
    keys: ['smartwatch', 'smart watch', 'wearable', 'fitness band'],
    ids: [
      '1523275335684-37898b6baf30',
      '1579586337278-3befd40fd17a',
      '1508685096489-eafbe14b2b3a',
      '1546868871-7041f2a55e12',
    ],
  },
  {
    keys: ['camera', 'dslr', 'mirrorless', 'photography'],
    ids: [
      '1516035069371-29a1b244cc32',
      '1510127034890-ba27508e9f1c',
      '1452780212582-9c56b2b3d23c',
      '1612198188060-c7c2a3b66eae',
    ],
  },
  {
    keys: ['monitor', 'display', 'screen'],
    ids: [
      '1527443224154-c4a3942d3acf',
      '1593642632559-0c6d3fc62b89',
      '1545665277-3d813b41e7cf',
      '1498049794561-7780e7231661',
    ],
  },
  {
    keys: ['tablet', 'ipad'],
    ids: [
      '1544244015-0df4512b8c72',
      '1561154464-062a816a4289',
      '1527443060795-0402a28a5e6c',
      '1589739900266-43f73875e17c',
    ],
  },
  {
    keys: ['gaming', 'console', 'playstation', 'xbox', 'controller'],
    ids: [
      '1593505309488-de4c28467087',
      '1542751371-adc38448a05e',
      '1616440347437-b1c73416efc6',
      '1606144042614-b2417e99daed',
    ],
  },

  /* ── Student & Office ───────────────────────────── */
  {
    keys: ['backpack', 'school bag', 'rucksack'],
    ids: [
      '1553062407-98eeb64c6a62',
      '1581605405669-fcdf81165afa',
      '1622560480605-d83c853bc5c3',
      '1491553895911-0055eca6402d',
    ],
  },
  {
    keys: ['water bottle', 'steel bottle', 'insulated bottle'],
    ids: [
      '1602143407151-7111542de6e8',
      '1523362628745-0c100150b504',
      '1558618666-fcd25c85cd64',
      '1519681393784-d120267933ba',
    ],
  },
  {
    keys: ['study lamp', 'table lamp', 'desk lamp', 'led lamp'],
    ids: [
      '1534401429219-1082f8b0c29b',
      '1518640467011-51c8caa48e39',
      '1605116901573-e1649c9fa51a',
      '1565073624497-ac38f4b7f58e',
    ],
  },
  {
    keys: ['notebook', 'diary', 'journal', 'ruled'],
    ids: [
      '1517842645767-c639042777db',
      '1531346680769-a1d79b57de5c',
      '1471107340929-a87cd0f5b5f3',
      '1455390582262-044a8bc0f3ab',
    ],
  },
  {
    keys: ['lunch box', 'lunchbox', 'tiffin', 'executive lunch'],
    ids: [
      '1546069901-ba9599a7e63c',
      '1498579687545-d5a4fffb0a9e',
      '1567620905732-2d1ec7ab7445',
      '1574484284002-952d92456975',
    ],
  },
  {
    keys: ['office chair', 'chair cushion', 'seat cushion', 'memory foam'],
    ids: [
      '1555041469-a586c61ea9bc',
      '1519125323398-675f0ddb6308',
      '1541888946425-d81bb19240f5',
      '1497366216548-37526070297c',
    ],
  },

  /* ── Kids & Baby ──────────────────────────────── */
  {
    keys: ['diaper', 'baby diaper', 'nappy'],
    ids: [
      '1515488042361-ee00e0ddd4e4',
      '1492562080023-ab3db95bfbce',
      '1555252333-9f8e92e65df9',
      '1584839404274-bc66de9a1f3e',
    ],
  },
  {
    keys: ['story book', 'kids book', 'children book', 'illustrated'],
    ids: [
      '1512820790803-83ca734da794',
      '1497633762265-9d179a990aa6',
      '1526243741027-444d633d7365',
      '1457369804613-52c61a468e7d',
    ],
  },
  {
    keys: ['toy', 'teddy', 'doll', 'plush'],
    ids: [
      '1558171813-1d5f96536df1',
      '1515488042361-ee00e0ddd4e4',
      '1507003211169-0a1dd7228f2d',
      '1517331306534-4f4a3640df70',
    ],
  },

  /* ── Men's Products ───────────────────────────── */
  {
    keys: ["men's shirt", 'casual shirt', 'cotton shirt', 'checked shirt'],
    ids: [
      '1602810316693-3667c854239a',
      '1620799139507-2a76f79a2f4d',
      '1594938298603-a3554582831f',
      '1489987707025-afc232f7ea0f',
    ],
  },
  {
    keys: ['beard trimmer', 'trimmer', 'shaver', 'grooming'],
    ids: [
      '1621607512214-68297480165e',
      '1556761175-5973dc0f32e7',
      '1612817288484-eec704e7c952',
      '1503951914875-452162b0f3f1',
    ],
  },
  {
    keys: ["men's watch", 'wrist watch', 'analog watch'],
    ids: [
      '1523275335684-37898b6baf30',
      '1546868871-7041f2a55e12',
      '1542496658-e33a6d0d6187',
      '1508685096489-eafbe14b2b3a',
    ],
  },
  {
    keys: ["men's shoes", 'sneakers', 'sports shoes'],
    ids: [
      '1542291026-7eec264c27ff',
      '1608231387042-720e6d9a4aaa',
      '1606107557195-0e29a4b5b4aa',
      '1514989771522-6d99c10d4f85',
    ],
  },

  /* ── Women's Products ─────────────────────────── */
  {
    keys: ['kurti', 'kurta', 'indian dress', 'ethnic'],
    ids: [
      '1583391733956-3750e0ff4e8b',
      '1558618047-3c8d69a10d35',
      '1596783074918-cca6ae2d0739',
      '1583391733741-b36e5b3baba5',
    ],
  },
  {
    keys: ['hair dryer', 'hair dryer', 'blow dryer'],
    ids: [
      '1527799820374-dcf8d9d4a388',
      '1522337360826-0e14b7f87e2c',
      '1580870069867-74c57ee1bb07',
      '1519681393784-d120267933ba',
    ],
  },
  {
    keys: ["women's dress", "women's top", "women's clothing"],
    ids: [
      '1469334031218-e382a71b716b',
      '1594938298603-a3554582831f',
      '1558618047-3c8d69a10d35',
      '1583391733956-3750e0ff4e8b',
    ],
  },

  /* ── Health & Wellness ────────────────────────── */
  {
    keys: ['yoga mat', 'exercise mat', 'gym mat'],
    ids: [
      '1575052814086-f385e2e2ad1b',
      '1506629082955-511b1aa562c8',
      '1518611012118-696072aa579a',
      '1571019613454-1cb2f99b2d8b',
    ],
  },
  {
    keys: ['weighing scale', 'weight scale', 'digital scale', 'body scale'],
    ids: [
      '1589829545856-d10d557cf95f',
      '1511688878353-3a2f5be94cd7',
      '1569163166982-b7c9e2a2d32d',
      '1576086213369-97a306d36557',
    ],
  },
  {
    keys: ['first aid', 'medical kit', 'bandage', 'healthcare'],
    ids: [
      '1603398938378-e54eab446dde',
      '1584308666744-60d5ac0f6f11',
      '1576671081837-0de8edc85a49',
      '1559757148-5c350d0d3c56',
    ],
  },
];

/**
 * Category-level fallback images when no keyword matches.
 */
const CATEGORY_PHOTO_MAP = {
  'Electronics':              ['1498049794561-7780e7231661', '1518770660439-4636190af475', '1581091226825-a6a2a5aee158', '1519389950473-47ba0277781c'],
  'Kitchen & Home':           ['1556909172-54557c7e4fb7', '1556909114-f6e7ad7d3136', '1585515195964-93b6d47baf08', '1631049307264-da0ec9d70304'],
  'Student Essentials':       ['1553062407-98eeb64c6a62', '1517842645767-c639042777db', '1534401429219-1082f8b0c29b', '1602143407151-7111542de6e8'],
  'Kids & Baby':              ['1515488042361-ee00e0ddd4e4', '1512820790803-83ca734da794', '1533482043774-1e1ea4e0e5e6', '1493946820527-a6515ba35f20'],
  'Men':                      ['1602810316693-3667c854239a', '1621607512214-68297480165e', '1523275335684-37898b6baf30', '1489987707025-afc232f7ea0f'],
  'Women':                    ['1583391733956-3750e0ff4e8b', '1527799820374-dcf8d9d4a388', '1469334031218-e382a71b716b', '1558618047-3c8d69a10d35'],
  'Office & Study':           ['1517842645767-c639042777db', '1546069901-ba9599a7e63c', '1555041469-a586c61ea9bc', '1497366216548-37526070297c'],
  'Health & Personal Care':   ['1575052814086-f385e2e2ad1b', '1603398938378-e54eab446dde', '1589829545856-d10d557cf95f', '1506629082955-511b1aa562c8'],
  'default':                  ['1472851294608-062f824d29cc', '1483985988338-bbf9e45bd6da', '1607082348824-0a96f2a4b9da', '1556742049-0cfed4f6a45d'],
};

/**
 * Get the Unsplash image URL for a product.
 * 
 * @param {Object} product  - product object with .name and .category
 * @param {number} [index]  - image variant index (0 = primary, 1-3 = gallery)
 * @returns {string}        - full image URL
 */
export function getProductImage(product, index = 0) {
  const name = (product?.name || '').toLowerCase();

  // 1. Try keyword match
  for (const entry of KEYWORD_PHOTO_MAP) {
    if (entry.keys.some((k) => name.includes(k))) {
      const ids = entry.ids;
      const id  = ids[Math.min(index, ids.length - 1)];
      return `${BASE}${id}${PARAMS}`;
    }
  }

  // 2. Category fallback
  const catIds =
    CATEGORY_PHOTO_MAP[product?.category] || CATEGORY_PHOTO_MAP['default'];
  const id = catIds[Math.min(index, catIds.length - 1)];
  return `${BASE}${id}${PARAMS}`;
}

/**
 * Get all gallery images for a product (up to 4).
 */
export function getProductGallery(product) {
  return [0, 1, 2, 3].map((i) => getProductImage(product, i));
}
