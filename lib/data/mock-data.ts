export type School = {
  id: string;
  name: string;
  board: string;
  city: string;
  district: string;
  category: "private" | "government";
  medium: string;
  classes: string[];
  coverImage: string;
};

export type KitRequirement = {
  slot: number;
  subject: string;
  title: string;
  publisher: string;
  isMandatory: boolean;
  matchedType: "used" | "new_fill" | "missing";
  grade?: "A+" | "A" | "B";
};

export type Kit = {
  id: string;
  schoolId: string;
  schoolName: string;
  classLabel: string;
  academicYear: string;
  completion: number;
  qualityBand: "A+" | "A" | "Mixed";
  savingsPct: number;
  usedCount: number;
  newFillCount: number;
  totalBooks: number;
  price: number;
  retailPrice: number;
  heroBadge: string;
  status: "verified" | "partial" | "waitlist";
  requirements: KitRequirement[];
};

export type SellerSubmission = {
  id: string;
  sellerName: string;
  schoolName: string;
  classLabel: string;
  status: "pickup_scheduled" | "received" | "graded" | "settled";
  pickupMode: "home_pickup" | "school_drive";
  acceptedItems: number;
  rejectedItems: number;
  payout: number;
};

export type Order = {
  id: string;
  buyerName: string;
  kitId: string;
  schoolName: string;
  classLabel: string;
  status: "confirmed" | "packed" | "out_for_delivery" | "delivered";
  deliveryWindow: string;
  totalAmount: number;
};

export type OpsMetric = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "steady";
};

export const schools: School[] = [
  {
    id: "sgrr-dehradun",
    name: "SGRR Public School",
    board: "CBSE",
    city: "Dehradun",
    district: "Dehradun",
    category: "private",
    medium: "English",
    classes: ["Class 6", "Class 7", "Class 8", "Class 9"],
    coverImage: "/images/school-ridge.svg",
  },
  {
    id: "ggic-haldwani",
    name: "GGIC Haldwani",
    board: "UK Board",
    city: "Haldwani",
    district: "Nainital",
    category: "government",
    medium: "Hindi / English",
    classes: ["Class 6", "Class 7", "Class 8"],
    coverImage: "/images/school-valley.svg",
  },
  {
    id: "saint-joseph",
    name: "St. Joseph's Academy",
    board: "ICSE",
    city: "Dehradun",
    district: "Dehradun",
    category: "private",
    medium: "English",
    classes: ["Class 5", "Class 6", "Class 7"],
    coverImage: "/images/school-forest.svg",
  },
];

export const kits: Kit[] = [
  {
    id: "kit-sgrr-7-2026",
    schoolId: "sgrr-dehradun",
    schoolName: "SGRR Public School",
    classLabel: "Class 7",
    academicYear: "2026-27",
    completion: 92,
    qualityBand: "A+",
    savingsPct: 41,
    usedCount: 8,
    newFillCount: 1,
    totalBooks: 9,
    price: 1490,
    retailPrice: 2525,
    heroBadge: "Top parent pick this week",
    status: "verified",
    requirements: [
      { slot: 1, subject: "English", title: "Honeycomb", publisher: "NCERT", isMandatory: true, matchedType: "used", grade: "A+" },
      { slot: 2, subject: "English", title: "An Alien Hand", publisher: "NCERT", isMandatory: true, matchedType: "used", grade: "A" },
      { slot: 3, subject: "Hindi", title: "Vasant", publisher: "NCERT", isMandatory: true, matchedType: "used", grade: "A+" },
      { slot: 4, subject: "Maths", title: "Mathematics Textbook", publisher: "NCERT", isMandatory: true, matchedType: "used", grade: "A+" },
      { slot: 5, subject: "Science", title: "Science Explorer", publisher: "NCERT", isMandatory: true, matchedType: "used", grade: "A" },
      { slot: 6, subject: "Social Science", title: "Our Pasts II", publisher: "NCERT", isMandatory: true, matchedType: "used", grade: "A+" },
      { slot: 7, subject: "Social Science", title: "Our Environment", publisher: "NCERT", isMandatory: true, matchedType: "used", grade: "A" },
      { slot: 8, subject: "Social Science", title: "Social and Political Life II", publisher: "NCERT", isMandatory: true, matchedType: "used", grade: "A" },
      { slot: 9, subject: "Sanskrit", title: "Ruchira", publisher: "NCERT", isMandatory: false, matchedType: "new_fill" }
    ]
  },
  {
    id: "kit-ggic-6-2026",
    schoolId: "ggic-haldwani",
    schoolName: "GGIC Haldwani",
    classLabel: "Class 6",
    academicYear: "2026-27",
    completion: 74,
    qualityBand: "Mixed",
    savingsPct: 35,
    usedCount: 5,
    newFillCount: 1,
    totalBooks: 8,
    price: 890,
    retailPrice: 1360,
    heroBadge: "Budget-friendly starter kit",
    status: "partial",
    requirements: [
      { slot: 1, subject: "Hindi", title: "Vasant Bhag 1", publisher: "NCERT", isMandatory: true, matchedType: "used", grade: "A" },
      { slot: 2, subject: "English", title: "Honeysuckle", publisher: "NCERT", isMandatory: true, matchedType: "used", grade: "B" },
      { slot: 3, subject: "English", title: "A Pact with the Sun", publisher: "NCERT", isMandatory: true, matchedType: "used", grade: "A" },
      { slot: 4, subject: "Maths", title: "Ganit", publisher: "NCERT", isMandatory: true, matchedType: "used", grade: "A" },
      { slot: 5, subject: "Science", title: "Vigyan", publisher: "NCERT", isMandatory: true, matchedType: "new_fill" },
      { slot: 6, subject: "Social Science", title: "Hamara Ateet", publisher: "NCERT", isMandatory: true, matchedType: "missing" },
      { slot: 7, subject: "Social Science", title: "Prithvi Hamara Awas", publisher: "NCERT", isMandatory: true, matchedType: "used", grade: "A" },
      { slot: 8, subject: "Social Science", title: "Samajik evam Rajnitik Jeevan", publisher: "NCERT", isMandatory: true, matchedType: "missing" }
    ]
  },
  {
    id: "kit-joseph-5-2026",
    schoolId: "saint-joseph",
    schoolName: "St. Joseph's Academy",
    classLabel: "Class 5",
    academicYear: "2026-27",
    completion: 100,
    qualityBand: "A",
    savingsPct: 38,
    usedCount: 7,
    newFillCount: 0,
    totalBooks: 7,
    price: 1980,
    retailPrice: 3190,
    heroBadge: "Fully verified and dispatch-ready",
    status: "verified",
    requirements: [
      { slot: 1, subject: "English", title: "Literary Reader", publisher: "Oxford", isMandatory: true, matchedType: "used", grade: "A" },
      { slot: 2, subject: "English", title: "Grammar Success", publisher: "Pearson", isMandatory: true, matchedType: "used", grade: "A" },
      { slot: 3, subject: "Hindi", title: "Navrang", publisher: "Cordova", isMandatory: true, matchedType: "used", grade: "A+" },
      { slot: 4, subject: "Maths", title: "Target Mathematics", publisher: "Selina", isMandatory: true, matchedType: "used", grade: "A" },
      { slot: 5, subject: "EVS", title: "My Green World", publisher: "Macmillan", isMandatory: true, matchedType: "used", grade: "A+" },
      { slot: 6, subject: "GK", title: "Know More", publisher: "Indiannica", isMandatory: false, matchedType: "used", grade: "A" },
      { slot: 7, subject: "Computer", title: "Digital Steps", publisher: "Kips", isMandatory: false, matchedType: "used", grade: "A" }
    ]
  }
];

export const sellerSubmissions: SellerSubmission[] = [
  {
    id: "sub-1402",
    sellerName: "Ritika Verma",
    schoolName: "SGRR Public School",
    classLabel: "Class 7",
    status: "pickup_scheduled",
    pickupMode: "home_pickup",
    acceptedItems: 0,
    rejectedItems: 0,
    payout: 0,
  },
  {
    id: "sub-1331",
    sellerName: "Kavita Bisht",
    schoolName: "GGIC Haldwani",
    classLabel: "Class 6",
    status: "graded",
    pickupMode: "school_drive",
    acceptedItems: 6,
    rejectedItems: 2,
    payout: 280,
  },
];

export const orders: Order[] = [
  {
    id: "ord-22019",
    buyerName: "Ananya Rawat",
    kitId: "kit-sgrr-7-2026",
    schoolName: "SGRR Public School",
    classLabel: "Class 7",
    status: "packed",
    deliveryWindow: "24 Mar, 4 PM - 7 PM",
    totalAmount: 1490,
  },
  {
    id: "ord-22072",
    buyerName: "Mitali Joshi",
    kitId: "kit-joseph-5-2026",
    schoolName: "St. Joseph's Academy",
    classLabel: "Class 5",
    status: "out_for_delivery",
    deliveryWindow: "23 Mar, 1 PM - 4 PM",
    totalAmount: 1980,
  },
];

export const opsMetrics: OpsMetric[] = [
  { label: "Verified schools", value: "20", delta: "+4 this week", trend: "up" },
  { label: "Ready kits", value: "146", delta: "18 awaiting dispatch", trend: "up" },
  { label: "Fill rate", value: "78%", delta: "steady in core clusters", trend: "steady" },
  { label: "Seller submissions", value: "312", delta: "62 need grading", trend: "up" },
];

export const workflowSteps = [
  {
    title: "Collect locally",
    body: "Run school drives and hyperlocal pickups right after annual exams, when book supply is densest.",
  },
  {
    title: "Grade carefully",
    body: "Each book is checked for edition, markings, binding, and missing pages before it enters kit inventory.",
  },
  {
    title: "Bundle by syllabus",
    body: "AgliClass matches books to the exact school, class, board, and academic year before reservation.",
  },
  {
    title: "Deliver with confidence",
    body: "Parents get a verified kit with clear substitutions, savings, and doorstep or school-gate delivery.",
  },
];

export const faqs = [
  {
    question: "What if my school changes the book list?",
    answer:
      "Every order is attached to a syllabus version. If the school updates it before dispatch, AgliClass flags the difference, rechecks the kit, and asks for approval before any substitution.",
  },
  {
    question: "Can I sell only part of a book set?",
    answer:
      "Yes. AgliClass accepts complete sets and individual books, then routes them into full kits, partial kits, or manual review depending on demand.",
  },
  {
    question: "How do you handle damaged books?",
    answer:
      "Books with missing pages, water damage, severe writing, or broken binding are rejected or recycled. Minor wear is graded transparently as A or B.",
  },
];

export function getKitById(kitId: string) {
  return kits.find((kit) => kit.id === kitId);
}

export function getOrderById(orderId: string) {
  return orders.find((order) => order.id === orderId);
}

export function getSubmissionById(submissionId: string) {
  return sellerSubmissions.find((submission) => submission.id === submissionId);
}
