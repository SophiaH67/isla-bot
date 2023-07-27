export type MatrixEvent = MatrixChatEvent | MatrixStateEvent;

export interface MatrixChatEvent {
  type: "m.room.message";
  content: {
    msgtype: "m.text";
    body: string;
    "m.relates_to"?: {
      "m.in_reply_to"?: {
        event_id?: string;
      };

      "rel_type"?: "m.thread";
      "event_id"?: string;
    };
  };
  sender: string;
  room_id: string;
  event_id: string;
  origin_server_ts: number;
  unsigned: {
    age: number;
    transaction_id: string;
  };
}

export interface MatrixStateEvent {
  type: "m.room.member";
  content: {
    membership: "join" | "leave" | "invite" | "ban";
    avatar_url?: string;
    displayname?: string;
  };
  state_key: string;
  sender: string;
  room_id: string;
  event_id: string;
  origin_server_ts: number;
  unsigned: {
    age: number;
    transaction_id: string;
  };
}
