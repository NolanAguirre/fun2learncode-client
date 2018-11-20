import gql from 'graphql-tag'
// user queries
const GET_USER_DATA = gql `
    {
        __typename
      getUserData{
          __typename
        firstName
        lastName
        role
        id
      }
  }`

// student queries
const GET_STUDENTS_BY_PARENT = (parentId) => {
    return gql `
      {
        allStudents(condition: {parent: "${parentId}"}) {
          edges {
            node {
              id
              userByStudent {
                id
                firstName
                lastName
              }
            }
          }
        }
      }`
}
// event Queries
const GET_EVENTS = gql `query eventsQuery{
allEvents {
    edges {
      node {
        id
        eventType
        address
        openRegistration
        closeRegistration
        price
        capacity
        activityByEventType{
          id
          name
        }
        addressByAddress {
          alias
          id
        }
        dateGroupsByEvent {
          edges {
            node {
              openRegistration
              closeRegistration
              id
              datesJoinsByDateGroup {
                edges {
                  node {
                    id
                    dateIntervalByDateInterval {
                      start
                      end
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`

// other
const GET_DROPDOWN_OPTIONS = gql `
{
  allActivityCatagories{
    edges{
      node{
        id
        name
      }
    }
  }
  allActivities{
    edges{
      node{
        name
        id
        activityCatagoryByType{
          name
        }
      }
    }
  }
  allAddresses{
    edges{
      node{
        id
        street
        city
        state
        alias
      }
    }
  }
}`
const Query = {
  fragments: {
    activityCatagories: gql `
        fragment activityCatagories on Query{
        allActivityCatagories{
            __typename
          edges{
              __typename
            node{
                __typename
              id
              name
            }
          }
        }
    }`,
    userData:gql`
    fragment userData on Query{
        getUserData{
          firstName
          lastName
          role
          id
        }
    }`
    }
}

export {
    GET_DROPDOWN_OPTIONS,
    GET_EVENTS,
    GET_STUDENTS_BY_PARENT,
    GET_USER_DATA,
    Query
}
