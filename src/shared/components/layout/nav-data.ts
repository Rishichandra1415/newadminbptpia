export interface NavItem {
  title: string;
  href: string;
  iconPath: string;
  items?: { title: string; href: string }[];
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    iconPath: "M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zm-11 0h7v7H3v-7z",
  },
  {
    title: "Master",
    href: "/admin/master/state",
    iconPath:
      "M12 2C6.48 2 2 4.02 2 6.5s4.48 4.5 10 4.5 10-2.02 10-4.5S17.52 2 12 2zm0 18c-5.52 0-10-2.02-10-4.5v-3c0 2.48 4.48 4.5 10 4.5s10-2.02 10-4.5v3c0 2.48-4.48 4.5-10 4.5s-10-2.02-10-4.5v3z",
    items: [
      { title: "State", href: "/admin/master/state" },
      { title: "City", href: "/admin/master/city" },
      // { title: "Course Applied For", href: "/admin/master/course" },
      { title: "Branch Applied For", href: "/admin/master/branch" },
      { title: "Choice Of Examcenter", href: "/admin/master/examination-center" },
    ],
  },
  {
    title: "Government Letter",
    href: "/admin/gov-letter",
    iconPath:
      "M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z",
  },
  {
    title: "List of Colleges",
    href: "/admin/colleges",
    iconPath:
      "M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM3.88 9L12 4.58 20.12 9 12 13.42 3.88 9zM12 15.5c-3.11 0-5.85-1.59-7.43-4L3 13c1.91 2.96 5.22 5 9 5s7.09-2.04 9-5l-1.57-1.5c-1.58 2.41-4.32 4-7.43 4z",
  },
  {
    title: "Media Gallery",
    href: "/admin/media",
    iconPath:
      "M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z",
    items: [
      { title: "Photo Gallery", href: "/admin/media/photo" },
      { title: "Video Gallery", href: "/admin/media/video" },
    ],
  },
  {
    title: "News/Events",
    href: "/admin/news",
    iconPath:
      "M20 2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 1.99 2H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 14H5v-2h14v2zm0-4H5v-2h14v2zm0-4H5V6h14v2z",
  },
  {
    title: "Contact Lead",
    href: "/admin/contact",
    iconPath:
      "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.89 2 1.99 2H20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
  },
  {
    title: "Result",
    href: "/admin/results",
    iconPath:
      "M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z",
  },
  {
    title: "Application Form",
    href: "/admin/admission-form",
    iconPath: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
  },
  {
    title: "Admission Enquiry",
    href: "/admin/enquiry",
    iconPath:
      "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z",
  },
  // {
  //   title: "Slider Images",
  //   href: "/admin/sliders",
  //   iconPath: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
  // },
  {
    title: "Downloads",
    href: "/admin/downloads",
    iconPath: "M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z",
  },
  {
    title: "Settings",
    href: "/admin/profile",
    iconPath: "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.21.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z",
  },
  // {
  //   title: "Support Section",
  //   href: "/admin/support",
  //   iconPath: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"
  // },
  // {
  //   title: "Official Download",
  //   href: "/admin/official-download",
  //   iconPath: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zM12 12h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V12z"
  //},
];
