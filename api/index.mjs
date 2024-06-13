import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

const prefix = ""
const suffix = ""
// const prefix = "reply to the following message as santa claus: "
// const suffix = " [also, give me a present at the end of your reply]"

const invokeBedrock = async ( event ) => {

    const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1' });

    const modelId = 'anthropic.claude-3-sonnet-20240229-v1:0';

    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 300,
        messages: [{
            role: "user",
            content: [{
                type: "text",
                text: prefix + " " + event.body + suffix
            }]
        }]

    }

    const command = new InvokeModelCommand({
        body: JSON.stringify(payload),
        contentType: 'application/json',
        accept: 'application/json',
        modelId
    });

    const response = await bedrockClient.send(command);
    const responseString = JSON.parse(Buffer.from(response.body)).content[0].text;
    return responseString
}

export const handler = async (event) => {
    if(event.body.length < 500) {
            return await invokeBedrock(event)
    }
}