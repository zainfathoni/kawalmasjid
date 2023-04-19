/**
 * EDITME: Site Config and Meta Config
 *
 * Site-wide info and meta data, mostly for information and SEO purpose
 */

import { configDev } from "~/configs";

// For general
export const configSite = {
  domain: configDev.isDevelopment ? "localhost:3000" : "kawalmasj.id",

  slug: "rewinds",
  name: "Kawal Masjid",
  title: "Kawal Masjid: Infaq Online Masjid seluruh Indonesia",
  description:
    "Kawal Masjid berusaha menghalau pemalsuan/penggantian QR code di kotak amal masjid.",

  links: {
    website: "https://kawalmasj.id",
    github: "https://github.com/zainfathoni/kawalmasjid",
    twitter: "https://twitter.com/kawalmasjid",
    youtube: "https://youtube.com/kawalmasjid",
    facebook: "https://facebook.com/kawalmasjid",
    instagram: "https://instagram.com/kawalmasjid",
    devTo: "https://dev.to/kawalmasjid",
    hashnode: "https://hashnode.com/kawalmasjid",
    showwcase: "https://showwcase.com/kawalmasjid",
  },

  twitter: {
    site: "@kawalmasjid",
    creator: "@kawalmasjid",
  },

  navItems: [
    { to: "/", name: "Home", icon: "home" },
    { to: "/about", name: "About", icon: "about" },
    { to: "/places", name: "Direktori", icon: "places" },
  ],
};

// For Remix meta function
export const configMeta = {
  defaultName: configSite?.name,
  defaultTitle: configSite?.title,
  defaultTitleSeparator: "—",
  defaultDescription: configSite?.description,

  locale: "en_US",
  url: configDev.isDevelopment
    ? "http://localhost:3000"
    : `https://${configSite?.domain}`,
  canonicalPath: "/",
  color: "#3399cc",
  ogType: "website",
  ogImageAlt: configSite?.title,
  ogImageType: "image/png",
  ogImagePath: "/assets/opengraph/rewinds-og.png",
  twitterImagePath: "/assets/opengraph/rewinds-og.png",
  fbAppId: "",

  author: {
    name: "Kawal Masjid",
    handle: "@kawalmasjid",
    url: "https://kawalmasj.id",
    company: {
      name: "Kawal Masjid",
      handle: "@kawalmasjid",
      url: "https://kawalmasj.id",
    },
  },

  mailingListName: "Rewind and Catalyze",
};
