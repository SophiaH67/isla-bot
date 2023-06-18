use isla_proto::client::hello_world::{isla_chat_client::IslaChatClient, Message};
use std::{collections::HashMap, sync::Arc};
use tokio::sync::Mutex;
use tonic::IntoStreamingRequest;

pub type ConversationPointer = Arc<Mutex<Conversation>>;
pub type MessageId = String;
/// Multiple entries for each conversation. 1 per message in the conversation.
pub type ConversationList = HashMap<MessageId, ConversationPointer>;

/// A conversation is a collection of messages in a room.
#[derive(Debug)]
pub struct Conversation {
    /// The room ID of the conversation.
    pub channel_id: Box<String>,
    /// The messages in the conversation.
    pub messages: Vec<Message>,
    // /// The directives that have yet to be executed
    // /// (i.e. still being executed or waiting on an `also`).
    // directives: Vec<String>,
    pub islachat_client: IslaChatClient<tonic::transport::Channel>,
}

impl Conversation {
    // pub fn is_waiting_for_reply(&self) -> bool {
    //     self.directives
    //         .last()
    //         .map(|directive| directive.to_lowercase() == "also")
    //         .unwrap_or(false)
    // }
    /// Create a new conversation.
    fn new(
        channel_id: Box<String>,
        islachat_client: IslaChatClient<tonic::transport::Channel>,
    ) -> Self {
        Self {
            channel_id,
            islachat_client,
            messages: Vec::new(),
            // directives: Vec::new(),
        }
    }
}

pub fn create_conversation(
    channel_id: Box<String>,
    islachat_client: IslaChatClient<tonic::transport::Channel>,
    conversation_list: &mut ConversationList,
) -> ConversationPointer {
    let convo = Conversation::new(channel_id.clone(), islachat_client);
    let convo_arc = Arc::new(Mutex::new(convo));
    conversation_list.insert(channel_id.to_string(), convo_arc.clone());

    convo_arc
}

// async fn parse_directives(message: &Message) -> Vec<String> {
//     message
//         .content
//         .split("\n\n")
//         .map(|directive| directive.trim())
//         .filter(|directive| !directive.is_empty())
//         .map(|directive| directive.to_owned())
//         .collect()
// }

pub async fn add_message_to_conversation(
    conversation_arc: ConversationPointer,
    message: Message,
    conversation_list: &mut ConversationList,
) {
    let mut conversation = conversation_arc.lock().await;

    conversation_list.insert(message.id.to_string(), conversation_arc.clone());
    conversation.messages.push(message);
}

/// Get a conversation by any message ID in the conversation.
pub async fn get_conversation(
    conversation_list: &mut ConversationList,
    message_id: &MessageId,
) -> Option<ConversationPointer> {
    conversation_list.get(message_id.as_str()).cloned()
}

pub async fn get_or_create_conversation(
    conversation_list: &mut ConversationList,
    message: Message,
) -> ConversationPointer {
    let message_id = message.id.clone();
    let channel_id = message.channel_id.clone();
    let conversation_arc = match get_conversation(conversation_list, &message_id).await {
        Some(conversation_arc) => conversation_arc,
        None => {
            let client = IslaChatClient::connect("http://[::1]:5000").await.unwrap();

            let client_channel = client.conversation(message);
            let conversation_arc = Arc::new(Mutex::new(Conversation::new(Box::new(channel_id))));
            conversation_list.insert(message_id.to_string(), conversation_arc.clone());
            conversation_arc
        }
    };
    conversation_arc
}
