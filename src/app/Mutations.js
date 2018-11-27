import gql from 'graphql-tag'

const EVENT = {
    CREATE: gql`
mutation ($event: EventInput!) {
  createEvent(input: {event: $event}) {
    event {
      __typename
      nodeId
      id
      eventType
      price
      address
      capacity
      closeRegistration
      openRegistration
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
              nodeId
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
}`,
    UPDATE: gql`
mutation ($id:UUID!, $event: EventPatch!) {
  updateEventById(input: {id: $id, eventPatch: $event}) {
    event {
      __typename
      nodeId
      id
      eventType
      price
      address
      capacity
      closeRegistration
      openRegistration
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
              nodeId
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
}
export {EVENT}
