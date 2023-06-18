use std::collections::HashMap;

use crate::conversation;
use isla_proto::client::hello_world::{Message, User};
use matrix_sdk::{
    room::Room,
    ruma::events::room::message::{MessageType, OriginalSyncRoomMessageEvent},
};

static mut conversation_list_static: Option<conversation::ConversationList> = None;

/// Handle room messages.
pub async fn on_room_message(event: OriginalSyncRoomMessageEvent, room: Room) {
    // We only want to log text messages in joined rooms.
    let Room::Joined(room) = room else { return };
    let MessageType::Text(text_content) = &event.content.msgtype else { return };

    // Create conversation list if it doesn't already exist
    if (unsafe { conversation_list_static.is_none() }) {
        unsafe { conversation_list_static = Some(HashMap::new()) };
    }
    let conversation_list = unsafe { conversation_list_static.as_mut().unwrap() };

    // Create message
    let author = User {
        id: event.sender.to_string(),
        is_isla: false,
        mention_string: event.sender.to_string(),
        username: event.sender.to_string(),
    };

    let message = Message {
        author: Some(author),
        channel_id: room.room_id().to_string(),
        content: text_content.body.to_string(),
        id: event.event_id.to_string(),
        reply_to_id: None,
    };

    let conversation =
        conversation::get_or_create_conversation(unsafe { conversation_list }, message).await;

    // Send message to Isla
    conversation
        .lock()
        .await
        .islachat_client
        .send_message(message)
        .await;
}
