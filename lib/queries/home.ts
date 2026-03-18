export const HOME_QUERY = `
  query MyQuery {
    page(where: { slug: "home" }) {
      introduction {
        raw
      }
      socials {
        iconSvg
        name
        url
      }
    }
  }
`
