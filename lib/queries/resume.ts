export const RESUME_QUERY = `
  query MyQuery {
    resumePage(where: { slug: "resumepage" }) {
      education {
        educationText
        educationCard {
          institution
          degree
          startDate
          endDate
          amountHours
          description
        }
      }
      aboutMe {
        aboutmeText {
          raw
        }
        email
        socialsAboutMe {
          name
          iconSvg
          url
        }
      }
      skill {
        skillText
        skillCard {
          name
          skillIcon
        }
      }
    }
  }
`

export const EXPERIENCE_QUERY = `
  query MyQuery {
    professionalExperience(where: { slug: "experiences" }) {
      mainText
      experienceItem {
        projectName
        title
        startDate
        endDate
        experienceText {
          raw
        }
        technology {
          name
        }
      }
    }
  }
`
