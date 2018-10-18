import gql from 'graphql-tag';
// user queries
const GET_USER_DATA = gql `
    {
      getUserData{
        firstName
        lastName
        role
        id
      }
  }`

//student queries
  const GET_STUDENTS_BY_PARENT = (parentId) => {
      return gql `
      {
        allStudents(condition: {parent: "${parentId}"}) {
          edges {
            node {
              userByStudent {
                id
                firstName
                lastName
              }
            }
          }
        }
      }`}
// event Queries
const GET_EVENTS = gql`{
allEvents {
    edges {
      node {
        eventType
        address
        activityByEventType{
          name
        }
        id
        addressByAddress {
          alias
          id
        }
        openRegistration
        closeRegistration
        price
        capacity
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
`;


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
}`;

export {GET_DROPDOWN_OPTIONS, GET_EVENTS, GET_STUDENTS_BY_PARENT, GET_USER_DATA}
