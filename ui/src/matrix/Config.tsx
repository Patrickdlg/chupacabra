export const getRoomFilter = (roomList: Array<string>) => {return {
  room: {
    rooms: roomList,
    state: {
      limit: 0,
      not_types: ['*']
    },
    timeline: {
      limit: 100,
      types: [
        "m.room.message"
      ]
    },
    ephemeral: {
      limit: 0,
      not_types: ["*"]
    }
  },
  presence: {
    limit: 0,
    not_types: ["*"]
  },
  account_data: {
    limit: 0,
    not_types: ["*"]
  },
  event_format: "client",

}}

export const VALIDATE_STATUS = (status: number) => {
    return status < 500;
}

// TODO: Find a better way to handle updating login / stored cred interface
// Hopefully not updated often
export const MATRIX_CREDS_STORAGE_KEY = 'chupacabra_matrix_creds_1'
export const MATRIX_SYNC_KEY = 'chupacabra_matrix_sync_key'
export const CHUPA_POST_KEY = 'chupacabra_post_'
export const CHUPA_MESSAGE_KEY = 'chupacabra_message_'

export const CLIENT_API_PATH = '/_matrix/client/r0'
export const MEDIA_API_PATH = '/_matrix/media/r0'
