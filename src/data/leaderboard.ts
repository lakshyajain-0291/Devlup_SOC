export interface Contributor {
  id: number;
  name: string;
  avatar: string;
  github: string;
  contributions: number;
}

export const contributors: Contributor[] = [
  {
    id: 1,
    name: "Parth",
    avatar: "avatars/pro.png",
    github: "https://github.com",
    contributions: 6,
  },
  {
    id: 2,
    name: "Aaditi",
    avatar: "avatars/pro2.webp",
    github: "https://github.com",
    contributions: 4,
  },
  {
    id: 3,
    name: "Rishi",
    avatar: "avatars/pro3.webp",
    github: "https://github.com",
    contributions: 4,
  },
  {
    id: 4,
    name: "Vivek",
    avatar: "avatars/pro4.webp",
    github: "https://github.com",
    contributions: 4,
  },
];
