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
  nodes {
    nodeId
    id
    userByStudent {
      nodeId
      id
      firstName
      lastName
    }
  }
}
}
`
}
// event Queries
const GET_EVENTS = gql `query eventsQuery {
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
      activityByEventType {
        nodeId
        id
        name
      }
      addressByAddress {
        nodeId
        alias
        id
      }
      dateGroupsByEvent {
        nodes {
          nodeId
          name
          openRegistration
          closeRegistration
          id
          datesJoinsByDateGroup {
            nodes {
              id
              dateIntervalByDateInterval {
                nodeId
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
}`

// other
const GET_DROPDOWN_OPTIONS = gql `
{
  allAddresses {
    nodes {
      nodeId
      id
      city
      street
      state
      alias
      url
    }
  }
  allActivityCatagories {
    nodes {
      nodeId
      id
      name
    }
  }
  allActivities {
    nodes {
      nodeId
      name
      id
      activityCatagoryByType {
        nodeId
        id
        name
      }
    }
  }
}
`
const Query = {
  fragments: {
    activityCatagories: gql `
        fragment activityCatagories on Query{
        allActivityCatagories{
            nodes{
                 nodeId
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
             nodeId
            name
            description
            id
            eventPrerequisitesByPrerequisite{
               nodes{
                    nodeId
                 activityByEvent{
                      nodeId
                   name
                   id
                 }

             }
           }
            activityCatagoryByType{
                 nodeId
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
                  nodeId
                 name
               }
               price
               addressByAddress{
                   nodeId
                 id
                 alias
                 city
                 street
                 state
                 url
             }
            eventDatesByEvent{

                nodes{
                    nodeId
                id
                startTime
                eventRegistrationsByEventDate(condition:{student:"${studentId}"}){
                      node{
                          nodeId

                        registeredOn
                        attendance

                    }
                  }
                  eventLogsByEventDate(condition:{student:"${studentId}"}){
                      nodes{
                        comment
                        nodeId
                        userByInstructor{
                            nodeId
                          firstName
                          lastName
                        }

                    }

                }
              }
            }
          }
        }`
    }
    const GET_EVENTS_OF_TYPE = (id) => { // TODO group this by address so i dont have to load multiple maps
      return gql`{
      allEvents(orderBy: ADDRESS_ASC, condition: {eventType: "${id}"}) {

          nodes {
            capacity
            id
            price
            nodeId
            addressByAddress {
                nodeId
              id
              city
              street
              state
              alias
              url
            }
            dateGroupsByEvent(filter:{openRegistration:{greaterThanOrEqualTo:"${new Date().toISOString()}"},closeRegistration:{lessThanOrEqualTo:"${new Date().toISOString()}"}}){

                nodes {
                    name
                    nodeId
                  openRegistration
                  closeRegistration
                  id
                  datesJoinsByDateGroup {

                      nodes {
                          nodeId
                        dateIntervalByDateInterval {
                            nodeId
                          id
                          end
                          start

                      }

                  }

              }
            }
          }
        }
      }
    }
    `
    }
    const GET_ACTIVITIES = gql`
    {
        allActivityCatagories{
                nodes{
                    nodeId
                    name
                    description
                    id
                }
        }
    }`
const GET_DATE_GROUP_INFO_BY_ID = (id)=>{
    return gql`
    {
  dateGroupById(id:"${id}"){
    nodeId
    id
    name
    openRegistration
    closeRegistration
    datesJoinsByDateGroup{
      nodes{
        nodeId
        id
        dateInterval
        dateIntervalByDateInterval{
          id
          nodeId
          start
          end
        }
      }
    }
    eventByEvent{
      openRegistration
      closeRegistration
      nodeId
    	id
      activityByEventType{
        name
        id
        nodeId
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
    GET_EVENTS_OF_TYPE,
     GET_ACTIVITIES,
     GET_DATE_GROUP_INFO_BY_ID,
    Query
}
