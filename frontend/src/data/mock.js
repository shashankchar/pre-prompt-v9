export const categories = ["gaming", "reels", "podcasts", "anime", "cinematic", "ads"];

export const featuredEditors = [
  {
    _id: "demo-local-editor",
    username: "editbridge.creator",
    bio: "Short-form and cinematic video editor with a clean, energetic editing style for creator content.",
    editingStyles: ["reels", "cinematic", "ads"],
    software: ["Premiere Pro", "After Effects", "CapCut"],
    languages: ["Hindi", "English"],
    experienceLevel: "intermediate",
    turnaroundTime: "2-4 days",
    pricingRange: "$50-$250",
    availability: "available",
    profilePicture: "/editors/featured-editor.jpeg",
    bannerImage: "https://img.youtube.com/vi/4o5qzkgqtXE/maxresdefault.jpg",
    portfolio: [
      {
        title: "Featured edited video",
        category: "reels",
        videoUrl: "https://youtu.be/4o5qzkgqtXE?si=L8fBsoeiYT30sjXh",
        thumbnailUrl: "https://img.youtube.com/vi/4o5qzkgqtXE/hqdefault.jpg"
      }
    ]
  }
];

export const demoProjects = [
  { _id: "p1", title: "Gaming montage for launch week", status: "In Progress", budget: 300, editor: { name: "CutCraft GG" }, client: { name: "ArcadeHaus" } },
  { _id: "p2", title: "Podcast clips pack", status: "Pending", budget: 180, editor: { name: "ReelRoom" }, client: { name: "Founders Daily" } }
];
