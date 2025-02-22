import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Config } from "../../../shared/config";
import { sendMessageToQueue } from "../../aws/sqs";
import { FHIRServerConnector, FHIRServerRequest } from "./connector";

dayjs.extend(utc);

export class FHIRServerConnectorSQS implements FHIRServerConnector {
  async upsertBatch({
    cxId,
    patientId,
    documentId,
    payload,
    requestId,
  }: FHIRServerRequest): Promise<void> {
    const queueUrl = Config.getFHIRServerQueueURL();

    await sendMessageToQueue(queueUrl, payload, {
      messageAttributes: {
        cxId,
        patientId,
        jobId: `${requestId}_${documentId}`,
        startedAt: dayjs.utc().toISOString(),
      },
    });
  }
}
