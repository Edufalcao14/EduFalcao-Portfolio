export const PROJECTS_LIST_QUERY = `
  query MyQuery {
    project(where: { slug: "projects" }) {
      mainText
      projectCard {
        slug
        projectName
        projectDescription
        githubUrl
        liveUrl
        thumbPhoto {
          url
        }
        projectSection {
          title
          image {
            url
          }
        }
        technology {
          name
        }
      }
    }
  }
`

export const PROJECT_STATIC_PARAMS_QUERY = `
  query {
    projectCards(first: 100) {
      slug
    }
  }
`

export const getProjectDetailQuery = (slug: string) => `
  query MyQuery {
    projectCard(where: { slug: "${slug}" }) {
      slug
      projectName
      projectDescription
      githubUrl
      liveUrl
      thumbPhoto {
        url
      }
      projectSection {
        title
        image {
          url
        }
      }
      technology {
        name
      }
    }
  }
`
