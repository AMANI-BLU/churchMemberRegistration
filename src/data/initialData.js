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
    leaderName: "Sister Aster Bekele",
    leaderContact: "+251 91 482 1102",
    meetingSchedule: "Thursdays at 6:30 PM",
    description: "Leads congregational praise, choral anthems, and special seasonal musical presentations.",
    badgeColor: "#4f46e5"
  },
  {
    id: "min-youth",
    name: "Youth Fellowship",
    category: "Next Generation",
    leaderName: "Brother Dawit Tadesse",
    leaderContact: "+251 92 391 7782",
    meetingSchedule: "Fridays at 7:00 PM",
    description: "Vibrant discipleship, teen fellowship, outreach trips, and spiritual mentorship for ages 13-29.",
    badgeColor: "#0284c7"
  },
  {
    id: "min-women",
    name: "Women's Ministry",
    category: "Discipleship",
    leaderName: "Deaconess Chaltu Dida",
    leaderContact: "+251 91 238 9410",
    meetingSchedule: "2nd Saturday at 10:00 AM",
    description: "Encouraging spiritual growth, prayer partnerships, benevolent community outreach, and sisterhood.",
    badgeColor: "#be185d"
  },
  {
    id: "min-men",
    name: "Men's Ministry",
    category: "Discipleship",
    leaderName: "Deacon Guyo Jaldesa",
    leaderContact: "+251 91 674 8821",
    meetingSchedule: "1st Saturday at 8:00 AM",
    description: "Equipping men as godly leaders, fathers, and servants through breakfast devotionals and service.",
    badgeColor: "#0f766e"
  },
  {
    id: "min-sundayschool",
    name: "Sunday School",
    category: "Education",
    leaderName: "Elder Tirhas Hailu",
    leaderContact: "+251 91 893 4122",
    meetingSchedule: "Sundays at 9:00 AM",
    description: "Structured biblical foundations, memory verses, and age-graded classes for children and pre-teens.",
    badgeColor: "#d97706"
  },
  {
    id: "min-prayer",
    name: "Prayer Group",
    category: "Intercession",
    leaderName: "Sister Meseret Tesfaye",
    leaderContact: "+251 91 439 5510",
    meetingSchedule: "Tuesdays at 6:00 AM & 7:00 PM",
    description: "Dedicated intercessors lifting urgent prayer requests, sick members, church leaders, and global revival.",
    badgeColor: "#7c3aed"
  },
  {
    id: "min-biblestudy",
    name: "Bible Study",
    category: "Discipleship",
    leaderName: "Pastor Bekele Worku",
    leaderContact: "+251 91 349 2810",
    meetingSchedule: "Wednesdays at 7:00 PM",
    description: "In-depth verse-by-verse scriptural examination, doctrine discussions, and practical Christian living.",
    badgeColor: "#2563eb"
  },
  {
    id: "min-evangelism",
    name: "Evangelism Outreach",
    category: "Missions & Care",
    leaderName: "Evangelist Boru Sora",
    leaderContact: "+251 91 512 8890",
    meetingSchedule: "Saturdays at 11:00 AM",
    description: "Street evangelism, hospital visits, neighborhood tract distribution, and following up with seekers.",
    badgeColor: "#e11d48"
  }
];

export const initialFamilies = [
  {
    id: "fam-bekele",
    familyName: "The Bekele Family",
    headMemberId: "MEM-2026-001",
    address: "Kebele 01, Near Yabello Hospital, Yabello",
    contactPhone: "+251 91 238 9410",
    notes: "Active members since 2018. Very supportive of church events."
  },
  {
    id: "fam-jaldesa",
    familyName: "The Jaldesa Family",
    headMemberId: "MEM-2026-003",
    address: "Kebele 02, EECMY Road, Yabello",
    contactPhone: "+251 91 674 8821",
    notes: "Guyo serves as Deacon. Family hosts Bible study group every other month."
  },
  {
    id: "fam-sora",
    familyName: "The Sora Family",
    headMemberId: "MEM-2026-006",
    address: "Kebele 03, Bule Hora Road, Yabello",
    contactPhone: "+251 91 773 1994",
    notes: "Moved from Hawassa last year. Children active in Sunday School."
  },
  {
    id: "fam-tadesse",
    familyName: "The Tadesse Family",
    headMemberId: "MEM-2026-009",
    address: "Kebele 01, Main Market Area, Yabello",
    contactPhone: "+251 91 819 2034",
    notes: "Joined following the annual revival conference."
  }
];

export const initialMembers = [
  {
    id: "mem-001",
    memberId: "MEM-2026-001",
    firstName: "Tamirat",
    lastName: "Bekele",
    gender: "Male",
    dob: "1982-04-14",
    phone: "+251 91 238 9410",
    email: "tamirat.bekele@eecmy-yabello.org",
    address: "Kebele 01, Near Yabello Hospital, Yabello",
    maritalStatus: "Married",
    occupation: "Civil Engineer",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2010-06-18",
      salvationDate: "2008-03-12"
    },
    familyId: "fam-bekele",
    familyRole: "Head of Family",
    ministryIds: ["min-men", "min-biblestudy"],
    registeredAt: "2026-01-10",
    registeredBy: "Admin",
    notes: "Passionate about church building maintenance and men's mentoring."
  },
  {
    id: "mem-002",
    memberId: "MEM-2026-002",
    firstName: "Aster",
    lastName: "Bekele",
    gender: "Female",
    dob: "1985-09-22",
    phone: "+251 91 238 9411",
    email: "aster.bekele@eecmy-yabello.org",
    address: "Kebele 01, Near Yabello Hospital, Yabello",
    maritalStatus: "Married",
    occupation: "High School Counselor",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2012-08-04",
      salvationDate: "2009-07-15"
    },
    familyId: "fam-bekele",
    familyRole: "Spouse",
    ministryIds: ["min-women", "min-choir", "min-prayer"],
    registeredAt: "2026-01-10",
    registeredBy: "Admin",
    notes: "Directs the Women's Ministry prayer chain."
  },
  {
    id: "mem-003",
    memberId: "MEM-2026-003",
    firstName: "Guyo",
    lastName: "Jaldesa",
    gender: "Male",
    dob: "1978-11-03",
    phone: "+251 91 674 8821",
    email: "guyo.jaldesa@eecmy-yabello.org",
    address: "Kebele 02, EECMY Road, Yabello",
    maritalStatus: "Married",
    occupation: "Accountant",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2005-04-10",
      salvationDate: "2003-11-20"
    },
    familyId: "fam-jaldesa",
    familyRole: "Head of Family",
    ministryIds: ["min-men", "min-prayer"],
    registeredAt: "2026-01-15",
    registeredBy: "Admin",
    notes: "Deacon board representative for church finance."
  },
  {
    id: "mem-004",
    memberId: "MEM-2026-004",
    firstName: "Chaltu",
    lastName: "Dida",
    gender: "Female",
    dob: "1980-02-17",
    phone: "+251 91 674 8822",
    email: "chaltu.dida@eecmy-yabello.org",
    address: "Kebele 02, EECMY Road, Yabello",
    maritalStatus: "Married",
    occupation: "Public Health Nurse",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2006-05-14",
      salvationDate: "2004-01-10"
    },
    familyId: "fam-jaldesa",
    familyRole: "Spouse",
    ministryIds: ["min-women", "min-sundayschool"],
    registeredAt: "2026-01-15",
    registeredBy: "Admin",
    notes: "Assists with nursery care and children safety."
  },
  {
    id: "mem-005",
    memberId: "MEM-2026-005",
    firstName: "Liban",
    lastName: "Guyo",
    gender: "Male",
    dob: "2010-07-30",
    phone: "+251 91 674 8823",
    email: "liban.guyo@eecmy-yabello.org",
    address: "Kebele 02, EECMY Road, Yabello",
    maritalStatus: "Single",
    occupation: "Student",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2024-04-21",
      salvationDate: "2023-12-25"
    },
    familyId: "fam-jaldesa",
    familyRole: "Son",
    ministryIds: ["min-youth"],
    registeredAt: "2026-01-15",
    registeredBy: "Evangelist Boru Sora",
    notes: "Plays acoustic guitar in the youth worship group."
  },
  {
    id: "mem-006",
    memberId: "MEM-2026-006",
    firstName: "Boru",
    lastName: "Sora",
    gender: "Male",
    dob: "1984-06-12",
    phone: "+251 91 773 1994",
    email: "boru.sora@eecmy-yabello.org",
    address: "Kebele 03, Bule Hora Road, Yabello",
    maritalStatus: "Married",
    occupation: "Agricultural Extension Officer",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2015-09-12",
      salvationDate: "2013-05-01"
    },
    familyId: "fam-sora",
    familyRole: "Head of Family",
    ministryIds: ["min-men", "min-biblestudy"],
    registeredAt: "2026-02-01",
    registeredBy: "Evangelist Boru Sora",
    notes: "Volunteers with the church livestream and sound system setup."
  },
  {
    id: "mem-007",
    memberId: "MEM-2026-007",
    firstName: "Ayantu",
    lastName: "Gollo",
    gender: "Female",
    dob: "1987-12-05",
    phone: "+251 91 773 1995",
    email: "ayantu.gollo@eecmy-yabello.org",
    address: "Kebele 03, Bule Hora Road, Yabello",
    maritalStatus: "Married",
    occupation: "Pharmacist",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2016-01-24",
      salvationDate: "2014-08-19"
    },
    familyId: "fam-sora",
    familyRole: "Spouse",
    ministryIds: ["min-choir", "min-women"],
    registeredAt: "2026-02-01",
    registeredBy: "Evangelist Boru Sora",
    notes: "Soprano in the church choir."
  },
  {
    id: "mem-008",
    memberId: "MEM-2026-008",
    firstName: "Tirhas",
    lastName: "Hailu",
    gender: "Female",
    dob: "1965-03-14",
    phone: "+251 91 893 4122",
    email: "tirhas.hailu@eecmy-yabello.org",
    address: "Kebele 02, Old Post Office Area, Yabello",
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
    firstName: "Dawit",
    lastName: "Tadesse",
    gender: "Male",
    dob: "1994-08-19",
    phone: "+251 91 819 2034",
    email: "dawit.tadesse@eecmy-yabello.org",
    address: "Kebele 01, Main Market Area, Yabello",
    maritalStatus: "Married",
    occupation: "Graphic Designer",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Unbaptized",
      baptismDate: "",
      salvationDate: "2026-02-18"
    },
    familyId: "fam-tadesse",
    familyRole: "Head of Family",
    ministryIds: ["min-biblestudy"],
    registeredAt: "2026-02-20",
    registeredBy: "Evangelist Boru Sora",
    notes: "Accepted Christ recently; currently preparing for water baptism."
  },
  {
    id: "mem-010",
    memberId: "MEM-2026-010",
    firstName: "Selamawit",
    lastName: "Keno",
    gender: "Female",
    dob: "1996-10-09",
    phone: "+251 91 819 2035",
    email: "selamawit.keno@eecmy-yabello.org",
    address: "Kebele 01, Main Market Area, Yabello",
    maritalStatus: "Married",
    occupation: "Elementary Teacher",
    status: "Active",
    spiritualInfo: {
      baptismStatus: "Baptized",
      baptismDate: "2018-09-02",
      salvationDate: "2016-11-12"
    },
    familyId: "fam-tadesse",
    familyRole: "Spouse",
    ministryIds: ["min-sundayschool", "min-women"],
    registeredAt: "2026-02-20",
    registeredBy: "Evangelist Boru Sora",
    notes: "Enthusiastic about teaching Bible stories to younger kids."
  },
  {
    id: "mem-011",
    memberId: "MEM-2026-011",
    firstName: "Natnael",
    lastName: "Abebe",
    gender: "Male",
    dob: "2002-05-15",
    phone: "+251 91 492 7104",
    email: "natnael.abebe@eecmy-yabello.org",
    address: "Kebele 03, University College Area, Yabello",
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
    registeredBy: "Evangelist Boru Sora",
    notes: "College campus fellowship coordinator."
  },
  {
    id: "mem-012",
    memberId: "MEM-2026-012",
    firstName: "Meseret",
    lastName: "Tesfaye",
    gender: "Female",
    dob: "1991-01-28",
    phone: "+251 91 601 3349",
    email: "meseret.tesfaye@eecmy-yabello.org",
    address: "Kebele 01, Stadium Road, Yabello",
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
    registeredBy: "Sister Aster Bekele",
    notes: "First time visitor last Sunday; requested follow-up call regarding foundation classes."
  },
  {
    id: "mem-013",
    memberId: "MEM-2026-013",
    firstName: "Yohannes",
    lastName: "Gudina",
    gender: "Male",
    dob: "1948-12-01",
    phone: "+251 91 321 9988",
    email: "yohannes.gudina@eecmy-yabello.org",
    address: "Kebele 02, Senior Living Quarter, Yabello",
    maritalStatus: "Widowed",
    occupation: "Retired Evangelist",
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
