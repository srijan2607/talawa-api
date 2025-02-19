import "dotenv/config";
import { messages as messagesResolver } from "../../../src/resolvers/Chat/messages";
import { connect, disconnect } from "../../helpers/db";
import type mongoose from "mongoose";
import { ChatMessage } from "../../../src/models";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { TestChatMessageType, TestChatType } from "../../helpers/chat";
import { createTestChatMessage } from "../../helpers/chat";

let testChat: TestChatType;
let testMessage: TestChatMessageType;
let MONGOOSE_INSTANCE: typeof mongoose;

beforeAll(async () => {
  MONGOOSE_INSTANCE = await connect();
  const userOrgChat = await createTestChatMessage();
  testChat = userOrgChat[2];
  testMessage = userOrgChat[3];
});

afterAll(async () => {
  await disconnect(MONGOOSE_INSTANCE);
});

describe("resolvers -> Chat -> messages", () => {
  it(`returns user object for parent.messages`, async () => {
    const parent = testChat?.toObject();
    if (!parent) {
      throw new Error("Parent object is undefined.");
    }

    const messagesPayload = await messagesResolver?.(
      parent,
      {},
      { apiRootUrl: "" },
    );

    const messages = await ChatMessage.find({
      _id: {
        $in: testChat?.messages,
      },
    }).lean();

    expect(messagesPayload).toEqual(messages);
  });

  it(`returns message`, async () => {
    const parent = testChat?.toObject();
    if (!parent) {
      throw new Error("Parent object is undefined.");
    }

    const messagesPayload = await messagesResolver?.(
      parent,
      {},
      { apiRootUrl: "" },
    );

    const messages = await ChatMessage.find({
      _id: {
        $in: testMessage?._id,
      },
    }).lean();

    expect(messagesPayload).toEqual(messages);
  });
});
