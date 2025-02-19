import { ChatMessage, InterfaceChatMessage } from "../../models";
import type { ChatResolvers, ResolverTypeWrapper } from "../../types/generatedGraphQLTypes";

/**
 * This resolver function will fetch and return the list of all messages in specified Chat from database.
 * @param parent - An object that is the return value of the resolver for this field's parent.
 * @returns An `object` that contains the list of messages.
 */
export const messages: ChatResolvers["messages"] = async (
  parent,
  _args,
  context,
) => {
  let messages = await ChatMessage.find({
    _id: {
      $in: parent.messages,
    },
  }).lean();

  messages = messages.map((message) => {
    if (message.media) {
      return { ...message, media: `${context.apiRootUrl}${message.media}` };
    }
    return message;
  });

  // Ensure the result conforms to the expected type
  return messages.map(message => ({
    ...message,
    // Add any necessary type adjustments here
  })) as ResolverTypeWrapper<InterfaceChatMessage>[];
};