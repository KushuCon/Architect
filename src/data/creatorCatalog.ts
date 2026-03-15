export interface CreatorCatalogEntry {
  name: string;
  region: "india" | "international";
  platform: string;
  domain: string;
  profileUrl: string;
  tags: string[];
  credibilityWeight: number;
}

const youtubeSearch = (query: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

export const creatorCatalog: CreatorCatalogEntry[] = [
  { name: "Striver (takeUforward)", region: "india", platform: "website", domain: "takeuforward.org", profileUrl: "https://takeuforward.org/", tags: ["dsa", "placements", "interviews"], credibilityWeight: 0.98 },
  { name: "Harkirat Singh (100xDevs)", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: "https://www.youtube.com/@harkirat1", tags: ["web dev", "full stack", "cohorts"], credibilityWeight: 0.96 },
  { name: "Hitesh Choudhary", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Hitesh Choudhary"), tags: ["web dev", "full stack"], credibilityWeight: 0.95 },
  { name: "Piyush Garg", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Piyush Garg"), tags: ["web dev", "backend", "system design"], credibilityWeight: 0.94 },
  { name: "Tanay Pratap (neogcamp)", region: "india", platform: "website", domain: "neog.camp", profileUrl: "https://neog.camp/", tags: ["web dev", "career", "placements"], credibilityWeight: 0.92 },
  { name: "Krish Naik", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Krish Naik"), tags: ["ml", "ai", "data science"], credibilityWeight: 0.96 },
  { name: "Arsh Goyal", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Arsh Goyal"), tags: ["dsa", "placements", "interviews"], credibilityWeight: 0.9 },
  { name: "Anuj Bhaiya", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Anuj Bhaiya"), tags: ["dsa", "career", "placements"], credibilityWeight: 0.89 },
  { name: "Shradha Khapra (Apna College)", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Shradha Khapra Apna College"), tags: ["dsa", "web dev"], credibilityWeight: 0.9 },
  { name: "Aditya Verma", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Aditya Verma"), tags: ["dsa", "competitive programming"], credibilityWeight: 0.93 },
  { name: "Abdul Bari", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Abdul Bari"), tags: ["dsa", "algorithms", "cs fundamentals"], credibilityWeight: 0.97 },
  { name: "Nitish Singh (CampusX)", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("CampusX Nitish Singh"), tags: ["ml", "ai", "data science"], credibilityWeight: 0.93 },
  { name: "Sumeet Malik (Pepcoding)", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Pepcoding Sumeet Malik"), tags: ["dsa", "web dev"], credibilityWeight: 0.9 },
  { name: "Kunal Kushwaha", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Kunal Kushwaha"), tags: ["devops", "open source", "career"], credibilityWeight: 0.94 },
  { name: "CodeWithHarry", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("CodeWithHarry"), tags: ["web dev", "python"], credibilityWeight: 0.93 },
  { name: "Gaurav Sen", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Gaurav Sen"), tags: ["system design", "interviews"], credibilityWeight: 0.97 },
  { name: "Love Babbar", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Love Babbar"), tags: ["dsa", "placements"], credibilityWeight: 0.96 },
  { name: "Rachit Jain", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Rachit Jain"), tags: ["competitive programming", "placements"], credibilityWeight: 0.88 },
  { name: "Abhishek Thakur", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Abhishek Thakur"), tags: ["ml", "ai", "kaggle", "data science"], credibilityWeight: 0.95 },
  { name: "Aman Dhattarwal", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Aman Dhattarwal"), tags: ["career", "placements", "roadmaps"], credibilityWeight: 0.89 },
  { name: "Prateek Narang (Coding Blocks)", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Prateek Narang Coding Blocks"), tags: ["competitive programming", "ml"], credibilityWeight: 0.88 },
  { name: "Ankush Singla (Coding Ninjas)", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Ankush Singla Coding Ninjas"), tags: ["dsa", "placements", "courses"], credibilityWeight: 0.88 },
  { name: "Vivek Singh (Apna College)", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Vivek Singh Apna College"), tags: ["dsa", "web dev"], credibilityWeight: 0.87 },
  { name: "Sandeep Jain (GeeksforGeeks)", region: "india", platform: "website", domain: "geeksforgeeks.org", profileUrl: "https://www.geeksforgeeks.org/", tags: ["dsa", "placements", "cs fundamentals"], credibilityWeight: 0.95 },
  { name: "Sagar Soni (Coding Wise)", region: "india", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Sagar Soni Coding Wise"), tags: ["web dev", "python", "ai"], credibilityWeight: 0.84 },

  { name: "NeetCode", region: "international", platform: "website", domain: "neetcode.io", profileUrl: "https://neetcode.io/", tags: ["dsa", "interviews", "placements"], credibilityWeight: 0.98 },
  { name: "Alex Xu (ByteByteGo)", region: "international", platform: "website", domain: "bytebytego.com", profileUrl: "https://bytebytego.com/", tags: ["system design", "interviews"], credibilityWeight: 0.98 },
  { name: "Clement Mihailescu (AlgoExpert)", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Clement Mihailescu AlgoExpert"), tags: ["dsa", "system design", "interviews"], credibilityWeight: 0.93 },
  { name: "Fireship", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Fireship"), tags: ["web dev", "ml", "ai", "tech concepts"], credibilityWeight: 0.95 },
  { name: "Brad Traversy (Traversy Media)", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Traversy Media"), tags: ["web dev", "full stack"], credibilityWeight: 0.96 },
  { name: "Andrej Karpathy", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Andrej Karpathy"), tags: ["ml", "ai", "neural networks"], credibilityWeight: 0.99 },
  { name: "ThePrimeagen", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("ThePrimeagen"), tags: ["dsa", "system performance", "career"], credibilityWeight: 0.9 },
  { name: "freeCodeCamp", region: "international", platform: "website", domain: "freecodecamp.org", profileUrl: "https://www.freecodecamp.org/learn/", tags: ["web dev", "dsa", "certifications"], credibilityWeight: 0.97 },
  { name: "Theo (t3.gg)", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Theo t3.gg"), tags: ["web dev", "full stack", "career"], credibilityWeight: 0.9 },
  { name: "Tech With Tim", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Tech With Tim"), tags: ["python", "ml", "ai"], credibilityWeight: 0.92 },
  { name: "Hussein Nasser", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Hussein Nasser"), tags: ["backend", "system design", "databases"], credibilityWeight: 0.96 },
  { name: "Back To Back SWE", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Back To Back SWE"), tags: ["dsa", "faang interviews"], credibilityWeight: 0.94 },
  { name: "Corey Schafer", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Corey Schafer"), tags: ["python", "web dev"], credibilityWeight: 0.95 },
  { name: "The Net Ninja", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("The Net Ninja"), tags: ["web dev", "full stack"], credibilityWeight: 0.95 },
  { name: "Academind (Max Schwarzmuller)", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Academind Max Schwarzmuller"), tags: ["web dev", "full stack", "courses"], credibilityWeight: 0.94 },
  { name: "Kevin Naughton Jr.", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Kevin Naughton Jr"), tags: ["dsa", "interviews"], credibilityWeight: 0.88 },
  { name: "Nick White", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Nick White"), tags: ["dsa", "leetcode"], credibilityWeight: 0.89 },
  { name: "CS Dojo (YK Sugi)", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("CS Dojo YK Sugi"), tags: ["dsa", "interviews", "career"], credibilityWeight: 0.9 },
  { name: "Josh tried coding", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Josh tried coding"), tags: ["web dev", "career"], credibilityWeight: 0.82 },
  { name: "Exponent", region: "international", platform: "website", domain: "tryexponent.com", profileUrl: "https://www.tryexponent.com/", tags: ["system design", "interviews", "career"], credibilityWeight: 0.94 },
  { name: "Andreas Kling", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Andreas Kling"), tags: ["systems programming", "os dev"], credibilityWeight: 0.9 },
  { name: "Lex Fridman", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Lex Fridman"), tags: ["ml", "ai", "career", "tech concepts"], credibilityWeight: 0.92 },
  { name: "Forrest Knight", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Forrest Knight"), tags: ["career", "productivity", "cs"], credibilityWeight: 0.85 },
  { name: "Web Dev Simplified (Kyle Cook)", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Web Dev Simplified Kyle Cook"), tags: ["web dev", "full stack"], credibilityWeight: 0.93 },
  { name: "Kenny Gunderman", region: "international", platform: "youtube", domain: "youtube.com", profileUrl: youtubeSearch("Kenny Gunderman"), tags: ["dsa", "system design", "interviews"], credibilityWeight: 0.84 },
];
