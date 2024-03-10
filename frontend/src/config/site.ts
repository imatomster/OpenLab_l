export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "OpenLab_l",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  navBar: [
    {
      title: "Request Labels",
      href: "/request",
    },
    {
      title: "Label Data",
      href: "/label",
    },
    {
      title: "alephzero",
      href: "/alephzero",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
}
