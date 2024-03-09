export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "OpenLabel",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  navBar: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Request Labels",
      href: "/request",
    },
    {
      title: "Label Data",
      href: "/label",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
