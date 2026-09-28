// Realistic initial dataset for EECMY YABELLO Congregation
// (Ethiopian Evangelical Church Mekane Yesus - Yabello)

export const initialChurchSettings = {
  churchName: "EECMY YABELLO",
  tagline: "Proclaiming Christ, Growing in Faith & Serving in Love",
  seniorPastor: "Reverend (Kes) Desta Guyo",
  address: "EECMY Compound, Yabello, Borana, Oromia, Ethiopia",
  phone: "+251 46 443 0122",
  email: "contact@eecmy-yabello.org",
  website: "www.eecmy-yabello.org",
  foundedYear: 1978,
  statement: "Serving the Whole Person: Spiritual Growth, Community Love, and Holy Discipleship."
};

export const initialMinistries = [
  {
    id: "min-choir",
    name: "Sanctuary Choir",
    category: "Worship & Arts",
    leaderName: "Sister Angela Hayes",
    leaderContact: "(555) 482-1102",
    meetingSchedule: "Thursdays at 6:30 PM",
    description: "Leads congregational praise, choral anthems, and special seasonal musical presentations.",
    badgeColor: "#4f46e5"
  },
  {
    id: "min-youth",
    name: "Youth Fellowship",
    category: "Next Generation",
    leaderName: "Brother Caleb Washington",
    leaderContact: "(555) 391-7782",
    meetingSchedule: "Fridays at 7:00 PM",
    description: "Vibrant discipleship, teen fellowship, outreach trips, and spiritual mentorship for ages 13-19.",
    badgeColor: "#0284c7"
  },
  {
    id: "min-women",
    name: "Women's Ministry",
    category: "Discipleship",
    leaderName: "Deaconess Martha Robinson",
    leaderContact: "(555) 238-9410",
    meetingSchedule: "2nd Saturday at 10:00 AM",
    description: "Encouraging spiritual growth, prayer partnerships, benevolent community outreach, and sisterhood.",
    badgeColor: "#be185d"
  },
  {
    id: "min-men",
    name: "Men's Ministry",
    category: "Discipleship",
    leaderName: "Deacon Robert Hernandez",
    leaderContact: "(555) 674-8821",
    meetingSchedule: "1st Saturday at 8:00 AM",
    description: "Equipping men as godly leaders, fathers, and servants through breakfast devotionals and service.",
    badgeColor: "#0f766e"
  },
  {
    id: "min-sundayschool",
    name: "Sunday School",
    category: "Education",
    leaderName: "Elder Grace Adewale",
    leaderContact: "(555) 893-4122",
    meetingSchedule: "Sundays at 9:00 AM",
    description: "Structured biblical foundations, memory verses, and age-graded classes for children and pre-teens.",
    badgeColor: "#d97706"
  },
  {
    id: "min-prayer",
    name: "Prayer Group",
    category: "Intercession",
    leaderName: "Sister Evelyn Vance",
    leaderContact: "(555) 439-5510",
    meetingSchedule: "Tuesdays at 6:00 AM & 7:00 PM",
    description: "Dedicated intercessors lifting urgent prayer requests, sick members, church leaders, and global revival.",
    badgeColor: "#7c3aed"
  },
  {
    id: "min-biblestudy",
    name: "Bible Study",
    category: "Discipleship",
    leaderName: "Pastor David Miller",
    leaderContact: "(555) 349-2810",
    meetingSchedule: "Wednesdays at 7:00 PM",
    description: "In-depth verse-by-verse scriptural examination, doctrine discussions, and practical Christian living.",
    badgeColor: "#2563eb"
  },
  {
    id: "min-evangelism",
    name: "Evangelism Outreach",
    category: "Missions & Care",
    leaderName: "Evangelist Marcus Reed",
    leaderContact: "(555) 512-8890",
    meetingSchedule: "Saturdays at 11:00 AM",
    description: "Street evangelism, hospital visits, neighborhood tract distribution, and following up with seekers.",
    badgeColor: "#e11d48"
  }
];

export const initialFamilies = [
  {
    id: "fam-robinson",
    familyName: "The Robinson Family",
    headMemberId: "MEM-2026-001",
    address: "742 Evergreen Terrace, Springdale, TX 75001",
    contactPhone: "(555) 238-9410",
    notes: "Active members since 2018. Very supportive of church events."
  },
  {
    id: "fam-hernandez",
    familyName: "The Hernandez Family",
    headMemberId: "MEM-2026-003",
    address: "88 Willow Creek Way, Springdale, TX 75002",
    contactPhone: "(555) 674-8821",
    notes: "Robert serves as Deacon. Family hosts Bible study group every other month."
  },
  {
    id: "fam-okafor",
    familyName: "The Okafor Family",
    headMemberId: "MEM-2026-006",
    address: "310 Meadowlane Dr, Springdale, TX 75001",
    contactPhone: "(555) 773-1994",
    notes: "Moved from Houston last year. Children active in Sunday School."
  },
  {
    id: "fam-chen",
    familyName: "The Chen Family",
    headMemberId: "MEM-2026-009",
    address: "512 Pinecrest Blvd, Springdale, TX 75003",
    contactPhone: "(555) 819-2034",
    notes: "Joined following the Spring Revival meeting."
  }
];

export const initialMembers = [
  {
    id: "mem-001",
    memberId: "MEM-2026-001",
    firstName: "Marcus",
    lastName: "Robinson",
    gender: "Male",
    dob: "1982-04-14",
    phone: "(555) 238-9410",
    email: "marcus.robinson@example.com",
    address: "742 Evergreen Terrace, Springdale, TX 75001",
    maritalStatus: "Married",
    occupation: "Civil Engineer",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2010-06-18",
      salvationDate: "2008-03-12"
    },
    familyId: "fam-robinson",
    familyRole: "Head of Family",
    ministryIds: ["min-men", "min-biblestudy"],
    registeredAt: "2026-01-10",
    registeredBy: "Admin",
    notes: "Passionate about church building maintenance and men's mentoring."
  },
  {
    id: "mem-002",
    memberId: "MEM-2026-002",
    firstName: "Martha",
    lastName: "Robinson",
    gender: "Female",
    dob: "1985-09-22",
    phone: "(555) 238-9411",
    email: "martha.robinson@example.com",
    address: "742 Evergreen Terrace, Springdale, TX 75001",
    maritalStatus: "Married",
    occupation: "High School Counselor",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2012-08-04",
      salvationDate: "2009-07-15"
    },
    familyId: "fam-robinson",
    familyRole: "Spouse",
    ministryIds: ["min-women", "min-choir", "min-prayer"],
    registeredAt: "2026-01-10",
    registeredBy: "Admin",
    notes: "Directs the Women's Ministry prayer chain."
  },
  {
    id: "mem-003",
    memberId: "MEM-2026-003",
    firstName: "Robert",
    lastName: "Hernandez",
    gender: "Male",
    dob: "1978-11-03",
    phone: "(555) 674-8821",
    email: "robert.hernandez@example.com",
    address: "88 Willow Creek Way, Springdale, TX 75002",
    maritalStatus: "Married",
    occupation: "Accountant",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2005-04-10",
      salvationDate: "2003-11-20"
    },
    familyId: "fam-hernandez",
    familyRole: "Head of Family",
    ministryIds: ["min-men", "min-prayer"],
    registeredAt: "2026-01-15",
    registeredBy: "Admin",
    notes: "Deacon board representative for church finance."
  },
  {
    id: "mem-004",
    memberId: "MEM-2026-004",
    firstName: "Elena",
    lastName: "Hernandez",
    gender: "Female",
    dob: "1980-02-17",
    phone: "(555) 674-8822",
    email: "elena.h@example.com",
    address: "88 Willow Creek Way, Springdale, TX 75002",
    maritalStatus: "Married",
    occupation: "Pediatric Nurse",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2006-05-14",
      salvationDate: "2004-01-10"
    },
    familyId: "fam-hernandez",
    familyRole: "Spouse",
    ministryIds: ["min-women", "min-sundayschool"],
    registeredAt: "2026-01-15",
    registeredBy: "Admin",
    notes: "Assists with nursery care and children safety."
  },
  {
    id: "mem-005",
    memberId: "MEM-2026-005",
    firstName: "Mateo",
    lastName: "Hernandez",
    gender: "Male",
    dob: "2010-07-30",
    phone: "(555) 674-8823",
    email: "mateo.h@example.com",
    address: "88 Willow Creek Way, Springdale, TX 75002",
    maritalStatus: "Single",
    occupation: "Student",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2024-04-21",
      salvationDate: "2023-12-25"
    },
    familyId: "fam-hernandez",
    familyRole: "Son",
    ministryIds: ["min-youth"],
    registeredAt: "2026-01-15",
    registeredBy: "Evangelist Marcus Reed",
    notes: "Plays acoustic guitar in the youth worship group."
  },
  {
    id: "mem-006",
    memberId: "MEM-2026-006",
    firstName: "Chukwudi",
    lastName: "Okafor",
    gender: "Male",
    dob: "1984-06-12",
    phone: "(555) 773-1994",
    email: "c.okafor@example.com",
    address: "310 Meadowlane Dr, Springdale, TX 75001",
    maritalStatus: "Married",
    occupation: "Software Architect",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2015-09-12",
      salvationDate: "2013-05-01"
    },
    familyId: "fam-okafor",
    familyRole: "Head of Family",
    ministryIds: ["min-men", "min-biblestudy"],
    registeredAt: "2026-02-01",
    registeredBy: "Evangelist Marcus Reed",
    notes: "Volunteers with the church livestream and media setup."
  },
  {
    id: "mem-007",
    memberId: "MEM-2026-007",
    firstName: "Blessing",
    lastName: "Okafor",
    gender: "Female",
    dob: "1987-12-05",
    phone: "(555) 773-1995",
    email: "blessing.okafor@example.com",
    address: "310 Meadowlane Dr, Springdale, TX 75001",
    maritalStatus: "Married",
    occupation: "Pharmacist",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2016-01-24",
      salvationDate: "2014-08-19"
    },
    familyId: "fam-okafor",
    familyRole: "Spouse",
    ministryIds: ["min-choir", "min-women"],
    registeredAt: "2026-02-01",
    registeredBy: "Evangelist Marcus Reed",
    notes: "Soprano in the church choir."
  },
  {
    id: "mem-008",
    memberId: "MEM-2026-008",
    firstName: "Grace",
    lastName: "Adewale",
    gender: "Female",
    dob: "1965-03-14",
    phone: "(555) 893-4122",
    email: "grace.adewale@example.com",
    address: "419 Oakwood Lane, Springdale, TX 75001",
    maritalStatus: "Widowed",
    occupation: "Retired School Principal",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "1985-07-10",
      salvationDate: "1982-02-14"
    },
    familyId: null,
    familyRole: null,
    ministryIds: ["min-sundayschool", "min-prayer", "min-women"],
    registeredAt: "2026-01-05",
    registeredBy: "Admin",
    notes: "Sunday School superintendent and respected church elder."
  },
  {
    id: "mem-009",
    memberId: "MEM-2026-009",
    firstName: "Samuel",
    lastName: "Chen",
    gender: "Male",
    dob: "1994-08-19",
    phone: "(555) 819-2034",
    email: "samuel.chen@example.com",
    address: "512 Pinecrest Blvd, Springdale, TX 75003",
    maritalStatus: "Married",
    occupation: "Graphic Designer",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Unbaptized",
      baptismDate: "",
      salvationDate: "2026-02-18"
    },
    familyId: "fam-chen",
    familyRole: "Head of Family",
    ministryIds: ["min-biblestudy"],
    registeredAt: "2026-02-20",
    registeredBy: "Evangelist Marcus Reed",
    notes: "Accepted Christ recently; currently preparing for water baptism."
  },
  {
    id: "mem-010",
    memberId: "MEM-2026-010",
    firstName: "Hannah",
    lastName: "Chen",
    gender: "Female",
    dob: "1996-10-09",
    phone: "(555) 819-2035",
    email: "hannah.chen@example.com",
    address: "512 Pinecrest Blvd, Springdale, TX 75003",
    maritalStatus: "Married",
    occupation: "Elementary Teacher",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2018-09-02",
      salvationDate: "2016-11-12"
    },
    familyId: "fam-chen",
    familyRole: "Spouse",
    ministryIds: ["min-sundayschool", "min-women"],
    registeredAt: "2026-02-20",
    registeredBy: "Evangelist Marcus Reed",
    notes: "Enthusiastic about teaching Bible stories to younger kids."
  },
  {
    id: "mem-011",
    memberId: "MEM-2026-011",
    firstName: "Joshua",
    lastName: "Taylor",
    gender: "Male",
    dob: "2002-05-15",
    phone: "(555) 492-7104",
    email: "joshua.taylor@example.com",
    address: "128 University Park, Springdale, TX 75002",
    maritalStatus: "Single",
    occupation: "College Student",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2020-08-16",
      salvationDate: "2019-06-20"
    },
    familyId: null,
    familyRole: null,
    ministryIds: ["min-youth", "min-evangelism"],
    registeredAt: "2026-03-01",
    registeredBy: "Evangelist Marcus Reed",
    notes: "College campus fellowship coordinator."
  },
  {
    id: "mem-012",
    memberId: "MEM-2026-012",
    firstName: "Rebecca",
    lastName: "Kauffman",
    gender: "Female",
    dob: "1991-01-28",
    phone: "(555) 601-3349",
    email: "rebecca.k@example.com",
    address: "904 Cedar Crest Dr, Springdale, TX 75001",
    maritalStatus: "Single",
    occupation: "Medical Social Worker",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Unbaptized",
      baptismDate: "",
      salvationDate: ""
    },
    familyId: null,
    familyRole: null,
    ministryIds: [],
    registeredAt: "2026-03-05",
    registeredBy: "Evangelist Sarah Jenkins",
    notes: "First time visitor last Sunday; requested follow-up call regarding foundation classes."
  },
  {
    id: "mem-013",
    memberId: "MEM-2026-013",
    firstName: "Arthur",
    lastName: "Pendleton",
    gender: "Male",
    dob: "1948-12-01",
    phone: "(555) 321-9988",
    email: "arthur.p@example.com",
    address: "105 Senior Gardens Apt 3B, Springdale, TX 75001",
    maritalStatus: "Widowed",
    occupation: "Retired Veteran",
    status: "Inactive",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "1972-04-09",
      salvationDate: "1970-10-15"
    },
    familyId: null,
    familyRole: null,
    ministryIds: ["min-prayer"],
    registeredAt: "2026-01-08",
    registeredBy: "Admin",
    notes: "Homebound due to hip surgery; needs regular pastoral communion visits."
  }
];

