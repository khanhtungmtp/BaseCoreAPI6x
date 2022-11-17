export interface Message {
    id: number;
    senderid: number;
    sender_known_as: string;
    sender_photo_url: string;
    recipientid: number;
    recipient_known_as: string;
    recipient_photo_url: string;
    content: string;
    is_read: boolean;
    date_read: string | null;
    message_sent: string;
}