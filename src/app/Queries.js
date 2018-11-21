import gql from 'graphql-tag'
// user queries
const GET_USER_DATA = gql `
    {
        __typename
      getUserData{
          __typename
          nodeId
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
      nodes {
          nodeId
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
            nodes {
                nodeId
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
          id
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
            nodes{
              id
              name

          }
        }
    }`,
    userData:gql`
    fragment userData on Query{
        __typename
        getUserData{
            __typename
            nodeId
          firstName
          lastName
          role
          id
        }
    }`,
    activities: gql`
    fragment activities on Query{
    allActivities(orderBy:TYPE_ASC){
        nodes{
            name
            description
            id
            eventPrerequisitesByPrerequisite{
               nodes{
                 activityByEvent{
                   name
                   id
                 }

             }
           }
            activityCatagoryByType{
              name
              id
            }
        }
      }
    }`
    }
}
const GET_ACTIVITIES_IN_CATAGORY = (name) => {
  return gql`
    {
        allActivityCatagories(condition:{name:"${name}"}){
          nodes{
              nodeId
              id
              name
            activitiesByType{
                nodes{
                    nodeId
                  name
                  description
                  id
                }
              }
            }
          }


    }
    `}
const GET_EVENT_LOGS_FOR_STUDENT = (eventId, studentId) => {
      return gql`
        {
          eventById(id:"${eventId}"){
              activityByEventType{
                 name
               }
               price
               addressByAddress{
                 id
                 alias
                 city
                 street
                 state
                 url
             }
            eventDatesByEvent{
              edges{
                node{
                id
                startTime
                eventRegistrationsByEventDate(condition:{student:"${studentId}"}){
                      node{
                        registeredOn
                        attendance
                      
                    }
                  }
                  eventLogsByEventDate(condition:{student:"${studentId}"}){
                      nodes{
                        comment
                        userByInstructor{
                          firstName
                          lastName
                        }

                    }
                  }
                }
              }
            }
          }
        }`
    }
export {
    GET_DROPDOWN_OPTIONS,
    GET_EVENTS,
    GET_ACTIVITIES_IN_CATAGORY,
    GET_STUDENTS_BY_PARENT,
    GET_EVENT_LOGS_FOR_STUDENT,
    GET_USER_DATA,
    Query
}
